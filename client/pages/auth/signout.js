import { useEffect } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

export default () => {
  //note that we are not throwing any errors in the signout route handler, so useRequest will not return any errors
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/'),
  });

  //the doRequest func will only called ONCE when it's rendered for the first time (not after every render) so we need to pass in []
  useEffect(() => {
    //async returns a promise, the callback of useEffect returns a cleanup function -- thus, we cannot make the callback of useEffect async!!
    async function signout() {
      await doRequest();
    }
    signout();
  }, []);

  return <div>signing you out...</div>;
};
