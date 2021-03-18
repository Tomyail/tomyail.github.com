import { createMuiTheme, Hidden, IconButton } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Fab from '@material-ui/core/Fab';
import Slide from '@material-ui/core/Slide';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Zoom from '@material-ui/core/Zoom';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7RoundedIcon from '@material-ui/icons/Brightness7Rounded';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { graphql, Link, useStaticQuery } from 'gatsby';
import React from 'react';
//@ts-ignore
import { useTheme } from '../../plugins/custom-mui-theme';
import { ScrollTop } from './ScrollTop';
import DehazeIcon from '@material-ui/icons/Dehaze';
function HideOnScroll(props: { children: React.ReactElement }) {
  const { children } = props;

  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      '& a': {
        color: theme.palette.primary.light,
        textDecoration: 'inherit',
      },
      '& a:hover': {
        textDecoration: 'inherit',
      },
    },
  })
);
type Props = { appBarStyle?: string; hideBar?: boolean };
const Header = ({ appBarStyle, hideBar = true }: Props) => {
  const classes = useStyles();
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
      className={appBarStyle}
    >
      <Toolbar>
        <Hidden mdUp>
          <IconButton>
            <DehazeIcon />
          </IconButton>
        </Hidden>
        <Typography variant="h6" className={classes.title}>
          <Link to={'/'}>{data.site.siteMetadata.title}</Link>
        </Typography>
        <IconButton
          aria-label="switch theme"
          sx={{ color: 'white' }}
          onClick={() => {
            const newTheme = createMuiTheme({
              ...theme,
              ...{
                palette: {
                  mode:
                    (theme as Theme).palette.mode === 'dark' ? 'light' : 'dark',
                },
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
