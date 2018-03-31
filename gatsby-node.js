const Promise = require('bluebird');
const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');
const R = require('ramda');

// https://github.com/gatsbyjs/gatsby/issues/2615
//https://github.com/lewie9021/webpack-configurator
exports.modifyWebpackConfig = ({ config, stage }) => {
  const Webpack = require('webpack');
  config.plugin('webpack-define', Webpack.DefinePlugin, [
    {
      'global.GENTLY': false
    }
  ]);
  return config;
};

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.js');
    resolve(
      graphql(
        `
          {
            allMarkdownRemark(
              sort: { fields: [frontmatter___date], order: DESC }
              limit: 1000
            ) {
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
          console.log(result.errors);
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
        const invisiblePosts = R.filter(R.compose(R.not, isVisible))(posts);
        renderInvisiblePosts(invisiblePosts);
      })
    );
  });
};
