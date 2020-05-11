//import bootstrap css (global)
import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

//react component with 2 props: component and pageprops (destructuring)
//we define our custom app component: component: one of the components we create (page we are showing), pageprops: set of components we intended to pass into one of our components
//wrapper for components we want to display --> global bootstrap + show elements we want to show on every page
//custom app component: this will wrap-up pages, this is not a page itself!
const AppComponent = ({ Component, pageProps, currentUser }) => {
  //Component: pass the page-specific server-side rendering info to the Component (page we are trying to show) using pageProps!
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

//1. and 2. mean that we have info fetching capability for the entire app - both info common to every page, and info specific to each page (depending on which page we are rendering)
AppComponent.getInitialProps = async (appContext) => {
  //appContext.component has a reference to the page we are currently trying to render

  //1. fetch data for the app component: info common for every page of our app
  //why did we need that? the "header" that is common to every page needs to be dynamic - it will change based on the CURRENT USER, so every page needs to know about the current user so that we can configure the header accordingly
  const axiosClient = buildClient(appContext.ctx); //appContext.ctx includes the "req" property
  const response = await axiosClient.get('/api/users/currentuser');

  //2. fetch data for the component/page we are currently trying to render (the page's getInitialProps function does the above for us, just call it, if it exists): info for a particular page of our app (if the page doesnt accept any props, then we'll just be sending an empty object)
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  //goal: 1) pageProps needs to be passed down to the page we are trying to display (because for any page, pageProps represents the data the page aims to fetch by server-side rendering) 2) pass response.data.currentUser for the header, so that the header can be customized based on who the current user is
  console.log(response.data.currentUser);
  return {
    pageProps,
    currentUser: response.data.currentUser,
  };
};

export default AppComponent;
