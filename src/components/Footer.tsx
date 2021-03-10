import * as React from 'react';
import { Box, Container, Link } from '../../node_modules/@material-ui/core';
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';
const Footer = () => {
  return (
    <div>
      {`© ${new Date().getFullYear()} tomyail.com`}
      <FavoriteOutlinedIcon color="secondary" fontSize="small" />
      <Link href="https://github.com/Tomyail/blog"> Build</Link> with
      <Link href="https://www.gatsbyjs.com/"> Gatsby</Link> and
      <Link href="https://material-ui.com/"> Material-UI</Link>
    </div>
  );
};

export default Footer;
