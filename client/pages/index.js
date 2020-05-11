import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are not signed in</h1>
  );
};

//fetch data to figure out who the current user is - ret val becomes props to the component itself!
LandingPage.getInitialProps = async ({ req }) => {
  console.log('landing page!');
  const axiosClient = buildClient({ req });
  const response = await axiosClient.get('/api/users/currentuser');
  return response.data;
};

//OLD VERSION OF getInitialProps
// //this is a function, not a component, so we can't use a hook in here!
// LandingPage.getInitialProps = async ({ req }) => {
//   //decide if we are on the server or on the browser when getInitialProps gets executed (both are possible):
//   //window: only exists in the browser
//   if (typeof window === 'undefined') {
//     //on the server
//     const response = await axios.get(
//       'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
//       {
//         headers: req.headers, //req.headers specifies the domain for ingress-nginx to use (the axios request does not include the domain by itself when it is NOT ISSUED BY THE BROWSER) AND includes the cookie coming from the request
//       }
//     );
//     return response.data;
//   } else {
//     //on the browser
//     const response = await axios.get('/api/users/currentuser');
//     return response.data;
//   }
// };

export default LandingPage;
