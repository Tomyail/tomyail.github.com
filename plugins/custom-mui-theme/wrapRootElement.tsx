import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import { CustomThemeProvider, useTheme } from '.';

export const wrapRootElement = ({ element }) => {
  return (
    <CustomThemeProvider>
      <MaterialRoot>{element}</MaterialRoot>
    </CustomThemeProvider>
  );
};

const MaterialRoot = ({ children }) => {
  const { theme } = useTheme();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
