const glob = require('glob');
const fs = require('fs');
const logger = require('./logger');

let templates;

const loadTemplates = () => {
  try {
    if (!templates) {
      templates = glob.sync("src/templates/*.tmpl")
      .reduce((templates, file) => {
        const key = file.replace(/src\/templates\//, '').replace(/.tmpl/, '');
        templates.set(key, fs.readFileSync(file, 'utf8'));
        return templates;
      }, new Map());
    }
    return templates;
  } catch (e) {
    logger.error(`Could not load templates: ${e}`);
    process.exit(1);
  }
};

module.exports = { loadTemplates };
