import React from 'react';

import { rhythm } from '../utils/typography';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';

export default ({ data }) => {
  return (
    <div>
      <h4>{data.allMarkdownRemark.totalCount} Posts</h4>
      <ul>
        {data.allMarkdownRemark.edges.map(({ node }) => (
          <li key={node.id}>
            <Link to={node.fields.slug}>{node.frontmatter.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const query = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          id
          fields {
            slug
          }
          excerpt
          frontmatter {
            title
          }
        }
      }
    }
  }
`;
