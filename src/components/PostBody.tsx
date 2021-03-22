import { Theme, useTheme } from '@material-ui/core/styles';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import ArrowForwardIosOutlinedIcon from '@material-ui/icons/ArrowForwardIosOutlined';
import Disqus from 'disqus-react';
import Link from 'gatsby-link';
import truncate from 'lodash/truncate';
import * as React from 'react';
import 'typeface-roboto';
import {
  Box,
  Button,
  Container,
  Fab,
  Typography,
  withStyles,
  withTheme,
} from '../../node_modules/@material-ui/core';
import { ScrollTop } from './ScrollTop';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Divider from './Divider';

//https://github.com/mui-org/material-ui/blob/62883f7369a2a7dcb8b77a77b2c65a62c1615926/docs/src/modules/components/MarkdownElement.js#L6
const style = (theme: Theme) => {
  return {
    root: {
      marginTop: theme.spacing(1),
      display: 'relative',
    },
    leftIcon: {
      marginRight: theme.spacing(1),
    },
    rightIcon: {
      marginLeft: theme.spacing(1),
    },
    content: {
      ...theme.typography.body1,
      color: theme.palette.text.primary,
      wordBreak: 'break-word',

      '& .anchor-link': {
        marginTop: -96, // Offset for the anchor.
        position: 'absolute',
      },
      // '& .gatsby-highlight pre[class*="language-"]:after': {
      //   content: '"js"',
      //   background: "#f7df1e",
      //   color: "black",
      //   borderRadius: "0 0 0.25rem 0.25rem",
      //   fontSize: "12px",
      //   letterSpacing: "0.025rem",
      //   padding: "0.1rem 0.5rem",
      //   position: "absolute",
      //   right: "1rem",
      //   textAlign: "right",
      //   texttransform: "uppercase",
      //   top: 0,
      // },
      '& pre': {
        position: 'relative',
        margin: theme.spacing(3, 'auto'),
        padding: theme.spacing(2),
        backgroundColor: '#272c34',
        direction: 'ltr',
        borderRadius: theme.shape.borderRadius,
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch', // iOS momentum scrolling.
        maxWidth: 'calc(100vw - 32px)',
        [theme.breakpoints.up('md')]: {
          maxWidth: 'calc(100vw - 32px - 16px)',
        },
      },

      // '& code[class*="language-"]': {
      //   // Avoid layout jump after hydration (style injected by prism)
      //   lineHeight: 1.5,
      // },
      // // only  inline code
      '& :not(pre) > code[class*="language-"]': {
        direction: 'ltr',
        lineHeight: 1.4,
        display: 'inline-block',
        fontFamily: 'Consolas, "Liberation Mono", Menlo, Courier, monospace',
        WebkitFontSmoothing: 'subpixel-antialiased',
        padding: '0 3px',
        color: theme.palette.text.primary,
        background:
          theme.palette.mode === 'light'
            ? 'rgba(255, 229, 100, 0.2)'
            : 'rgba(255, 229, 100, 0.2)',
        fontSize: '.85em',
        borderRadius: 2,
      },
      // // code blocks
      // "& pre code": {
      //   background: "#272c34",
      //   fontSize: ".9em",
      // },
      '& .token.operator': {
        background: 'transparent',
      },
      '& h1': {
        ...theme.typography.h3,
        fontSize: 40,
        margin: '16px 0',
      },
      '& .description': {
        ...theme.typography.h5,
        margin: '0 0 40px',
      },
      '& h2': {
        ...theme.typography.h4,
        fontSize: 30,
        margin: '40px 0 16px',
      },
      '& h3': {
        ...theme.typography.h5,
        margin: '40px 0 16px',
      },
      '& h4': {
        ...theme.typography.h6,
        margin: '32px 0 16px',
      },
      '& h5': {
        ...theme.typography.subtitle2,
        margin: '32px 0 16px',
      },
      '& p, & ul, & ol': {
        marginTop: 0,
        marginBottom: 16,
      },
      '& ul': {
        paddingLeft: 30,
      },
      '& h1, & h2, & h3, & h4': {
        '& code': {
          fontSize: 'inherit',
          lineHeight: 'inherit',
          // Remove scroll on small screens.
          wordBreak: 'break-all',
        },
        '& .anchor-link-style': {
          // To prevent the link to get the focus.
          display: 'none',
        },
        '& a:not(.anchor-link-style):hover': {
          color: 'currentColor',
          borderBottom: '1px solid currentColor',
          textDecoration: 'none',
        },
        '&:hover .anchor-link-style': {
          display: 'inline-block',
          padding: '0 8px',
          color: theme.palette.text.secondary,
          '&:hover': {
            color: theme.palette.text.primary,
          },
          '& svg': {
            width: '0.7em',
            height: '0.7em',
            fill: 'currentColor',
          },
        },
      },
      '& table': {
        // Trade display table for scroll overflow
        display: 'block',
        wordBreak: 'normal',
        width: '100%',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch', // iOS momentum scrolling.
        borderCollapse: 'collapse',
        marginBottom: '16px',
        borderSpacing: 0,
        overflow: 'hidden',
        '& .prop-name': {
          fontFamily: 'Consolas, "Liberation Mono", Menlo, monospace',
        },
        '& .required': {
          color: theme.palette.mode === 'light' ? '#006500' : '#a5ffa5',
        },
        '& .prop-type': {
          fontFamily: 'Consolas, "Liberation Mono", Menlo, monospace',
          color: theme.palette.mode === 'light' ? '#932981' : '#ffb6ec',
        },
        '& .prop-default': {
          fontFamily: 'Consolas, "Liberation Mono", Menlo, monospace',
          borderBottom: `1px dotted ${theme.palette.divider}`,
        },
      },
      '& td': {
        ...theme.typography.body2,
        borderBottom: `1px solid ${theme.palette.divider}`,
        padding: 16,
        color: theme.palette.text.primary,
      },
      '& td code': {
        lineHeight: 1.6,
      },
      '& th': {
        lineHeight: theme.typography.pxToRem(24),
        fontWeight: theme.typography.fontWeightMedium,
        color: theme.palette.text.primary,
        whiteSpace: 'pre',
        borderBottom: `1px solid ${theme.palette.divider}`,
        padding: 16,
      },
      '& blockquote': {
        borderLeft: '5px solid #ffe564',
        backgroundColor: 'rgba(255,229,100,0.2)',
        padding: '4px 24px',
        margin: '24px 0',
        '& p': {
          marginTop: '16px',
        },
      },
      '& a, & a code': {
        // Style taken from the Link component
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline',
        },
      },
      '& img, video': {
        maxWidth: '100%',
      },
      '& img': {
        // Avoid layout jump
        display: 'inline-block',
      },
      '& hr': {
        height: 1,
        margin: theme.spacing(6, 0),
        border: 'none',
        flexShrink: 0,
        backgroundColor: theme.palette.divider,
      },
      '& kbd.key': {
        // Style taken from GitHub
        padding: '4px 5px',
        display: 'inline-block',
        whiteSpace: 'nowrap',
        margin: '0 1px',
        font: '11px SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace',
        lineHeight: '10px',
        color: theme.palette.text.primary,
        verticalAlign: 'middle',
        backgroundColor: '#fafbfc',
        border: '1px solid #d1d5da',
        borderRadius: 6,
        boxShadow: 'inset 0 -1px 0 #d1d5da',
      },
      '& em': {
        fontFamily: 'Sriracha',
        letterSpacing: '-0.25px',
        color: theme.palette.secondary.main,
        // fontStyle: ,
      },
      // '& h1': theme.typography.h3,
      // '& h2': theme.typography.h4,
      // '& h3': theme.typography.h5,
      // '& h4': theme.typography.h6,
      // '& h5': theme.typography.h6,
      // '& h6': theme.typography.h6,
      // '& a': {
      //   color: theme.palette.secondary.main,
      //   textDecoration: 'inherit'
      // },
      // '& a:hover': {
      //   textDecoration: 'underline'
      // }
    },
  };
};

