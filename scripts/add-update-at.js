const { mapMakrdowns } = require('./markdown-support');
const path = require('path');
const yaml = require('js-yaml');
const vfile = require('to-vfile');
mapMakrdowns({
  inputDir: path.join(__dirname, '..', 'src/pages/publish'),
  markdownMap: ({ path, file }) => {
    // console.log('ss',path)

    if (file.children[0].type !== 'yaml') {
      console.log('第一行不是yaml');
      return [false, file];
    }

		//todo yaml 加载可能会报错，比如不能出现tab。但是现在这种错误静默导致了对应的文件被忽略了。
    const frontmatter = yaml.load(file.children[0].value);

    if (!frontmatter.tags) {
      return [false, file];
    }

    if (frontmatter.date) {
      frontmatter.created_at = frontmatter.date;
      frontmatter.updated_at = frontmatter.date;
      delete frontmatter.date;

      file.children[0].value = yaml.dump(frontmatter);
      return [true, file];
    }
    return [false, file];
  },
}).subscribe((x) => {
  vfile.writeSync(x.content);
});
