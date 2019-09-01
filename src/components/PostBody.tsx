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
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import ArrowForwardIosOutlinedIcon from '@material-ui/icons/ArrowForwardIosOutlined';

const style = (theme: Theme) => {
  return {
    root:{
      marginTop:theme.spacing(1)
    },
    leftIcon: {
      marginRight: theme.spacing(1)
    },
    rightIcon: {
      marginLeft: theme.spacing(1)
    },
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
    <Container className = {classes.root}>
      <Box>
        <Typography variant="h2">{post.frontmatter.title}</Typography>
        <Box display="flex" justifyContent="space-between">
          <Box component="span">{post.frontmatter.date}</Box>
        </Box>

        <Box
          className={classes.content}
          dangerouslySetInnerHTML={{
            __html: post.html
          }}
        />
        <Divider />

        <Box
          display="flex"
          flexWrap="nowrap"
          justifyContent="space-between"
          padding={0}
        >
          {previous ? (
            <Link
              to={previous.frontmatter.path}
              style={{ textDecoration: 'inherit' }}
            >
              <Button >
                <ArrowBackIosOutlinedIcon className={classes.leftIcon} />
                {truncate(previous.frontmatter.title)}
              </Button>
            </Link>
          ) : (
            <Button disabled>没有更多文章</Button>
          )}
          {next ? (
            <Link
              to={next.frontmatter.path}
              style={{ textDecoration: 'inherit' }}
            >
              <Button >
                {truncate(next.frontmatter.title)}
                <ArrowForwardIosOutlinedIcon className={classes.rightIcon} />
              </Button>
            </Link>
          ) : (
            <Button disabled>没有更多文章</Button>
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

export default withTheme(withStyles(style)(PostBody));