const PostBody = ({ post, previous, next, siteUrl, classes }) => {
  const disqusShortname = 'tomyail';
  const disqusConfig = {
    url: `${siteUrl}${post.frontmatter.path.replace('/', '')}`,
    title: post.frontmatter.title,
  };
  const theme = useTheme();
  const {
    frontmatter: { tags = [] },
  } = post;
  return (
    <Container className={classes.root} maxWidth={'md'}>
      <Box component="main">
        <Typography variant="h3" color={theme.palette.primary.main}>
          {post.frontmatter.title}
        </Typography>
        <Box display="flex" justifyContent="space-between">
          <Box component="span">
            {new Date(post.frontmatter.created_at).toLocaleDateString()}
          </Box>
          <Box component="span">{tags.join(',')}</Box>
        </Box>
        <Box
          className={classes.content}
          dangerouslySetInnerHTML={{
            __html: post.html,
          }}
          component="article"
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
              <Button>
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
              <Button>
                {truncate(next.frontmatter.title)}
                <ArrowForwardIosOutlinedIcon className={classes.rightIcon} />
              </Button>
            </Link>
          ) : (
            <Button disabled>没有更多文章</Button>
          )}
        </Box>
        <ScrollTop>
          <Fab color="secondary" size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
        <Disqus.DiscussionEmbed
          shortname={disqusShortname}
          config={disqusConfig}
        />
      </Box>
    </Container>
  );
};

export default withTheme(withStyles(style)(PostBody));
