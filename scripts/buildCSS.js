const sass = require('node-sass');
const fse = require('fs-extra');
const glob = require('glob');

module.exports = function() {
  let css = '';
  const scssFiles = glob.sync(`./blocks/*/*.scss`);
  scssFiles.forEach((scssFile) => {
    css += sass.renderSync({ file: scssFile }).css;
  });
  fse.writeFileSync('./temp/pdui.css', css);
};
