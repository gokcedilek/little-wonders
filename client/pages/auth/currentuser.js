const CurrentUser = ({ currentUser }) => {
  return (
    <div>
      <h4>{currentUser.email}</h4>
      <h4>{currentUser.id}</h4>
    </div>
  );
};

//fetch initial list of joins
CurrentUser.getInitialProps = async (context, axiosClient) => {
  const { data } = await axiosClient.get('/api/users/currentuser');
  //return an object that references this data, this goes to the component itself!
  return { currentUser: data.currentUser };
};

export default CurrentUser;
