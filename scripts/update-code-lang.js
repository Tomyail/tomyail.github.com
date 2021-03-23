const { mapMakrdowns } = require('./markdown-support');
const path = require('path');
const yaml = require('js-yaml');
const code = require('./code.json');
const lodash = require('lodash');
const vfile = require('to-vfile');

const getNoLangNodes = (file) =>
  file.children.filter((x) => x.type === 'code' && x.lang == null);

const repaceLang = (title, node, code) => {
  const target = code[title].find((item) => item.value === node.value);
  if (!node.lang && target && target.lang) {
    node.lang = target.lang;
  }
};

mapMakrdowns({
  inputDir: path.join(__dirname, '..', 'src/pages/publish'),
  markdownMap: ({ path, file }) => {
    if (file.children[0].type !== 'yaml') {
      console.log('第一行不是yaml');
      return [false, file];
    }

    const frontmatter = yaml.load(file.children[0].value);
    const title = frontmatter.title;

    const nodes = getNoLangNodes(file);

    if (nodes && nodes.length) {
      console.log('ss');
      nodes.forEach((node) => {
        repaceLang(title, node, code);
      });

      return [true, file];
    }

    return [false, file];
  },
}).subscribe((x) => {
  vfile.writeSync(x.content);
});
