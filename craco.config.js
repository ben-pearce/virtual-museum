const GoogleFontsPlugin = require('google-fonts-plugin');
const path = require('path');

module.exports = {
  eslint: {
    enable: true,
  },
  webpack: {
    plugins: {
      add: [new GoogleFontsPlugin(path.resolve(__dirname,'./fonts.config.json'))]
    }
  }
};