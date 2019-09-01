import React from 'react';
import Helmet from 'react-helmet';
import get from 'lodash/get';
import { graphql } from 'gatsby';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../redux/actions';

// import Bio from '../components/Bio';
import { withStyles, Container, CssBaseline, Box } from '../../node_modules/@material-ui/core';

import Footer from '../components/Footer';
import Header from '../components/Header'
import PostBody from '../components/PostBody';

const styles = {};

class BlogPostTemplate extends React.Component {
  componentDidMount() {
    const path = get(this, 'props.data.markdownRemark.frontmatter.path');
    if (path) {
      this.props.actions.getPostView({ paths: [path], needIncrease: true });
    }
  }
  render() {
    const post = this.props.data.markdownRemark;
    const siteTitle = get(this.props, 'data.site.siteMetadata.title');
    const siteUrl = get(this.props, 'data.site.siteMetadata.siteUrl');
    const { previous, next } = this.props.pageContext;
    return (
      <Box>
        <CssBaseline />
        <Header />
        <Helmet title={`${post.frontmatter.title} | ${siteTitle}`} />
        <PostBody
          post={post}
          previous={previous}
          next={next}
          siteUrl={siteUrl}
        />
        <Footer />
      </Box>
    );
  }
}

export default connect(
  state => ({
    postView: state.postView
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch)
  })
)(withStyles(styles)(BlogPostTemplate));

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
      tableOfContents
      frontmatter {
        title
        date(formatString: "YYYY-MM-DD")
        path
      }
    }
  }
`;
