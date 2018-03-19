import React from 'react';
import Link from 'gatsby-link';
import get from 'lodash/get';
import Helmet from 'react-helmet';

import Bio from '../components/Bio';
import { rhythm } from '../utils/typography';
import Lean from '../components/LeancloudCounter';

class BlogIndex extends React.Component {
  constructor() {
    super();
    this.state = { leancloud: [] };
  }
  renderCount(slug) {
    const item = _.find(
      this.state.leancloud,
      lean => lean.url.indexOf(slug) >= 0
    );
    if (item) {
      return <div>{item.time}</div>;
    }
  }
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title');
    const posts = get(this, 'props.data.allMarkdownRemark.edges');

    const urls = posts.map(({ node }) => get(node, 'frontmatter.path'));
    return (
      <div>
        <Helmet title={siteTitle} />
        <Bio />
        <Lean
          urls={urls}
          onLeancloud={data => {
            this.setState({ leancloud: data });
          }}
        />
        {posts.map(({ node }) => {
          const title = get(node, 'frontmatter.title') || node.fields.slug;
          const slug = get(node, 'frontmatter.path');
          return (
            <div key={slug}>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4)
                }}
              >
                <Link style={{ boxShadow: 'none' }} to={slug}>
                  {title}
                </Link>
              </h3>

              {this.renderCount(slug)}
              <small>{node.frontmatter.date}</small>
            </div>
          );
        })}
      </div>
    );
  }
}

export default BlogIndex;

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          frontmatter {
            date(formatString: "DD MMMM, YYYY")
            title
            path
          }
        }
      }
    }
  }
`;
