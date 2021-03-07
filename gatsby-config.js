const { generateConfig } = require('gatsby-plugin-ts-config');
const path = require('path');
module.exports = generateConfig({
  configDir: path.join(__dirname, './config'),
});

