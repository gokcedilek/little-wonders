import Router from 'next/router';
import { AuthForm } from '../../components/authForm';

export default () => {
  const onSuccess = () => {
    Router.push('/');
  };

  return (
    <AuthForm
      data={{
        header: 'Sign In',
        url: '/api/users/signin',
        method: 'post',
        onSuccess: onSuccess,
      }}
    />
  );
};
