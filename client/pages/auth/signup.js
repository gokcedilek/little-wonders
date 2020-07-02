import Router from 'next/router';
import { AuthForm } from '../../components/authForm';

export default () => {
  const onSuccess = () => {
    Router.push('/');
  };

  return (
    <AuthForm
      data={{
        header: 'Sign Up',
        url: '/api/users/signup',
        method: 'post',
        onSuccess: onSuccess,
      }}
    />
  );
};
