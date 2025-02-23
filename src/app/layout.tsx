"use client";

import React from "react";
import Providers from "../store/provider";

import "../styles/globals.css";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }: any) => {
  return (
    <html lang="en">
      <head>
        <title>Lab | Build your checkout</title>
        <meta name="robots" content="noindex, nofollow, noarchive" />
        <meta name="googlebot" content="noindex, nofollow, noimageindex" />
        <link
          rel="icon"
          type="image/svg+xml"
          href="/icons/cart.svg"
          sizes="any"
        />
        <link rel="shortcut icon" type="image/svg+xml" href="/icons/cart.svg" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default Layout;
