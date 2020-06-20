//this component in index.js is accessible at "/posts"
import useRequest from '../../hooks/use-request';
import Link from 'next/link';

const PostIndex = ({ myposts }) => {
  console.log(myposts);

  //how to pass the post id as a parameter???
  // const { doRequest, errors } = useRequest({
  //   url: '/api/posts/:id????',
  //   method: 'put',
  //   body: {
  //     postId: post.id,
  //   },
  //   onSuccess: (join) => Router.push('/joins/[joinId]', `/joins/${join.id}`),
  // });

  return (
    <ul>
      {myposts.map((post) => {
        console.log(post.title);
        <li key={post.id}>{post.title}</li>;
        // <button onClick={doRequest} className="btn btn-primary">
        //   Update the Event!
        // </button>;
        <Link href="/posts/update">
          <a>Update the Event!</a>
        </Link>;
        <Link href="/joins/users">
          <a>See Participants!</a>
        </Link>;
      })}
    </ul>
  );
};

//fetch initial list of joins
PostIndex.getInitialProps = async (context, axiosClient) => {
  const { data } = await axiosClient.get('/api/posts/my/all');
  //return an object that references this data, this goes to the component itself!
  return { myposts: data };
};

export default PostIndex;
