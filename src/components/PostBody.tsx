import {
  Typography,
  Paper,
  withStyles,
  withTheme,
  Box,
  Divider,
  Button,
  Container
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
  return {
    content: {
      '& h1': theme.typography.h3,
      '& h2': theme.typography.h4,
      '& h3': theme.typography.h5,
      '& h4': theme.typography.h6,
      '& h5': theme.typography.h6,
      '& h6': theme.typography.h6,
      '& a': {
        color: theme.palette.secondary.main,
        textDecoration: 'inherit'
      },
      '& a:hover': {
        textDecoration: 'underline'
      }
    },
    root: {
      justifyContent:'center',
      display: 'flex',
      fontFamily: theme.typography.fontFamily
    },
    page: {
      flex: '0 0 50%',
      margin: '0 auto',
      padding:'2px',
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
    <Container className={classes.root}>
      <Box className={classes.page}>
        <Typography variant="h2">{post.frontmatter.title}</Typography>
        <Box display="flex" justifyContent="space-between" >
          <Box component='span' >{post.frontmatter.date}</Box>
        </Box>

        <Box className={classes.content}
          dangerouslySetInnerHTML={{
            __html: post.html
          }}
        />
        <Divider />

        <Box display="flex" flexWrap="wrap" justifyContent="space-between"
          padding={0}
        
        >
          {previous ? (
             <Button href={previous.frontmatter.path}>{truncate(previous.frontmatter.title)}</Button>
          ): (
              <li />
            )}
          {next ? (
            <Button href={next.frontmatter.path}>{truncate(next.frontmatter.title)}</Button>
          ) : (
              <li />
            )}
        </Box>

        <Disqus.DiscussionEmbed
          shortname={disqusShortname}
          config={disqusConfig}
        />
      </Box>
      
    </Container>
  );
};

export default withTheme((withStyles(style)(PostBody)))
