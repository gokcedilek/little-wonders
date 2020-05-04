import axios from 'axios';

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
