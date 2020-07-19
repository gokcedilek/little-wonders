//load by nextjs automatically when our project starts up
//fixing file change detection of nextjs in a docker container - poll every file every 300ms
module.exports = {
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
