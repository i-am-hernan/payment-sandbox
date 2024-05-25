"use client";

import AdyenComponent from "@/components/Custom/Adyen/AdyenComponent";
import AdyenState from "@/components/Custom/Adyen/AdyenState";
import API from "@/components/Custom/Sandbox/Backend/API";
import CSS from "@/components/Custom/Sandbox/Frontend/CSS";
import HTML from "@/components/Custom/Sandbox/Frontend/HTML";
import JS from "@/components/Custom/Sandbox/Frontend/JS";
import Events from "@/components/Custom/Sandbox/Webhooks/Events";
import SandboxLayout from "@/components/Custom/Sandbox/Layout";
import Sidebar from "@/components/Custom/Sandbox/Layout/Sidebar";
import TabbedMain from "@/components/Custom/Sandbox/Layout/TabbedMain";
import Topbar from "@/components/Custom/Sandbox/Layout/Topbar";

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
              titles={["/Sessions"]}
              contents={[
                <API key={"Sessions"} />
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