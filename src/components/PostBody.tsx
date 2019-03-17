import {
  Typography,
  Paper,
  withStyles,
  withTheme
} from '../../node_modules/@material-ui/core';
import * as React from 'react';
import Link from 'gatsby-link';
import Disqus from 'disqus-react';
import get from 'lodash/get';
import truncate from 'lodash/truncate';
import TableOfContents from './TableOfContent';
import Hidden from '@material-ui/core/Hidden';
import { Theme } from '@material-ui/core/styles';
import 'typeface-roboto';

const style = (theme: Theme) => {
  debugger;
  return {
    content: {
      '& h1': theme.typography.display3,
      '& h2': theme.typography.display2,
      '& h3': theme.typography.display1,
      '& a': {
        color: theme.palette.secondary.main,
        textDecoration: 'inherit'
      },
      '& a:hover': {
        textDecoration: 'underline'
      }
    },
    root: {
      display: 'flex',
      fontFamily: theme.typography.fontFamily
    },
    page: {
      flex: '0 0 50%',
      margin: '0 auto'
    }
  };
};
const PostBody = ({ post, previous, next, siteUrl, classes }) => {
  const disqusShortname = 'tomyail';
  const disqusConfig = {
    url: `${siteUrl}${post.frontmatter.path.replace('/', '')}`,
    title: post.frontmatter.title
  };
  return (
    <div className={classes.root}>
      <div className={classes.page}>
        <Typography variant="display4">{post.frontmatter.title}</Typography>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <span>{post.frontmatter.date}</span>
          {/* <span>
            {get(
              this,
              `props.postView[${
                this.props.data.markdownRemark.frontmatter.path
              }].time`
            )}
          </span> */}
        </div>

        <div className = {classes.content}
          dangerouslySetInnerHTML={{
            __html: post.html
          }}
        />
        <hr />
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            listStyle: 'none',
            padding: 0
          }}
        >
          {previous ? (
            <li>
              <Link to={previous.frontmatter.path} rel="prev">
                ← {truncate(previous.frontmatter.title)}
              </Link>
            </li>
          ) : (
            <li />
          )}
          {next ? (
            <li>
              <Link to={next.frontmatter.path} rel="next">
                {truncate(next.frontmatter.title)} →
              </Link>
            </li>
          ) : (
            <li />
          )}
        </div>
        <Disqus.DiscussionEmbed
          shortname={disqusShortname}
          config={disqusConfig}
        />
      </div>
      <Hidden smDown>
        <TableOfContents content={post.tableOfContents} />
      </Hidden>
    </div>
  );
};

export default withTheme()(withStyles(style)(PostBody));
