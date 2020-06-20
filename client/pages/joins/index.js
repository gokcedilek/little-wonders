//this component in index.js is accessible at "/joins"

const JoinIndex = ({ joins }) => {
  return (
    <ul>
      {joins.map((join) => {
        <li key={join.id}>{join.post.title}</li>;
      })}
    </ul>
    //note: each join shoukd have a button: cancel join -- if this is clicked, make a delete request to /api/joins/join.post.id
  );
};

//fetch initial list of joins
JoinIndex.getInitialProps = async (context, axiosClient) => {
  const { data } = await axiosClient.get('/api/joins');
  //return an object that references this data, this goes to the component itself!
  return { joins: data };
};

export default JoinIndex;
