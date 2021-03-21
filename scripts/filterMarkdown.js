var vfile = require('to-vfile');
var report = require('vfile-reporter');
var unified = require('unified');
var parse = require('remark-parse');
var stringify = require('remark-stringify');
var frontmatter = require('remark-frontmatter');
const klaw = require('klaw-sync');
const path = require('path');
const { Observable, from } = require('rxjs');
const { filter, map, mergeAll } = require('rxjs/operators');

const parseMarkdown = (path, filter) => {
  return new Observable((sub) => {
    unified()
      .use(parse)
      .use(stringify)
      .use(frontmatter, ['yaml'])
      .use(() => (file, state, done) => {
        sub.next({ file, result: filter({file, state,path}), path });
        return done();
      })
      .process(vfile.readSync(path), function (err, file) {
        // console.error(report(err || file));
        sub.complete();
      });
  });
};

module.exports = {
  filterMarkdown: ({ inputDir, markdownFilter }) => {
    const markdowns = klaw(inputDir, {
      traverseAll: true,
      filter: (item) => {
        const ext = path.extname(item.path);
        if (ext === '.md') {
          return true;
        }
        return false;
      },
    });

    return from(
      markdowns.map(({ path }) => parseMarkdown(path, markdownFilter))
    ).pipe(
      mergeAll(),
      filter((x) => x.result),
      map((x) => ({ path: x.path,file: x.file }))
    );
  },
};
