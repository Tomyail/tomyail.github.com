import AppBar from "@material-ui/core/AppBar";
import Slide from "@material-ui/core/Slide";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Zoom from "@material-ui/core/Zoom";
import { graphql, useStaticQuery } from "gatsby";
import Link from "gatsby-link";
import React from "react";
import Fab from "@material-ui/core/Fab";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

interface Props {
  children: React.ReactElement;
}

function HideOnScroll(props: Props) {
  const { children } = props;

  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const useStyles2 = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      zIndex: theme.zIndex.appBar,
      position: "fixed",
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  })
);

function ScrollTop(props: Props) {
  const { children } = props;
  const classes = useStyles2();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = document.querySelector("#back-to-top-anchor");

    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth",block:'center' });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role="presentation" className={classes.root}>
        {children}
      </div>
    </Zoom>
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
      "& a": {
        color: theme.palette.primary.light,
        textDecoration: "inherit",
      },
      "& a:hover": {
        textDecoration: "inherit",
      },
    },
  })
);
const Header = () => {
  const classes = useStyles();
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
  return (
    <React.Fragment>
      <HideOnScroll>
        <AppBar>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              <Link to={"/"}>{data.site.siteMetadata.title}</Link>
            </Typography>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar id="back-to-top-anchor" />
      <ScrollTop>
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </React.Fragment>
  );
};

export default Header;
