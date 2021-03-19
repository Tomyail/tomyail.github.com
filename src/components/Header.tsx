import { createMuiTheme, Hidden, IconButton } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Slide from '@material-ui/core/Slide';
import { Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7RoundedIcon from '@material-ui/icons/Brightness7Rounded';
import DehazeIcon from '@material-ui/icons/Dehaze';
import { graphql, Link, useStaticQuery } from 'gatsby';
import React from 'react';
import { useTheme } from '../../plugins/custom-mui-theme';
function HideOnScroll(props: { children: React.ReactElement }) {
  const { children } = props;

  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

type Props = { appBarStyle?: any; hideBar?: boolean };
const Header = ({ appBarStyle, hideBar = true }: Props) => {
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
      sx={appBarStyle}
    >
      <Toolbar>
        <Hidden mdUp>
          <IconButton>
            <DehazeIcon />
          </IconButton>
        </Hidden>
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
      {hideBar ? <HideOnScroll>{Bar}</HideOnScroll> : Bar}
      <Toolbar id="back-to-top-anchor" />
    </React.Fragment>
  );
};

export default Header;
