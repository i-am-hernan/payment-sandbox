import React from "react";
import Providers from "../store/provider";
import "../styles/globals.css";

export const metadata = {
  title: 'Formulize | Build your own',
  description: 'Adyen Sandbox Environment',
  icons: {
    icon: [
      {
        url: '/icons/cart.svg',
        type: 'image/svg+xml',
      }
    ],
  },
};

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }: any) => {
  return (
    <html lang="en">
      <head>
        <link 
          rel="icon" 
          type="image/svg+xml" 
          href="/icons/cart.svg" 
          sizes="any"
        />
        <link 
          rel="shortcut icon" 
          type="image/svg+xml" 
          href="/icons/cart.svg"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default Layout;
