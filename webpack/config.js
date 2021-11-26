// Get the babel configuration
const babelConfig = require('../babel.config.js');
require("@babel/register")(babelConfig);
// Now process the webpack configuration
module.exports = Object.assign({}, require('./commonConfig.js'));