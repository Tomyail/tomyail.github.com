import { AppBar, Divider, Drawer, makeStyles, Pagination, Toolbar } from '@material-ui/core';
import { PaginationItem } from '@material-ui/core';
import { Box, Button, Container, withStyles } from '@material-ui/core';
import clsx from 'clsx';
import { graphql } from 'gatsby';
import Link from 'gatsby-link';
import get from 'lodash/get';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import '../assets/dracula-prism.css';
import AppDrawer from '../components/AppDrawer';
import Footer from '../components/Footer';
import Header from '../components/Header';
import PostPreview from '../components/PostPreview';

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex:theme.zIndex.drawer + 1,
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
    // necessary for content to be below app bar
    // ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
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
    <Box>
      <Header
        appBarStyle={clsx(classes.appBar )}
      />
      <Helmet title={siteTitle} />
      <Drawer
        open={open}
        className={classes.drawer}
        classes={{ paper: classes.drawerPaper }}
        variant = "persistent"
      >
				<Toolbar/>
        <div className={classes.drawerHeader}>
          <div>Hello</div>
          <div>Hello</div>
          <div>Hello</div>
          <div>Hello</div>
          <div>Hello</div>
          <div>Hello</div>
          <div>Hello</div>
        </div>
      </Drawer>
      <Container
        maxWidth={'md'}
        sx={{ position: 'relative' }}
        className={clsx(classes.content, {
        })}
      >
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
