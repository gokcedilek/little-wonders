import Link from 'next/link';

const PostIndex = ({ posts }) => {
  return (
    <ul>
      {posts.map((post) => {
        return (
          <div>
            <li key={post.id}>
              <div>
                <h6>{post.title}</h6>
                <h6>{post.description}</h6>
                <h6>{post.location}</h6>
                <h6>{post.time}</h6>
                <Link
                  href="/posts/update/[postId]"
                  as={`/posts/update/${post.id}`}
                >
                  <a>Update the Event!</a>
                </Link>
                ;
                <Link
                  href="/joins/users/[postId]"
                  as={`/joins/users/${post.id}`}
                >
                  <a>See Participants!</a>
                </Link>
                ;
              </div>
            </li>
          </div>
        );
      })}
    </ul>
  );
};

//fetch initial list of joins
PostIndex.getInitialProps = async (context, axiosClient) => {
  const { data } = await axiosClient.get('/api/posts/of/user');
  return { posts: data };
};

export default PostIndex;
