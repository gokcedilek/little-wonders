import Link from 'next/link';

//landing page component ('/')

//the props (arguments) of this component come from the return values of the .getInitialProps function!
const LandingPage = ({ currentUser, posts }) => {
  //loop over posts, build a row for each post
  const postList = posts.map((post) => {
    return (
      <tr key={post.id}>
        <td>{post.title}</td>
        <td>{post.description}</td>
        <td>
          {/* link to a query/wildcard route */}
          {/* "as" specifies the real/actual URL, needed along with "href" */}
          <Link href="/posts/[postId]" as={`/posts/${post.id}`}>
            <a>See the Post!</a>
          </Link>
        </td>
        {post.numPeople - post.joinIds.length <= 0 && (
          <div className="ui left pointing orange label">
            This post is full!
          </div>
        )}
      </tr>
    );
  });

  return (
    <div>
      <h1>Posts</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>{postList}</tbody>
      </table>
    </div>
  );
};

//fetch data to figure out who the current user is - ret val from here becomes props to the component itself!
LandingPage.getInitialProps = async (context, axiosClient, currentUser) => {
  //axiosClient: to make request during the initial rendering process -- fetch all posts
  const { data } = await axiosClient.get('/api/posts'); //destructure data from the "response" object

  //return an object which will be provided as props to the actual component itself (in this case, Landing Page)
  return { posts: data };
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
