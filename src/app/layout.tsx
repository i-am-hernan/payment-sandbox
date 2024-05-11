import Head from "next/head";
import React from "react";
import SandboxTheme from "./theme";
import Providers from "../store/provider";
// Need to add header nav, sidebar nav, and footer
// These can all be react server components that are rendered on the server
// and then hydrated on the client
// We can also fetch the list of txvariants from the server and pass them to the client

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }: Any) => {
  return (
    <html>
      <Head>
        <title>{"Adyen Sandbox"}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body>
        <Providers>
          <SandboxTheme>
            <header>{/* Add your header content here */}</header>
            <main>{children}</main>
            <footer>{/* Add your footer content here */}</footer>
          </SandboxTheme>
        </Providers>
      </body>
    </html>
  );
};

export default Layout;
