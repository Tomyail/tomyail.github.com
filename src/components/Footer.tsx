import * as React from 'react';
import { Box, Container, Link } from '../../node_modules/@material-ui/core';
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';
import { graphql, useStaticQuery } from 'gatsby';
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
  return (
    <Box
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      my={1}
    >
      <Box>
        {`© ${new Date().getFullYear()} ${data.site.siteMetadata.title}`}
      </Box>
      <FavoriteOutlinedIcon color="secondary" fontSize="small" />
      <Box>
        <Link href={source}> Build</Link> with
        <Link href="https://www.gatsbyjs.com/"> Gatsby</Link> and
        <Link href="https://material-ui.com/"> Material-UI</Link>
      </Box>
    </Box>
  );
};

export default Footer;
