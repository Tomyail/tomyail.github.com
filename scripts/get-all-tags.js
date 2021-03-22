const { mapMakrdowns, filterMarkdowns } = require('./markdown-support');
const path = require('path');
const yaml = require('js-yaml');
const { reduce } = require('rxjs/operators');
const fs = require('fs');
const lodash = require('lodash');

filterMarkdowns({
  inputDir: path.join(__dirname, '..', 'src/pages/publish'),
  markdownFilter: ({ path, file }) => {
    if (file.children[0].type !== 'yaml') {
      console.log('第一行不是yaml');
      return false;
    }

    const frontmatter = yaml.load(file.children[0].value);

    if (!frontmatter.tags ) {
      return false;
    }
    return true;
  },
})
  .pipe(
    reduce((acc, { file }) => {
      const frontmatter = yaml.load(file.children[0].value);
      const tags = frontmatter.tags.concat(frontmatter.categories);
      acc[frontmatter.title] = tags;
      return acc;
    }, {})
  )
  .subscribe((x) => {
    const tagMap = Object.entries(x).reduce((acc, [title, tags]) => {
      return tags.reduce((a, t) => {
        if (!a[t]) {
          a[t] = [];
        }
        a[t].push(title);
        return a;
      }, acc);
    }, {});

    fs.writeFileSync(
      path.join(__dirname, 'tags.json'),
      JSON.stringify(
        lodash.mapValues(tagMap, (v) => lodash.uniq(v)),
        null,
        2
      ),
      'utf-8'
    );

  });
