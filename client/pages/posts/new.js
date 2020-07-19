import Router from 'next/router';
import { PostForm } from '../../components/postForm';

const NewPost = () => {
  const onSuccess = () => {
    Router.push('/');
  };

  return (
    <PostForm
      data={{
        header: 'Create a Post',
        url: '/api/posts',
        method: 'post',
        onSuccess: onSuccess,
      }}
    />
  );
};

export default NewPost;
