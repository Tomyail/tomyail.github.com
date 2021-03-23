const { filterMarkdowns } = require('./markdown-support');
const path = require('path');
const yaml = require('js-yaml');
const { reduce } = require('rxjs/operators');
const fs = require('fs');
const lodash = require('lodash');
const filter = require('unist-util-filter');

const getNoLangNodes = (file) =>
  file.children.filter((x) => x.type === 'code' && x.lang == null);
filterMarkdowns({
  inputDir: path.join(__dirname, '..', 'src/pages/publish'),

  markdownFilter: ({ path, file }) => {
    const nodes = getNoLangNodes(file);
    if (nodes && nodes.length) {
      return true;
    }
    return false;
  },
})
  .pipe(
    reduce((acc, { file }) => {
      const frontmatter = yaml.load(file.children[0].value);
      acc[frontmatter.title] = getNoLangNodes(file).map((item) => ({
        lang: '',
        value: item.value,
      }));
      return acc;
    }, {})
  )
  .subscribe((x) => {
    fs.writeFileSync(
      path.join(__dirname, 'code.json'),
      JSON.stringify(x, null, 2),
      'utf-8'
    );
  });
