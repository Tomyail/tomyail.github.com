import React from 'react';
import Link from 'gatsby-link';
import get from 'lodash/get';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import * as actions from '../redux/actions';
import Bio from '../components/Bio';
import { rhythm } from '../utils/typography';
import About from './about';
import PostPreview from '../components/PostPreview';
import { List, Grid, withStyles } from '@material-ui/core';

// import ReactGridLayout from 'react-grid-layout/build/ReactGridL  ayout';
// import './index.css';

const styles = theme => ({
  root: {
    flexGrow: 0.5,
    display: 'flex',
    justifyContent: 'center'
  },
  paper: {
    height: 140,
    width: 100
  },
  control: {
    padding: theme.spacing.unit * 2
  }
});

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

  render() {
    const { classes } = this.props;
    const posts = get(this, 'props.data.allMarkdownRemark.edges');
    const siteTitle = get(this, 'props.data.site.siteMetadata.title');
    return (
      <div>
        <Helmet title={siteTitle} />
        <Bio />
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          spacing={16}
          xs = {11}
        >
          {posts.map(({ node }) => (
            <PostPreview node={node} />
          ))}
        </Grid>
      </div>
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
