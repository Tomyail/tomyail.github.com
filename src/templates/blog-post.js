import React from 'react';
import _ from 'lodash';
import Helmet from 'react-helmet';

export default ({ data }) => {
  const { site: { siteMetadata: { meta, title } } } = data;
  const post = data.markdownRemark;
  return (
    <div>
      <Helmet
        title={`${post.frontmatter.title} - ${title}`}
        meta={_.map(meta, (v, k) => ({ name: k, content: v }))}
      />
      <h1>{post.frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </div>
  );
};

export const query = graphql`
  query BlogPostQuery($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`;
