import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import get from 'lodash/get';

import Bio from '../components/Bio';
import { rhythm, scale } from '../utils/typography';
import Disqus from 'disqus-react';
import _ from 'lodash';

class BlogPostTemplate extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    const path = get(this, 'props.data.markdownRemark.frontmatter.path');
    this.props.actions.getPostView({ paths: [path], needIncrease: true });
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
        <div
          style={{
            ...scale(-1 / 5),
            display: 'block',
            marginBottom: rhythm(1),
            marginTop: rhythm(-0.5),
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <span>{post.frontmatter.date}</span>
          <span>
            {_.get(
              this,
              `props.postView[${
                this.props.data.markdownRemark.frontmatter.path
              }].time`
            )}
          </span>
        </div>
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
          {previous ? (
            <li>
              <Link to={previous.frontmatter.path} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            </li>
          ) : (
            <li />
          )}

          {next ? (
            <li>
              <Link to={next.frontmatter.path} rel="next">
                {next.frontmatter.title} →
              </Link>
            </li>
          ) : (
            <li />
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

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../redux/actions';

export default connect(
  state => ({
    postView: state.postView
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch)
  })
)(BlogPostTemplate);

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
        date(formatString: "YYYY-MM-DD")
        path
      }
    }
  }
`;
