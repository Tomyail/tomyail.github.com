---
title: 基于 s3 的单页应用的一种纯前端灰度发布实现
tags:
  - 技术
  - React
path: /a-b-testing-for-create-react-app/
date: 2020-03-13T08:26:59.333Z
---

为什么要做这个功能:

1.  不用借助外部(native) 来修改入口 url, 整个灰度控制完全前端控制
2.  控制线上发布风险

如何实现

去掉打包输出文件 index.html 上面的包含当前打包代码的静态 script 和 style 标签,改成动态读取远程配置文件,然后根据配置结果具体选择加载哪个版本.

## 具体实现细节

网页灰度整个过程分成三个步骤: 打包阶段,部署阶段和运行阶段.

### 打包阶段

为了给外部留有足够的迁移时间,项目同时保留了支持灰度发布的运行在 s3 上的新编译方式,以及传统的基于 k8s+ngnix 反向代理的老编译方式.

原来项目的打包输出目录如下:

```text
├── abtest.json
├── asset-manifest.json
├── favicon.ico
├── index.html
├── manifest.json
├── static
│   ├── css
│   ├── js
│   └── media
└── version.txt
```

新的打包输出目录

```text
├── abtest.json
├── asset-manifest.json
├── dba6651
│   ├── css
│   ├── js
│   ├── media
│   └── meta.json
├── favicon.ico
├── index.html
├── manifest.json
├── version.json
└── version.txt
```

主要区别包含如下几点:

1.  原来的 `static` 目录名称变更为根据当前 git 的 commit id 决定.
2.  新增 version.json 字段,其内容如下:

```json
[
  {
    "version": "1.4.0", //当前版本
    "desc": "1", // 版本描述
    "rate": 0, //此版本触发概率
    "comment": "dba6651", //此版本的 commit id
    "timestamp": "2020-03-13T07:01:23.018Z" //编译时间
  }
]
```

其中最重要的两个字段是`rate` 和 `comment`, 这两个字段的用处将在后面的'运行阶段'详细说明.

3.  原来 index.html 的 body 包含当前编译的打包代码:

```html
<script>
  ...太长省略
</script>
<script src="/static/js/10.e05dc50a.chunk.js"></script>
<script src="/static/js/main.3b6d8fc7.chunk.js"></script>
```

这部分代码在新的 index.html 将不复存在,取而代之的是多出了一段 `运行代码(后面运行阶段说明)`,以及在 commit id 文件夹下面多出来的 `meta.json` 文件. `meta.json` 文件如下:

```json
[
  {
    "tagName": "script",
    "innerHTML": "...太长省略",
    "closeTag": true
  },
  {
    "tagName": "script",
    "voidTag": false,
    "attributes": { "src": "./dba6651/js/10.e05dc50a.chunk.js" }
  },
  {
    "tagName": "script",
    "voidTag": false,
    "attributes": { "src": "./dba6651/js/main.3b6d8fc7.chunk.js" }
  }
]
```

也就是说原来内嵌在 index.html 里面的内容被移到了 `meta.json` 里面.

以上新编译的所有配置,均是通过修改 webpack 配置实现的. 由于当前项目使用了 `create-react-app` 模板,并且不建议 `eject` 项目避免后期维护困难.所以项目借助了 `customize-cra`项目拓展 webpack 配置.

以下代码实现了修改 webpack 配置:

