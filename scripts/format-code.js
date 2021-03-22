const { filterMarkdowns } = require('./markdown-support');
const path = require('path');
const yaml = require('js-yaml');
const { reduce } = require('rxjs/operators');
const fs = require('fs');
const lodash = require('lodash');
const filter = require(())

filterMarkdowns({
  inputDir: path.join(
    __dirname,
    '..',
    'src/pages/publish/2011-10-19-Wordpress 数据迁移指南/'
  ),

  markdownFilter: ({ path, file }) => {
    if (file.children[0].type !== 'yaml') {
      console.log('第一行不是yaml');
      return false;
    }

    const frontmatter = yaml.load(file.children[0].value);

    if (!frontmatter.tags) {
      return false;
    }
    return true;
  },
})
  .pipe(
    reduce((acc, { file }) => {
      const frontmatter = yaml.load(file.children[0].value);
      const tags = frontmatter.tags;
      acc[frontmatter.title] = tags;
      return acc;
    }, {})
  )
  .subscribe((x) => {
    console.log(x);
  });
