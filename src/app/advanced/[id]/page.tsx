"use client";

import AdyenComponent from "@/components/Adyen/AdyenComponent";
import AdyenState from "@/components/Adyen/AdyenState";
import API from "@/components/Backend/API";
import CSS from "@/components/Frontend/CSS";
import HTML from "@/components/Frontend/HTML";
import JS from "@/components/Frontend/JS";
import SandboxLayout from "@/components/custom/Sandbox/Layout";
import Sidebar from "@/components/custom/Sandbox/Sidebar";
import TabbedMain from "@/components/custom/Sandbox/TabbedMain";
import Events from "@/components/Webhooks/Events";
import Topbar from "@/components/custom/Sandbox/Topbar";

import { useState } from "react";

interface SectionType {
  section: "client" | "server" | "webhooks";
}

const Page: any = () => {
  const [section, setSection] = useState<SectionType["section"]>("client");

  return (
    <div>
      <Sidebar section={section} setSection={setSection} />
      <Topbar />
      {section === "client" && (
        <SandboxLayout
          main={
            <TabbedMain
              titles={["HTML", "CSS", "JS"]}
              contents={[
                <HTML key={"HTML"} />,
                <CSS key={"CSS"} />,
                <JS key={"JS"} />,
              ]}
            />
          }
          topRight={AdyenComponent}
          bottomRight={AdyenState}
        />
      )}
      {section === "server" && (
        <SandboxLayout
          main={
            <TabbedMain
              titles={["/PaymentMethods", "/Payments", "/Payment/Details"]}
              contents={[
                <API key={"paymentmethods"} />,
                <API key={"payments"} />,
                <API key={"paymentdetails"} />,
              ]}
            />
          }
          topRight={AdyenComponent}
          bottomRight={AdyenState}
        />
      )}
      {section === "webhooks" && (
        <SandboxLayout
          main={
            <TabbedMain
              titles={["Events"]}
              contents={[<Events key={"Events"} />]}
            />
          }
          topRight={AdyenComponent}
          bottomRight={AdyenState}
        />
      )}
    </div>
  );
};

export default Page;
