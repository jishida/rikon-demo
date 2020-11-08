const config = require('./webpack.config');
config.mode = 'production';
config.devtool = 'source-map';
config.cache = void 0;
config.output.path = `${__dirname}/dist`;
config.plugins = [];
module.exports = config;
