import React from 'react'
import { Box, Button, CssBaseline, withStyles } from '@material-ui/core';
import { graphql } from 'gatsby';
import Link from 'gatsby-link';
import get from 'lodash/get';
import { Helmet } from 'react-helmet';
import '../assets/prism.css';
import Header from '../components/Header';
import PostPreview from '../components/PostPreview';

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

class BlogIndex extends React.Component {

  render() {
    const posts = get(this, 'props.data.allMarkdownRemark.edges');
    const siteTitle = get(this, 'props.data.site.siteMetadata.title');
    const preLink = get(this, 'props.pageContext.preLink');
    const nextLink = get(this, 'props.pageContext.nextLink');
    // return <div>test</div>
    return (
      <Box >
        <CssBaseline />
        <Header />
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
export default withStyles(styles)(BlogIndex)


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
