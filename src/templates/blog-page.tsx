import { Divider, Pagination } from '@material-ui/core';
import { PaginationItem } from '@material-ui/core';
import { Box, Button, Container, withStyles } from '@material-ui/core';
import { graphql } from 'gatsby';
import Link from 'gatsby-link';
import get from 'lodash/get';
import React from 'react';
import { Helmet } from 'react-helmet';
import '../assets/dracula-prism.css';
import Footer from '../components/Footer';
import Header from '../components/Header';
import PostPreview from '../components/PostPreview';

const styles = (theme) => ({
  pageNavi: {
    display: 'flex',
    justifyContent: 'space-between',
    '& a': {
      textDecoration: 'inherit',
    },
    '& a:hover': {
      textDecoration: 'inherit',
    },
  },
});

class BlogIndex extends React.Component {
  render() {
    const posts = get(this, 'props.data.allMarkdownRemark.edges');
    const siteTitle = get(this, 'props.data.site.siteMetadata.title');
    const currentPage = get(this, 'props.pageContext.currentPage');
    const numberPages = get(this, 'props.pageContext.numberPages');
    return (
      <Box>
        <Header />
        <Helmet title={siteTitle} />
        <Container maxWidth={'md'}>
          {posts.map(({ node }) => (
            <PostPreview node={node} key={node.frontmatter.path} />
          ))}
          <Pagination
            sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            count={numberPages}
            page={currentPage}
            renderItem={(item) => (
              <PaginationItem
                component={Link}
                to={`${item.page === 1 ? '/' : `/pages/${item.page}`}`}
                {...item}
              />
            )}
          />
        </Container>
        <Divider />
        <Footer />
      </Box>
    );
  }
}
export default withStyles(styles)(BlogIndex);

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
