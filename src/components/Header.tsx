import { createMuiTheme, Hidden, IconButton } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import { Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7RoundedIcon from '@material-ui/icons/Brightness7Rounded';
import DehazeIcon from '@material-ui/icons/Dehaze';
import { graphql, Link, useStaticQuery } from 'gatsby';
import React from 'react';
import { useTheme } from '../../plugins/custom-mui-theme';
import DehazeOutlinedIcon from '@material-ui/icons/DehazeOutlined';
const Header = ({ showDrawerSwitch = false, onSwitchClick = undefined }) => {
  const { setTheme, theme } = useTheme();
  const data = useStaticQuery(graphql`
    query HeaderQuery {
      site {
        siteMetadata {
          title
          siteUrl
        }
      }
    }
  `);
  const Bar = (
    <AppBar
      color={theme.palette.mode === 'dark' ? 'default' : 'primary'}
      sx={{ zIndex: theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            '& a': {
              color: 'white',
              textDecoration: 'inherit',
            },
            '& a:hover': {
              textDecoration: 'inherit',
            },
          }}
        >
          <Link to={'/'}>{data.site.siteMetadata.title}</Link>
        </Typography>
        {showDrawerSwitch && (
          <Hidden mdUp>
            <IconButton
              sx={{ color: 'white' }}
              onClick={() => {
                onSwitchClick && onSwitchClick();
              }}
            >
              <DehazeOutlinedIcon />
            </IconButton>
          </Hidden>
        )}
        <IconButton
          aria-label="switch theme"
          sx={{ color: 'white' }}
          onClick={() => {
            const newTheme = createMuiTheme({
              palette: {
                primary: {
                  main: theme.palette.primary.main,
                },
                secondary: {
                  main: theme.palette.secondary.main,
                },
                mode:
                  (theme as Theme).palette.mode === 'dark' ? 'light' : 'dark',
              },
            });
            setTheme(newTheme);
          }}
        >
          {(theme as Theme).palette.mode === 'dark' ? (
            <Brightness7RoundedIcon /> //light
          ) : (
            <Brightness4Icon /> //moon
          )}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
  return (
    <React.Fragment>
      {Bar}
      <Toolbar id="back-to-top-anchor" />
    </React.Fragment>
  );
};

export default Header;
