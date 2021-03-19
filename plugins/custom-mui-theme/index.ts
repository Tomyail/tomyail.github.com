import constate from 'constate';
import React, { useEffect, useState } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme } from '@material-ui/core';

const useThemeHook = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const originTheme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          primary: {
            main: '#1e88e5',
          },
          secondary: {
            main: '#e91e63',
          },
        },
      }),
    [prefersDarkMode]
  );

  const [theme, setTheme] = useState(originTheme);
  console.log(theme.palette);

  useEffect(() => {
    setTheme(originTheme);
  }, [originTheme]);

  return {
    theme,
    setTheme,
  };
};

export const [CustomThemeProvider, useTheme] = constate(useThemeHook);
