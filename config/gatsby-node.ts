import _ from 'lodash';
import Promise from 'bluebird';
import path from 'path';
import R from 'ramda';
import fse from 'fs-extra';
// 获取所有的文章概要信息
const getAllPara = (graphql) =>
  graphql(
    `
      {
        allMarkdownRemark(
          limit: 1000
          sort: { fields: [frontmatter___date], order: DESC }
        ) {
          totalCount
          edges {
            node {
              frontmatter {
                title
                path
                tags
                categories
              }
            }
          }
        }
      }
    `
  );

//根据 tag 分组的信息
const groupByTags = () => {};

// 根据 Area 分组的信息 （暂时还没有）
const groupByAreas = () => {};
const renderVisiblePost = (posts, createPage) => {
  const postsPerPage = 9;

  // const tags = {};
  // const categories = {};
  //
  // const x = (input, target, title) => {
  // if (input) {
  // input.forEach((tag) => {
  // if (!target[tag]) {
  // target[tag] = [];
  // }
  // target[tag].push(title);
  // });
  // }
  // };
  // posts.forEach((post) => {
  // const t = post.node.frontmatter.tags;
  // const c = post.node.frontmatter.categories;
  // const title = post.node.frontmatter.title;
  // x(t, tags, title);
  // x(c, categories, title);
  // });
  //
  // console.log(categories);
  // fse.writeJsonSync(path.join(__dirname,'tags.json'),tags)
  // fse.writeJsonSync(path.join(__dirname,'cat.json'),categories)
  //
  const numberPages = Math.ceil(posts.length / postsPerPage);

  const blogPost = path.resolve('./src/templates/blog-post.tsx');

  Array.from({ length: numberPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/` : `/pages/${i + 1}`,
      component: path.resolve('./src/templates/blog-page.tsx'),
      context: {
        preLink: i > 0 ? (i === 1 ? '/' : `/pages/${i}`) : null,
        nextLink: i < numberPages - 1 ? `/pages/${i + 1 + 1}` : null,
        limit: postsPerPage,
        skip: i * postsPerPage,
        numberPages,
        currentPage: i + 1,
      },
    });
  });

  posts.forEach((post, index) => {
    const next = index === posts.length - 1 ? false : posts[index + 1].node;
    const previous = index === 0 ? false : posts[index - 1].node;

    createPage({
      path: post.node.frontmatter.path,
      component: blogPost,
      context: {
        index,
        previous,
        next,
      },
    });
  });
};

//我们把 fromtmatter 的 visible 是 false 的文章从文章列表中删掉,但是如果用户直接访问那个 url 还是能访问到的
const isVisible = (post) => {
  return post.node.frontmatter.visible !== false;
};

//const renderInvisiblePosts = (posts, createPage, blogPost) => {
//posts.forEach((post, index) => {
//createPage({
//path: post.node.frontmatter.path,
//component: blogPost,
//});
//});
//};

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    resolve(
      graphql(
        `
          {
            allMarkdownRemark(
              limit: 1000
              sort: { fields: [frontmatter___date], order: DESC }
            ) {
              totalCount
              edges {
                node {
                  frontmatter {
                    title
                    path
                    tags
                    categories
                  }
                }
              }
            }
          }
        `
      ).then((result) => {
        if (result.errors) {
          reject(result.errors);
        }

        // Create blog posts pages.
        const posts = result.data.allMarkdownRemark.edges;

        const visiblePosts = R.filter(isVisible)(posts);
        renderVisiblePost(visiblePosts, createPage);
        //const invisiblePosts = R.filter(R.compose(R.not, isVisible))(posts);
        //renderInvisiblePosts(invisiblePosts, createPage, blogPost);
      })
    );
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = node.frontmatter.path + '/'; //createFilePath({ node, getNode });
    //gatsby-remark-toc 插件需要使用 slug 作为路径,所以开启 onCreateNode 函数
    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};
