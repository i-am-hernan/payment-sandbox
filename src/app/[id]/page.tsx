'use client';

import AdyenComponent from "../../components/Adyen/AdyenComponent";
import AdyenState from "../../components/Adyen/AdyenState";
import CSS from "../../components/Frontend/CSS";
import HTML from "../../components/Frontend/HTML";
import JS from "../../components/Frontend/JS";
import SandboxLayout from "../../components/Sandbox/Layout";
import TabbedMain from "../../components/Sandbox/TabbedMain";

const Page: any = () => {
  return (
    <SandboxLayout
      main={<TabbedMain titles={["HTML", "CSS", "JS"]} contents={[<HTML />, <CSS />, <JS />]} />}
      topRight={AdyenComponent}
      bottomRight={AdyenState}
    />
  );
};

export default Page;