```javascript
/**
 * 以下代码请确保在理解 customize-cra 插件后运行
 */

//当前 commitid
const prefix = gitRevisionPlugin.commithash();

const HtmlWebpackPlugin = require('html-webpack-plugin');

//这个插件的作用是替换 index.html 模板文件里面的特定变量(这里特指模板里面 的
//if ('%DEPLOY_TYPE%' === 's3') loadAbTestFromRemote();)
//运行后 DEPLOY_TYPE 会被替换成 's3' 或者 'k8s', 从而实现只有新的编译方式才使灰度发布生效
class InterpolateHtmlPlugin {
  constructor(htmlWebpackPlugin, replacements) {
    this.htmlWebpackPlugin = htmlWebpackPlugin;
    this.replacements = replacements;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('InterpolateHtmlPlugin', (compilation) => {
      this.htmlWebpackPlugin
        .getHooks(compilation)
        .afterTemplateExecution.tap('InterpolateHtmlPlugin', (data) => {
          // Run HTML through a series of user-specified string replacements.
          Object.keys(this.replacements).forEach((key) => {
            const value = this.replacements[key];
            data.html = data.html.replace(
              new RegExp('%' + key + '%', 'g'),
              value
            );
          });
        });
    });
  }
}

//将 static 目录替换成 git commit id 目录
const modifyOutputPath = (config) => {
  config.output.filename = config.output.filename.replace(
    'static/js',
    `${prefix}/js`
  );
  config.output.chunkFilename = config.output.chunkFilename.replace(
    'static/js',
    `${prefix}/js`
  );

  const loaders = config.module.rules.find((rule) => Array.isArray(rule.oneOf))
    .oneOf;

  loaders
    .filter(({ options }) => options && options.name)
    .forEach(({ options }) => {
      options.name = options.name.replace('static/media', `${prefix}/media`);
    });

  config.plugins
    .filter(
      ({ options }) =>
        (options && options.filename) ||
        (options && options.chunkFilename) ||
        (options && options.inject)
    )
    .forEach(({ options }) => {
      if (options.filename)
        options.filename = options.filename.replace(
          'static/css',
          `${prefix}/css`
        );
      if (options.chunkFilename)
        options.chunkFilename = options.chunkFilename.replace(
          'static/css',
          `${prefix}/css`
        );

      //防止 html 模板注入脚本
      if (options.inject) options.inject = false;
    });

  return config;
};

//这个插件的作用是在拦截 `html-webpack-plugin`插件,将其输出的内容输出到 meta.json 上面,并且把版本信息写入 version.json
class MyPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tapAsync(
        'MyPlugin', // <-- Set a meaningful name here for stacktraces
        (data, cb) => {
          fs.mkdirpSync(path.join(__dirname, 'build', prefix));
          fs.writeFileSync(
            path.join(__dirname, 'build', prefix, 'meta.json'),
            JSON.stringify(data.bodyTags)
          );

          fs.writeFileSync(
            path.join(__dirname, 'build', 'version.json'),
            JSON.stringify([
              {
                version: packageConfig.version,
                desc: '1',
                rate: 0,
                comment: prefix,
                timestamp: new Date(),
              },
            ])
          );

          cb(null, data);
        }
      );
    });
  }
}

//修改配置开始
config.plugins.push(
  new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
    DEPLOY_TYPE: process.env.DEPLOY_TYPE,
  })
);

if (process.env.DEPLOY_TYPE !== 'k8s')
  config.plugins.push(new MyPlugin({ options: '' }));
if (process.env.DEPLOY_TYPE !== 'k8s') config = modifyOutputPath(config);
```

这里的 `DEPLOY_TYPE` 为 k8s 时表示老模式,s3 时表示新模式. 到这里说明了如何修改 webpack 配置输出新的编译目录. 接下来说明如何部署

### 部署阶段

因为当前项目是静态单页应用,所以部署到亚马逊 s3 相比如之前的 k8s,省去了 ngnix 反向代理. 而且用 s3 部署比 k8s 更加节约成本. 大致做法就是利用 aws-sdk 上传代码.

> 利用 s3 的存储方式后,网页的访问入口发生了变化. 而且由于缺少反向代理,前端必须使用 hash 路由

下面说明具体步骤:

1.  下载远程的 version.json 内容并合并到本地的 version.json
2.  为了防止灰度选择版本失败,线上部署始终会保留一份 latest 文件夹.方便当取不到 git comit 时能够安全回退
3.  覆盖上传

