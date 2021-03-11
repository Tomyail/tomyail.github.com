import {
  createStyles,
  makeStyles,
  Theme,
  useScrollTrigger,
  Zoom,
} from '@material-ui/core';
import React from 'react';

const useStyles2 = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      zIndex: theme.zIndex.appBar,
      position: 'fixed',
      bottom: theme.spacing(4),
      right: theme.spacing(2),
    },
  })
);

export function ScrollTop(props: Props) {
  const { children } = props;
  const classes = useStyles2();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = document.querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
