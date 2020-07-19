//import bootstrap css (global)
import 'bootstrap/dist/css/bootstrap.css';
import 'semantic-ui-css/semantic.min.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

//react component with 2 props: component and pageprops (destructuring)
//we define our custom app component: component: one of the components we create (page we are showing), pageprops: set of components we intended to pass into one of our components
//wrapper for components we want to display --> global bootstrap + show elements we want to show on every page
//custom app component: this will wrap-up pages, this is not a page itself!
const AppComponent = ({ Component, pageProps, currentUser }) => {
  //Component: pass the page-specific server-side rendering info to the Component (page we are trying to show) using pageProps! Component is the actual page we are trying to show!
  //pageProps: the result of calling getInitialProps on the child component (not the app component) - props of the (inner) component we are trying to show
  //currentUser: we need to make sure that every child component receives currentUser as a prop!
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        {/*to create right-left borders around the component*/}
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

//1. and 2. mean that we have info fetching capability for the entire app - both info common to every page, and info specific to each page (depending on which page we are rendering)
AppComponent.getInitialProps = async (appContext) => {
  //appContext.component has a reference to the page we are currently trying to render

  //1. fetch data for the app component: info common for every page of our app
  //why did we need that? the "header" that is common to every page needs to be dynamic - it will change based on the CURRENT USER, so every page needs to know about the current user so that we can configure the header accordingly!
  const axiosClient = buildClient(appContext.ctx); //appContext.ctx includes the "req" property
  const response = await axiosClient.get('/api/users/currentuser');

  //2. fetch data for the component/page we are currently trying to render (appContext.Component is the page we are showing, so call its getInitialProps function, if it exists): info for a particular page of our app
  let pageProps = {};
  //if the component makes use of getInitialProps, below is the data it will be provided with. otherwise, pageProps will be empty
  if (appContext.Component.getInitialProps) {
    //provide to the child component's (appContext.Component) getInitialProps: the already-built client, and info about the currentUser (which is in response.data) -- these 3 arguments (context, client, data about currentUser) will be provided to all components' getInitialProps functions!!!
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      axiosClient,
      response.data.currentUser
    );
  }

  //goal: 1) pageProps needs to be passed down to the page we are trying to display (because for any page, pageProps represents the data the page aims to fetch by server-side rendering) 2) pass response.data.currentUser for the header, so that the header can be customized based on who the current user is
  return {
    pageProps,
    currentUser: response.data.currentUser,
  };
};

export default AppComponent;
