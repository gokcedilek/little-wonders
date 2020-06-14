const JoinShow = ({ join }) => {
  return (
    <div>
      <h1>{join.title}</h1>
      <h4>{join.description}</h4>
    </div>
  );
};

JoinShow.getInitialProps = async (context, axiosClient) => {
  const joinId = context.query.joinId;
  //fetch info about the join
  const { data } = await axiosClient.get(`/api/joins/${joinId}`);
  return { join: data }; //will be merged into props of the component
};

export default JoinShow;
