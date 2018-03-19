import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import get from 'lodash/get';

import Bio from '../components/Bio';
import { rhythm, scale } from '../utils/typography';
import Disqus from 'disqus-react';
import LeancloudCounter from '../components/LeancloudCounter';

class BlogPostTemplate extends React.Component {
  constructor() {
    super();
    this.state = {
      leancloud: null
    };
  }
  render() {
    const post = this.props.data.markdownRemark;
    const siteTitle = get(this.props, 'data.site.siteMetadata.title');
    const siteUrl = get(this.props, 'data.site.siteMetadata.siteUrl');
    const { previous, next } = this.props.pathContext;

    const disqusShortname = 'tomyail';
    const disqusConfig = {
      url: `${siteUrl}${post.frontmatter.path.replace('/', '')}`,
      title: post.frontmatter.title
    };
    return (
      <div>
        <Helmet title={`${post.frontmatter.title} | ${siteTitle}`} />
        <h1>{post.frontmatter.title}</h1>
        <div>{this.state.leancloud && this.state.leancloud.time}</div>
        <LeancloudCounter
          needIncrease={true}
          urls={[post.frontmatter.path]}
          onLeancloud={data => {
            this.setState({ leancloud: data[0] });
          }}
        />
        <p
          style={{
            ...scale(-1 / 5),
            display: 'block',
            marginBottom: rhythm(1),
            marginTop: rhythm(-1)
          }}
        >
          {post.frontmatter.date}
        </p>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr
          style={{
            marginBottom: rhythm(1)
          }}
        />
        <Bio />

        <ul
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            listStyle: 'none',
            padding: 0
          }}
        >
          {previous && (
            <li>
              <Link to={previous.frontmatter.path} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            </li>
          )}

          {next && (
            <li>
              <Link to={next.frontmatter.path} rel="next">
                {next.frontmatter.title} →
              </Link>
            </li>
          )}
        </ul>
        <Disqus.DiscussionEmbed
          shortname={disqusShortname}
          config={disqusConfig}
        />
      </div>
    );
  }
}

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($path: String!) {
    site {
      siteMetadata {
        title
        author
        siteUrl
      }
    }
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      id
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        path
      }
    }
  }
`;
