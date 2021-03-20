import { Box, useScrollTrigger, useTheme, Zoom } from '@material-ui/core';
import React from 'react';

export function ScrollTop(props: Props) {
  const { children } = props;
  const theme = useTheme();
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
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{
          zIndex: theme.zIndex.appBar,
          position: 'fixed',
          bottom: theme.spacing(4),
          right: theme.spacing(4),
        }}
      >
        {children}
      </Box>
    </Zoom>
  );
}
