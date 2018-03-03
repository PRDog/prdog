const glob = require('glob');
const fs = require('fs');

const loadTemplates = () => {
  return glob.sync("src/templates/*.tmpl")
    .reduce((templates, file) => {
      const key = file.replace(/src\/templates\//, '').replace(/.tmpl/, '');
      templates.set(key, fs.readFileSync(file, 'utf8'));
      return templates;
    }, new Map());
};

module.exports = { templates : loadTemplates() };
