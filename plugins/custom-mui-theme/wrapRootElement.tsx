import { CssBaseline, StyledEngineProvider } from '@material-ui/core';
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
  // injectFirst 可以避免首次加载 css 加载优先级慢于 html
  // 给用户的感觉是界面样式不全

  return <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  </StyledEngineProvider>;
};
