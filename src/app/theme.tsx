"use client";

import { themeOptions } from "../components/theme";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

const SandboxTheme = ({ children }: any) => {
  return (
    <ThemeProvider theme={createTheme(themeOptions)}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
export default SandboxTheme;
