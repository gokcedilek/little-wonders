import { useState } from 'react';

const MessageBox = ({ join, onClick }) => {
  return (
    <div className="ui warning message">
      <i className="close icon" onClick={onClick}></i>
      <div class="header">Please confirm your join!</div>
      Please check your email at {join.user.email} to confirm your join for
      event {join.post.title}!
    </div>
  );
};

const ShowJoin = ({ join }) => {
  const [showMessage, setShowMessage] = useState(true);
  const onClick = () => setShowMessage(false);
  return showMessage ? <MessageBox join={join} onClick={onClick} /> : null;
};

ShowJoin.getInitialProps = async (context, axiosClient) => {
  const joinId = context.query.joinId;
  //fetch info about the join
  const { data } = await axiosClient.get(`/api/joins/${joinId}`);
  return { join: data }; //will be merged into props of the component
};

export default ShowJoin;
