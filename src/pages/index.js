import React from 'react';
import Link from 'gatsby-link';
import get from 'lodash/get';
import Helmet from 'react-helmet';

import Bio from '../components/Bio';
import { rhythm } from '../utils/typography';

import ReactGridLayout from 'react-grid-layout/build/ReactGridLayout';
// import './index.css';

const SubTitleItem = ({ children }) => {
  return <span style={{ margin: '0 2px' }}>{children}</span>;
};
class BlogIndex extends React.Component {
  constructor() {
    super();
  }
  componentDidMount() {
    const posts = get(this, 'props.data.allMarkdownRemark.edges');
    if (posts && posts.length) {
      const paths = posts.map(({ node }) => {
        return get(node, 'frontmatter.path');
      });
      this.props.actions.getPostView({ paths: paths, needIncrease: false });
    }
  }
  renderCount(slug) {
    return;
    return get(this, `props.postView[${slug}].time`);
  }
  render() {
    const posts = get(this, 'props.data.allMarkdownRemark.edges');
    const siteTitle = get(this, 'props.data.site.siteMetadata.title');
    return (
      <div>
        <Helmet title={siteTitle} />
        <Bio />
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
              <span style={{ fontSize: 'small', color: '#444' }}>
                <SubTitleItem>{node.frontmatter.date}</SubTitleItem>
                <SubTitleItem>.</SubTitleItem>
                <SubTitleItem>{`${node.timeToRead} min read`}</SubTitleItem>
                <SubTitleItem>{this.renderCount(slug)}</SubTitleItem>
              </span>
            </div>
          );
        })}
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
)(BlogIndex);

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      filter: { frontmatter: { visible: { ne: false } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          timeToRead
          frontmatter {
            date(formatString: "MMM DD, YYYY")
            title
            path
          }
        }
      }
    }
  }
`;
