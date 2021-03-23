const { filterMarkdowns } = require('./markdown-support');
const path = require('path');
const yaml = require('js-yaml');
const { reduce } = require('rxjs/operators');
const fs = require('fs');
const lodash = require('lodash');
const filter = require('unist-util-filter');

const getLangNodes = (file) => file.children.filter((x) => x.type === 'code');

filterMarkdowns({
  inputDir: path.join(__dirname, '..', 'src/pages/publish'),

  markdownFilter: ({ path, file }) => {
    const nodes = getLangNodes(file);
    if (nodes && nodes.length) {
      return true;
    }
    return false;
  },
})
  .pipe(
    reduce((acc, { file }) => {
      // const frontmatter = yaml.load(file.children[0].value);

      return acc.concat(getLangNodes(file).map((item) => item.lang));
    }, [])
  )
  .subscribe((x) => {
    const result = lodash.uniq(x);
    fs.writeFileSync(
      path.join(__dirname, 'all-code.json'),
      JSON.stringify(result, null, 2)
    );
    // fs.writeFileSync(
    // path.join(__dirname, 'code.json'),
    // JSON.stringify(x, null, 2),
    // 'utf-8'
    // );
  });
