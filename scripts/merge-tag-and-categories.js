const { mapMakrdowns } = require('./markdown-support');
const path = require('path');
const yaml = require('js-yaml');
const tags = require('./tags.json');
const lodash = require('lodash');
const vfile = require('to-vfile');

const maybeDumpTitles = Object.keys(tags).reduce((acc, tag) => {
  tags[tag].forEach((title) => {
    if (!acc[title]) {
      acc[title] = [];
    }
    acc[title].push(tag);
  });
  return acc;
}, {});
const tagsbyTitle = lodash.mapValues(maybeDumpTitles, (v) => lodash.uniq(v));

console.log(tagsbyTitle);
mapMakrdowns({
  inputDir: path.join(__dirname, '..', 'src/pages/publish'),
  markdownMap: ({ path, file }) => {
    if (file.children[0].type !== 'yaml') {
      console.log('第一行不是yaml');
      return [false, file];
    }

    const frontmatter = yaml.load(file.children[0].value);

    if (!frontmatter.tags) {
      return [false, file];
    }

    // console.log(frontmatter.title);
    // console.log(tagsbyTitle[frontmatter.title]);

    frontmatter.tags = tagsbyTitle[frontmatter.title];
		if(frontmatter.categories){
			delete frontmatter.categories
		}
    file.children[0].value = yaml.dump(frontmatter);
    return [true, file];
  },
}).subscribe((x) => {
  vfile.writeSync(x.content);
});
