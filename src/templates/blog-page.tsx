import {
  Avatar,
  Box,
  Container,
  Drawer,
  experimentalStyled,
  Hidden,
  Pagination,
  PaginationItem,
  SwipeableDrawer,
  Toolbar,
  useTheme,
  Link as MLink,
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
import Divider from '../components/Divider';

const MAvatar = experimentalStyled(Avatar)(({ theme }) => {
  return {
    width: theme.spacing(10),
    height: theme.spacing(10),
  };
});

const Profile = () => {
  return (
    <Box display="flex" alignItems="center" flexDirection="column" p={1}>
      <MAvatar>Super</MAvatar>
      <Box>来个签名？？</Box>
      <Box>
        <Box>
          <MLink
            href="https://twitter.com/tomyail"
            target="_blank"
            rel="noopener"
          >
            Twitter
          </MLink>
        </Box>
        <Box>
          <MLink
            href="https://github.com/Tomyail"
            target="_blank"
            rel="noopener"
          >
            Github
          </MLink>
        </Box>
        <Box>
          <MLink href="/atom.xml" target="_blank">
            Rss
          </MLink>
        </Box>
        <Box> 关于我</Box>
      </Box>
    </Box>
  );
};

const Main = (props) => {
  const posts = get(props, 'data.allMarkdownRemark.edges');
  const currentPage = get(props, 'pageContext.currentPage');
  const numberPages = get(props, 'pageContext.numberPages');
  return (
    <Container maxWidth={'lg'} sx={{ flexGrow: 1 }}>
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
  );
};
const BlogIndex = (props) => {
  const siteTitle = get(props, 'data.site.siteMetadata.title');

  const theme = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Helmet title={siteTitle} />
      <Header
        showDrawerSwitch
        onSwitchClick={() => {
          setOpen((o) => !o);
        }}
      />
      <Hidden mdDown>
        <Box display="flex">
          <Main {...props} />
          <Drawer
            variant="permanent"
            anchor="right"
            sx={{ width: 16 * 8, '& .MuiPaper-root': { width: 16 * 8 } }}
          >
            <Toolbar />
            <Profile />
          </Drawer>
        </Box>
      </Hidden>
      <Hidden mdUp>
        <Main {...props} />
        <SwipeableDrawer
          onClose={(event) => {
            setOpen(false);
          }}
          onOpen={() => {
            setOpen(true);
          }}
          open={open}
          variant="temporary"
          anchor="right"
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: theme.spacing(0, 1),
            }}
          >
            <Profile />
          </Box>
        </SwipeableDrawer>
      </Hidden>
    </>
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
      sort: { fields: [frontmatter___created_at], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          timeToRead
          excerpt
          frontmatter {
            tags
            created_at
            title
            path
          }
        }
      }
    }
  }
`;
