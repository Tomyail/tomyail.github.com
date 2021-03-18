import {
  AppBar,
  Avatar,
  Box,
  Container,
  Divider,
  Drawer,
  Hidden,
  makeStyles,
  Pagination,
  PaginationItem,
  Toolbar,
} from '@material-ui/core';
import clsx from 'clsx';
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
const useStyles = makeStyles((theme) => ({
  avatar: {
    // width:'100%',
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    // transition: theme.transitions.create('margin', {
    //   easing: theme.transitions.easing.sharp,
    //   duration: theme.transitions.duration.leavingScreen,
    // }),
    // marginLeft: drawerWidth,
  },
  // contentShift: {
  //   transition: theme.transitions.create('margin', {
  //     easing: theme.transitions.easing.easeOut,
  //     duration: theme.transitions.duration.enteringScreen,
  //   }),
  //   marginLeft: 0,
  // },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
}));

const BlogIndex = (props) => {
  const classes = useStyles();
  const posts = get(props, 'data.allMarkdownRemark.edges');
  const siteTitle = get(props, 'data.site.siteMetadata.title');
  const currentPage = get(props, 'pageContext.currentPage');
  const numberPages = get(props, 'pageContext.numberPages');

  const [open, setOpen] = useState(true);

  return (
    <Box sx={{ display: 'flex' }}>
      <Helmet title={siteTitle} />
      <Header hideBar={false} appBarStyle={clsx(classes.appBar)} />
      <Hidden mdDown>
        <Drawer
          open={open}
          className={classes.drawer}
          classes={{ paper: classes.drawerPaper }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar />
          <div className={classes.drawerHeader}>
            <Avatar className={classes.avatar}>Hello</Avatar>
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

      <Container maxWidth={'md'} className={clsx(classes.content, {})}>
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
