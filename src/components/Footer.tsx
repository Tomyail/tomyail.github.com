import { Box, Link, useMediaQuery, useTheme } from '@material-ui/core';
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';
import { keyframes } from '@material-ui/styled-engine';
import { graphql, useStaticQuery } from 'gatsby';
import * as React from 'react';
const heartBeat = keyframes(`
	from {
	transform: scale(0.8)
	}
	to {
	transform: scale(1.2)
	}
`);
const Footer = () => {
  //inspect VERCEL_GIT_COMMIT_SHA env
  const source = process.env.VERCEL_GIT_COMMIT_SHA
    ? `https://github.com/Tomyail/blog/tree/${process.env.VERCEL_GIT_COMMIT_SHA}`
    : 'https://github.com/Tomyail/blog';
  const data = useStaticQuery(graphql`
    query BlogDesc {
      site {
        siteMetadata {
          title
          siteUrl
        }
      }
    }
  `);

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  return (
    <Box
      display="flex"
      justifyContent="center"
      flexDirection={matches ? 'row' : 'column'}
      alignItems="center"
      fontSize="smaller"
    >
      <Box>
        {`© ${new Date().getFullYear()} ${data.site.siteMetadata.title}`}
      </Box>
      <Box mx={1}>
        <FavoriteOutlinedIcon
          color="secondary"
          fontSize="medium"
          sx={{
            animation: `${heartBeat} .4s ease infinite alternate-reverse`,
          }}
        />
      </Box>
      <Box>
        <Link href={source}> Build</Link> with
        <Link href="https://www.gatsbyjs.com/"> Gatsby</Link> and
        <Link href="https://material-ui.com/"> Material-UI</Link>
      </Box>
    </Box>
  );
};

export default Footer;
