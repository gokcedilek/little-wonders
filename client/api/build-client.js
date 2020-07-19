import axios from 'axios';

//works for fetching data both when we are executing from the server, and when we are executing from the browser!: from the object it receives as arguments, only take the key "req"
//will be used in getInitialProps - getInitialProps can be executed both on the client side and on the server side, so we need to make requests according to that!
export default ({ req }) => {
  //create a pre-configured axios client by wiring up required domain(baseURL) and headers
  if (typeof window === 'undefined') {
    //on the server
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    //on the browser: browser will automatically include the headers
    return axios.create({
      baseURL: '/',
    });
  }
};
