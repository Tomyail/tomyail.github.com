const _ = require('lodash');
const Promise = require('bluebird');
const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');
const R = require('ramda');

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.js');
    resolve(
      graphql(
        `
          {
            allMarkdownRemark(limit: 1000,sort: { fields: [frontmatter___date], order: DESC }) {
              edges {
                node {
                  frontmatter {
                    title
                    path
                    visible
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          reject(result.errors);
        }

        // Create blog posts pages.
        const posts = result.data.allMarkdownRemark.edges;

        //我们把 fromtmatter 的 visible 是 false 的文章从文章列表中删掉,但是如果用户直接访问那个 url 还是能访问到的
        const isVisible = post => {
          return post.node.frontmatter.visible !== false;
        };
        const renderVisiblePost = posts => {
          posts.forEach((post, index) => {
            const next =
              index === posts.length - 1 ? false : posts[index + 1].node;
            const previous = index === 0 ? false : posts[index - 1].node;

            createPage({
              path: post.node.frontmatter.path,
              component: blogPost,
              context: {
                index,
                previous,
                next
              }
            });
          });
        };

        const renderInvisiblePosts = posts => {
          posts.forEach((post, index) => {
            createPage({
              path: post.node.frontmatter.path,
              component: blogPost
            });
          });
        };

        const visiblePosts = R.filter(isVisible)(posts);
        renderVisiblePost(visiblePosts);
        const invisiblePosts = R.filter(
          R.compose(
            R.not,
            isVisible
          )
        )(posts);
        renderInvisiblePosts(invisiblePosts);
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
      value
    });
  }
};
