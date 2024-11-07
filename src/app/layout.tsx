"use client";

import Head from "next/head";
import React from "react";
import Providers from "../store/provider";
import "../styles/globals.css";

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
        <Providers>{children} </Providers>
      </body>
    </html>
  );
};

export default Layout;
