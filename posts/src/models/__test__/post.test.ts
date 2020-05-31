//test to check that the "version" field in the Post collection will be tracked automatically, and does not let us save records out of order!
import { Post } from '../post';

//updates to the same db instance/record simultaneously: we will only process one of the updates!
it('implements optimistic concurrency control', async (done) => {
  //create a post
  const post = Post.build({
    title: 'jfks',
    description: 'jsfbks',
    price: 5,
    userId: 'kjsbsk',
    numPeople: 5,
  });

  //save the post to db
  await post.save();

  //fetch the post twice
  const firstInstance = await Post.findById(post.id);
  const secondInstance = await Post.findById(post.id);

  //make two separate changes to the posts we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  //save the first fetched post (should work as expected)
  await firstInstance!.save();

  //save the second fetched post (will have an outdated version number, should result in an error)
  try {
    await secondInstance!.save();
  } catch (err) {
    //tell jest we are done with our tests
    return done();
  }
  throw new Error('should not reach this point!');
});

it('increments the version number on multiple saves', async () => {
  const post = Post.build({
    title: 'jfks',
    description: 'jsfbks',
    price: 5,
    userId: 'kjsbsk',
    numPeople: 5,
  });

  await post.save();
  expect(post.version).toEqual(0);

  //anytime we save a post (we dont need to make an update), we expect the version number to be incremented by 1
  await post.save();
  expect(post.version).toEqual(1);
  await post.save();
  expect(post.version).toEqual(2);
});
