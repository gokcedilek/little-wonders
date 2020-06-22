//get request: get all users who signed up for an event

const JoinUsers = ({ users }) => {
  console.log(users);

  //add a list to display joins/users info!

  return <div>Hello!</div>;
};

JoinUsers.getInitialProps = async (context, axiosClient) => {
  console.log('postId: ', context.query.postId);
  const postId = context.query.postId;
  const { data } = await axiosClient.get(`/api/joins/users/${postId}`);
  return { users: data };
};

export default JoinUsers;
