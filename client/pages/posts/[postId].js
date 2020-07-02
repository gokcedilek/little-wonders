import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const ShowPost = ({ post }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/joins',
    method: 'post',
    body: {
      postId: post.id,
    },
    onSuccess: (join) => Router.push('/joins/[joinId]', `/joins/${join.id}`),
  });

  const showDirections = () => {
    // Router.push(`//www.google.com/maps/dir/?api=1`);
    const destination = post.location.replace(/\s/g, '+'); //google maps urls
    Router.push(`//www.google.com/maps/dir/?api=1&destination=${destination}`);
  };

  return (
    <div className="ui card">
      <div className="content">
        <div className="header">Event Details</div>
      </div>
      <div className="content">
        <h4 className="ui sub header">{post.title}</h4>
        <div className="ui small feed">
          <div className="event">
            <div className="content">
              <div className="summary">{post.description}</div>
              <div>Time: {post.time}</div>
              <div>Location: {post.location}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="extra content">
        <button class="ui button" onClick={showDirections}>
          View on Google Maps
        </button>
      </div>
      <div className="content">
        <div>Space Remaining: {post.numPeople - post.joinIds.length}</div>
      </div>
      <div class="extra content">
        <button class="ui button" onClick={doRequest}>
          Join the Event
        </button>
        {errors}
      </div>
    </div>
  );
};

//fetch info about the post we will display on this page
//note that we receive the content & client arguments from AppComponent.getInitialProps
ShowPost.getInitialProps = async (context, axiosClient) => {
  //retrieve the postid from "context" -- it's in context.query -- because the postId info is stored in the URL
  const postId = context.query.postId;
  //fetch info about the post
  const { data } = await axiosClient.get(`/api/posts/${postId}`);
  return { post: data }; //will be merged into props of the component
};

export default ShowPost;
