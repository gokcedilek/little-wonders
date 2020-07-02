import Router from 'next/router';
import { PostForm } from '../../../components/postForm';

const UpdatePost = ({ post }) => {
  const onSuccess = () => Router.push('/posts');

  return (
    <PostForm
      data={{
        header: 'Update a Post',
        url: `/api/posts/${post.id}`,
        method: 'put',
        onSuccess: onSuccess,
      }}
    />
  );
};

UpdatePost.getInitialProps = async (context, axiosClient) => {
  const postId = context.query.postId;
  //fetch info about the post, because we will need the id of the post to make an update request!
  const { data } = await axiosClient.get(`/api/posts/${postId}`);
  return { post: data };
};

export default UpdatePost;