```javascript
const cp = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const AWS = require('aws-sdk');
const mime = require('mime');

const downloadVersion = async (s3, s3BucketName, folder) => {
  try {
    const content = await s3
      .getObject({
        Bucket: s3BucketName,
        Key: `${folder}/version.json`,
      })
      .promise();

    return JSON.parse(content.Body.toString());
  } catch (e) {
    if (e.statusCode === 404) {
      console.warn('远程历史版本文件不存在,创建新的远程文件!!');
      return [];
    } else {
      throw e;
    }
  }
};

const upload = async (s3, localFolder, s3RootDir, s3BucketName) => {
  const filesPaths = await walkSync(localFolder);
  for (let i = 0; i < filesPaths.length; i++) {
    const statistics = `(${i + 1}/${filesPaths.length}, ${Math.round(
      ((i + 1) / filesPaths.length) * 100
    )}%)`;
    const filePath = filesPaths[i];
    const fileContent = fs.readFileSync(filePath);
    // If the slash is like this "/" s3 will create a new folder, otherwise will not work properly.
    const relativeToBaseFilePath = path.normalize(
      path.relative(localFolder, filePath)
    );
    s3RootDir = s3RootDir || '';
    const relativeToBaseFilePathForS3 = path
      .join(s3RootDir, relativeToBaseFilePath)
      .split(path.sep)
      .join('/');

    const mimeType = mime.getType(filePath);
    console.log(`Uploading`, statistics, relativeToBaseFilePathForS3);
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
    await s3
      .putObject({
        ACL: `public-read`,
        Bucket: s3BucketName,
        Key: relativeToBaseFilePathForS3,
        Body: fileContent,
        ContentType: mimeType,
      })
      .promise();
    console.log(`Uploaded `, statistics, relativeToBaseFilePathForS3);
  }
};

async function walkSync(dir) {
  const files = fs.readdirSync(dir);
  const output = [];
  for (const file of files) {
    const pathToFile = path.join(dir, file);
    const isDirectory = fs.statSync(pathToFile).isDirectory();
    if (isDirectory) {
      output.push(...(await walkSync(pathToFile)));
    } else {
      output.push(await pathToFile);
    }
  }
  return output;
}

module.exports = context => {
  return {
    fn: async () => {
      console.log('is ci %s', process.env['CI']);
      const config = {
        s3BucketName: '',//远程桶名称
        localFolder: context.outputRoot//本地编译输出目录,
        accessKeyId: '',//s3 accessKeyId
        secretAccessKeyId: '', //s3 secretAccessKeyId
        folder: '',//桶下面的一级目录
        region: '',//s3 地区
        endPoint: 'https://{region}.amazonaws.com.cn',//s3 endpoint
      };

      AWS.config.setPromisesDependency(Promise);

      const s3 = new AWS.S3({
        signatureVersion: 'v4',
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKeyId,
        region: config.region,
        endpoint: config.endPoint,
      });

      //更新本地 version 文件
      const versionJson = await downloadVersion(
        s3,
        config.s3BucketName,
        config.folder
      );
      console.log('远程 json 文件 %o', versionJson);
      const currentVersion = JSON.parse(
        fs.readFileSync(path.join(context.outputRoot, 'version.json'))
      )[0];
      //todo 修改概率
      versionJson.unshift(currentVersion);
      fs.writeFileSync(
        path.join(context.outputRoot, 'version.json'),
        JSON.stringify(versionJson)
      );

      //复制一份 latest
      const GitRevisionPlugin = require('git-revision-webpack-plugin');
      const gitRevisionPlugin = new GitRevisionPlugin({
        commithashCommand: 'rev-parse --short HEAD',
      });
      //需要确保必须是这次 build 出来的,否则 commit 对不上
      const prefix = gitRevisionPlugin.commithash();
      fs.copySync(
        path.join(context.outputRoot, prefix),
        path.join(context.outputRoot, 'latest')
      );
      //将 latest 里面指向原来 comment 的 hash 指向 latest
      const command = process.env.CI
        ? `find ${path.join(
            context.outputRoot,
            'latest'
          )} -type f -exec sed -i -e "s/${prefix}/latest/g" {} \\;`
        : `find ${path.join(
            context.outputRoot,
            'latest'
          )} -type f -exec sed -i '' "s/${prefix}/latest/g" {} \\;`;
      console.log('exec replace with command %s', command);
      cp.execSync(command);

      //上传本地文件到 s3
      await upload(s3, context.outputRoot, config.folder, config.s3BucketName);
      console.log('发布完毕');
    },
  };
};
```

