import Head from "next/head";
import React from "react";
import Providers from "../store/provider";
import '../styles/globals.css'

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }: any) => {
  return (
    <html>
      <Head>
        <title>{"Adyen Sandbox"}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body>
        <Providers>
            <header>{/* Add your header content here */}</header>
            <main>{children}</main>
            <footer>{/* Add your footer content here */}</footer>
        </Providers>
      </body>
    </html>
  );
};

export default Layout;
