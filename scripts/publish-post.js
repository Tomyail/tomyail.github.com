const yaml = require('js-yaml');
const fse = require('fs-extra');
const path = require('path');

const createPost = (title, blogPath, tags, dest) => {
  const frontmatter = {
    title,
    tags,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    path: blogPath,
  };

  const frontmatterStr = `---\n${yaml.dump(frontmatter)}---\n`;
  const markdown = `${frontmatterStr}\n开始你的表演`;

  const destFloder = path.join(dest, title);
  fse.mkdirpSync(destFloder);
  fse.writeFileSync(path.join(destFloder, 'index.md'), markdown, 'utf-8');
};

const dest = path.join(__dirname, '../src/pages/publish');

createPost('hello', '/hello-test', ['1', 'asd'], dest);
