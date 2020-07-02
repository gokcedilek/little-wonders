import Link from 'next/link';

const PostIndex = ({ posts }) => {
  return (
    <ul>
      {posts.map((post) => {
        return (
          <div>
            <li key={post.id}>
              <h6>Title: {post.title}</h6>
              <div>
                <Link href="/posts/[postId]" as={`/posts/${post.id}`}>
                  <a>See Details</a>
                </Link>
              </div>
              <div>
                <Link
                  href="/posts/update/[postId]"
                  as={`/posts/update/${post.id}`}
                >
                  <a>Update Details</a>
                </Link>
              </div>
              <div>
                <Link
                  href="/joins/users/[postId]"
                  as={`/joins/users/${post.id}`}
                >
                  <a>See Participants</a>
                </Link>
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
