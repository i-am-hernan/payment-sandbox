"use client";

import SandboxLayout from "../components/Sandbox/Layout";
import FrontendMain from "../components/Sandbox/Frontend/FrontendMain";
import Component from "../components/Sandbox/Adyen/Component";
import AdyenState from "../components/Sandbox/Adyen/AdyenState";

const Page: any = () => {
  return <SandboxLayout main={FrontendMain} topRight={Component} bottomRight={AdyenState} />;
};

export default Page;
