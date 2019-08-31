import React from 'react';
import Link from 'gatsby-link';
import get from 'lodash/get';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import * as actions from '../redux/actions';
import Bio from '../components/Bio';
import PostPreview from '../components/PostPreview';
import { List, Grid, withStyles, Box, Button } from '@material-ui/core';
import '../assets/prism.css';

const styles = theme => ({
  pageNavi: {
    display: 'flex',
    justifyContent: 'space-between',
    '& a': {
      textDecoration: 'inherit'
    },
    '& a:hover': {
      textDecoration: 'inherit'
    }
  }
});

const SubTitleItem = ({ children }) => {
  return <span style={{ margin: '0 2px' }}>{children}</span>;
};
class BlogIndex extends React.Component {
  componentDidMount() {
    const posts = get(this, 'props.data.allMarkdownRemark.edges');
    if (posts && posts.length) {
      const paths = posts.map(({ node }) => {
        return get(node, 'frontmatter.path');
      });
      this.props.actions.getPostView({ paths: paths, needIncrease: false });
    }
  }

  render() {
    const posts = get(this, 'props.data.allMarkdownRemark.edges');
    const siteTitle = get(this, 'props.data.site.siteMetadata.title');
    const preLink = get(this, 'props.pageContext.preLink');
    const nextLink = get(this, 'props.pageContext.nextLink');
    return (
      <Box >
        <Helmet title={siteTitle} />
        {posts.map(({ node }) => (
          <PostPreview node={node} key={node.frontmatter.path} />
        ))}
        <Box className={this.props.classes.pageNavi}>
          {preLink ? (
            <Link to={preLink}>
              <Button>上一页</Button>
            </Link>
          ) : <Button disabled>没有更多文章</Button>}
          {nextLink ? (
            <Link to={nextLink}>
              <Button>下一页</Button>
            </Link>
          ) : <Button disabled>没有更多文章</Button>}
        </Box>
      </Box>
    );
  }
}

export default compose(
  withStyles(styles),
  connect(
    state => ({
      postView: state.postView
    }),
    dispatch => ({
      actions: bindActionCreators(actions, dispatch)
    })
  )
)(BlogIndex);

export const pageQuery = graphql`
  query IndexQuery($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      filter: { frontmatter: { visible: { ne: false } } }
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          timeToRead
          excerpt
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