import {
  Avatar,
  Box,
  Container,
  Divider,
  Drawer,
  experimentalStyled,
  Hidden,
  Pagination,
  PaginationItem,
  Toolbar,
  useTheme,
} from '@material-ui/core';
import { graphql } from 'gatsby';
import Link from 'gatsby-link';
import get from 'lodash/get';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import '../assets/dracula-prism.css';
import Footer from '../components/Footer';
import Header from '../components/Header';
import PostPreview from '../components/PostPreview';

const drawerWidth = 240;

const MAvatar = experimentalStyled(Avatar)(({ theme }) => {
  return {
    width: theme.spacing(10),
    height: theme.spacing(10),
  };
});
const BlogIndex = (props) => {
  const posts = get(props, 'data.allMarkdownRemark.edges');
  const siteTitle = get(props, 'data.site.siteMetadata.title');
  const currentPage = get(props, 'pageContext.currentPage');
  const numberPages = get(props, 'pageContext.numberPages');

  const theme = useTheme();
  const [open, setOpen] = useState(true);
  return (
    <Box sx={{ display: 'flex' }}>
      <Helmet title={siteTitle} />
      <Header
        hideBar={false}
        appBarStyle={{ zIndex: theme.zIndex.drawer + 1 }}
      />
      <Hidden mdDown>
        <Drawer
          // classes={{ paper: classes.drawerPaper }}
          variant="permanent"
          anchor="left"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
            },
          }}
        >
          <Toolbar />
          <div
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: theme.spacing(0, 1),
            }}
          >
            <MAvatar>Hello</MAvatar>
            <div>Hello</div>
            <div>Hello</div>
            <div>Hello</div>
            <div>Hello</div>
            <div>Hello</div>
            <div>Hello</div>
            <div>Hello</div>
          </div>
        </Drawer>
      </Hidden>
      <Hidden mdUp>
        <Drawer
          onClose={(event) => {
            if (
              event.type === 'keydown' &&
              (event.key === 'Tab' || event.key === 'Shift')
            ) {
              return;
            }
            setOpen(false);
          }}
          open={open}
          variant="temporary"
          anchor="left"
        >
          <Toolbar />
          <div
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: theme.spacing(0, 1),
            }}
          >
            <div>Hello</div>
            <div>Hello</div>
            <div>Hello</div>
            <div>Hello</div>
            <div>Hello</div>
            <div>Hello</div>
            <div>Hello</div>
          </div>
        </Drawer>
      </Hidden>

      <Container
        maxWidth={'md'}
        sx={{ flexGrow: 1, padding: theme.spacing(3) }}
      >
        <Toolbar />
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
        <Divider />
        <Footer />
      </Container>
    </Box>
  );
};

export default BlogIndex;
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
