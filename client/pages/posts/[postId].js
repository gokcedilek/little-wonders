import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const PostShow = ({ post }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/joins',
    method: 'post',
    body: {
      postId: post.id,
    },
    onSuccess: (join) => Router.push('/joins/[joinId]', `/joins/${join.id}`),
  });

  return (
    <div>
      <h1>{post.title}</h1>
      <h4>{post.description}</h4>
      {errors}
      {/*whenever the user clicks the button, make the request*/}
      <button onClick={doRequest} className="btn btn-primary">
        Join the Event!
      </button>
    </div>
  );
};

//fetch info about the post we will display on this page
//note that we receive the content & client arguments from AppComponent.getInitialProps
PostShow.getInitialProps = async (context, axiosClient) => {
  //retrieve the postid from "context" -- it's in context.query -- because the postId info is stored in the URL
  console.log('postId: ', context.query.postId);
  const postId = context.query.postId;
  //fetch info about the post
  const { data } = await axiosClient.get(`/api/posts/${postId}`);
  console.log(data);
  return { post: data }; //will be merged into props of the component
};

export default PostShow;