### 运行阶段

运行代码的主要作用是读取远程的 version.json 文件,然后根据里面的 rate 字段在 \[0-1]区间分配比例,之后通过 random 函数取一个随机值,看这个值最终落在哪个区间,之后读取选定的 version 里面的 meta.json 信息,动态拼接到 index.html 上面即可实现动态选择版本.

1.  默认情况下灰度发布不生效,全部使用 latest 版本,这也是第一个步骤生成的 version.json 里面 rate 是 0 的原因(主要懒得配置..)

以下代码是直接写在项目 public 的 index.html 模板文件里面的,之后 `html-webpack-plugin` 插件会把里面的 `PUBLIC_URL` 和 `DEPLOY_TYPE`替换为真实值.

```html
<script>
  //https://babeljs.io/repl
  const getJSON = function (url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
  };

  const choiceVersion = (versions) => {
    const validVersions = versions.filter((version) => version.comment);
    const total = validVersions.reduce((acc, cur) => acc + cur.rate, 0);
    if (total < 1) {
      validVersions.push({
        version: 'latest',
        rate: 1 - total,
      });
    }

    const sorted = validVersions.sort((a, b) => a.rate - b.rate);

    let pre = 0;
    const ranged = sorted.map((v, i) => {
      const now = pre + v.rate;
      const result = { ...v, range: [pre, now] };
      pre = now;
      return result;
    });

    const rate = Math.random();

    const target = ranged.find(
      (item) => rate > item.range[0] && rate <= item.range[1]
    );

    console.log('rate %s,target %o', rate, target);
    return target;
  };
  const applyVersion = (version, data) => {
    data.forEach(function (item) {
      const node = document.createElement(item.tagName, {});
      if (item.innerHTML) node.innerHTML = item.innerHTML;
      Object.keys(item.attributes || {})
        .filter(function (attributeName) {
          return item.attributes[attributeName] !== false;
        })
        .forEach((attributeName) => {
          node.setAttribute(attributeName, item.attributes[attributeName]);
        });

      document.body.appendChild(node);

      localStorage.setItem(
        'oral:html:cache',
        JSON.stringify({
          version,
          meta: data,
          timestamp: Date.now(),
        })
      );
    });
  };
  const loadTargetVersion = (version) => {
    getJSON(
      `%PUBLIC_URL%/${
        version.comment ? version.comment : 'latest'
      }/meta.json?t=${Date.now()}`,
      (err, data) => {
        if (err !== null) {
          loadTargetVersion({
            version: 'latest',
          });
          console.error('failed to load version %o,error %o', version, err);
        } else {
          applyVersion(version, data);
        }
      }
    );
  };

  const loadAbTestFromRemote = () => {
    getJSON(`%PUBLIC_URL%/version.json?t=${Date.now()}`, (err, data) => {
      if (err !== null) {
        console.error('Something went wrong: ' + err);
      } else {
        const version = choiceVersion(data);
        loadTargetVersion(version);
      }
    });
  };

  if ('%DEPLOY_TYPE%' === 's3') loadAbTestFromRemote();
</script>
```

好了,一篇流水账完成..
