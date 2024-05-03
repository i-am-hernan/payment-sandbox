import { ThemeProvider } from "@mui/material";
import Head from "next/head";
import React from "react";
import { themeOptions } from "../components/theme";
import Providers from "../store/provider";

type LayoutProps = {
  title: string;
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  return (
    <ThemeProvider theme={themeOptions}>
      <html>
        <Head>
          <title>{title}</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </Head>
        <body>
          <header>{/* Add your header content here */}</header>
          <Providers>
            <main>{children}</main>
          </Providers>
          <footer>{/* Add your footer content here */}</footer>
        </body>
      </html>
    </ThemeProvider>
  );
};

export default Layout;
