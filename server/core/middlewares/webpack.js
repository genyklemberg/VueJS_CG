const webpack = require('webpack');
const webpackConfig = require('../../../webpack.config');
const compiler = webpack(webpackConfig);
const path = require("path");
const {dirname, server} = require("../../config");
const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: `http://${server.host}:${server.port}/`,
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }
});

module.exports = (app) => {
  app.use(devMiddleware);
  app.use(require("webpack-hot-middleware")(compiler, {
    log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
  }));
  app.use((req, res, next) => {
    if (req.method === 'GET' && req.accepts('html')) {
      //res.sendFile(paths.src('index.html'), err => err && next());
      res.write(devMiddleware.fileSystem.readFileSync(path.join(dirname, './client/dist/index.html')));
      res.send();
    }
    next();
  })
};
