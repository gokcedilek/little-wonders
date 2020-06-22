const ShowJoin = ({ join }) => {
  return (
    <div>
      <h1>{join.status}</h1>
      <h4>{join.user.email}</h4>
    </div>
  );
};

ShowJoin.getInitialProps = async (context, axiosClient) => {
  const joinId = context.query.joinId;
  //fetch info about the join
  const { data } = await axiosClient.get(`/api/joins/${joinId}`);
  return { join: data }; //will be merged into props of the component
};

export default ShowJoin;
