"use client";

import SandboxLayout from "../components/Sandbox/Layout";
import FrontendMain from "../components/Sandbox/Frontend/FrontendMain";
import Component from "../components/Sandbox/Adyen/Component";
import AdyenState from "../components/Sandbox/Adyen/AdyenState";
import { useEffect } from "react";
import { Button } from "../components/ui/button";

import AdyenCheckout from "@adyen/adyen-web";
import "@adyen/adyen-web/dist/adyen.css";
import { IFormula } from "./schema/Formula";

import "./globals.css";

const Page: any = () => {
  const getStarterFormula = async (): Promise<IFormula> => {
    const response = await fetch("http://localhost:3000/api/formula/", {
      cache: "no-store",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const formula = await response.json();
    console.log(formula);
    return formula;
  };

  const createAdyenSession = async (): Promise<{ id: string; sessionData: string }> => {
    // TODO: Make this configurable
    const response = await fetch("http://localhost:3000/api/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: 1000, currency: "USD" }),
    });

    const session = await response.json();
    console.log(session);
    return session;
  };

  // On initial load
  // 1. Create Adyen Session
  // 2. render the Adyen Drop-in with the session
  useEffect(() => {
    const createAdyenCheckout = async () => {
      const starterFormula = await getStarterFormula();
      console.log(starterFormula);
      const { configuration } = starterFormula;
      const session = await createAdyenSession();

      console.log(configuration);
      // Parse the stringified configuration
      // const configuration = JSON.parse(JSON.stringify(stringifiedConfiguration));
      console.log(configuration);
      // Inject the session data into the formula
      configuration.session.id = session.id;
      configuration.session.sessionData = session.sessionData;

      const checkout = await AdyenCheckout(configuration);
      const dropinComponent = checkout.create("dropin").mount("#dropInContainer");
      return dropinComponent;
    };
    createAdyenCheckout();
  }, []);

  return (
    // <SandboxLayout
    //   main={FrontendMain}
    //   topRight={Component}
    //   bottomRight={AdyenState}
    // />
    <>
      <Button variant="outline">Button</Button>

      <h1 className="text-3xl font-bold underline">Testing</h1>
      {/* <div id="dropInContainer"></div> */}
    </>
  );
};

export default Page;
