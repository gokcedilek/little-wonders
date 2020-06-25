import { useEffect } from 'react';
import useRequest from '../../../hooks/use-request';
import Router from 'next/router';

const ConfirmJoin = ({ joinId }) => {
  const { doRequest } = useRequest({
    url: `/api/joins/confirmed/${joinId}`,
    method: 'post',
    body: {},
    onSuccess: (join) => {
      console.log('confirmed the join: ', join);
      Router.push('/'); //navigate user to a new route
    },
  });

  //the doRequest func will only called ONCE when it's rendered for the first time (not after every render) so we need to pass in []
  useEffect(() => {
    //async returns a promise, the callback of useEffect returns a cleanup function -- thus, we cannot make the callback of useEffect async!!
    async function confirmJoin() {
      await doRequest();
    }
    confirmJoin();
  }, []);

  return <div>Confirming your join...</div>;
};

ConfirmJoin.getInitialProps = async (context, axiosClient) => {
  console.log('joinId: ', context.query.joinId);
  const joinId = context.query.joinId;
  // const { data } = await axiosClient.get(`/api/joins/users/${postId}`);
  return { joinId: joinId };
};

export default ConfirmJoin;
