//import bootstrap css (global)
import 'bootstrap/dist/css/bootstrap.css';

//react component with 2 props: component and pageprops (destructuring)
//we define our custom app component: component: one of the components we create (page we are showing), pageprops: set of components we intended to pass into one of our components
//wrapper for components we want to display --> global bootstrap + show elements we want to show on every page
export default ({ Component, pageProps }) => {
  return (
    <div>
      <h1>Header!</h1>
      <Component {...pageProps} />
    </div>
  );
};
