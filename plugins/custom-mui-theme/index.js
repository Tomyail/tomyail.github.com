import constate from "constate";
import { useState } from "react";
import originTheme from "./theme";

const useThemeHook = () => {
  const [theme, setTheme] = useState(originTheme);

  return {
    theme,
    setTheme,
  };
};

export const [CustomThemeProvider, useTheme] = constate(useThemeHook);
