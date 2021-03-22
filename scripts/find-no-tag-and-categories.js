const { filterMarkdowns } = require('./markdown-support');
const path = require('path');
const yaml = require('js-yaml');

filterMarkdowns({
  inputDir: path.join(__dirname, '..', 'src/pages/publish'),
  markdownFilter: ({ path, file }) => {
    if (file.children[0].type !== 'yaml') {
      console.log('第一行不是yaml');
      return true;
    }

    const frontmatter = yaml.load(file.children[0].value);

    if (!frontmatter.tags ) {
      return true;
    }
    return false;
  },
}).subscribe((x) => {
  console.log(x.path);
});
