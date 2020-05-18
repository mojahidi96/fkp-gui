var scssToJson = require('scss-to-json');

module.exports = function() {
  return `module.exports = ${JSON.stringify(scssToJson(this.resourcePath))}`;
};
