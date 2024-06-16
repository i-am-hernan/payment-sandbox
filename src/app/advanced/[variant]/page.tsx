"use client";

import { AdyenAdvance } from "@/components/custom/adyen/AdyenAdvance";
import AdyenState from "@/components/custom/adyen/AdyenState";
import API from "@/components/custom/sandbox/backend/API";
import CSS from "@/components/custom/sandbox/frontend/CSS";
import HTML from "@/components/custom/sandbox/frontend/HTML";
import JS from "@/components/custom/sandbox/frontend/JS";
import SandboxLayout from "@/components/custom/sandbox/layout";
import Sidebar from "@/components/custom/sandbox/layout/sidebar";
import MainTabs from "@/components/custom/sandbox/layout/mainTabs";
import Topbar from "@/components/custom/sandbox/layout/topbar";
import Events from "@/components/custom/sandbox/webhooks/Events";
import { useState } from "react";

interface SectionType {
  section: "client" | "server" | "webhooks";
}
const Page: any = () => {
  const [section, setSection] = useState<SectionType["section"]>("client");
  let titles: any = [];
  let contents: any = [];

  if (section === "client") {
    titles.push("checkout.html", "style.css", "checkout.js");
    contents.push(
      <HTML key={"HTML"} />,
      <CSS key={"CSS"} />,
      <JS key={"JS"} />
    );
  } else if (section === "server") {
    titles.push("/paymentMethods", "/payments", "/payment/details");
    contents.push(
      <API key={"paymentmethods"} />,
      <API key={"payments"} />,
      <API key={"paymentdetails"} />
    );
  } else if (section === "webhooks") {
    titles.push("Events");
    contents.push(<Events key={"Events"} />);
  }

  return (
    <div>
      <Sidebar section={section} setSection={setSection} />
      <Topbar />
      <SandboxLayout
        main={<MainTabs titles={titles} contents={contents} key={section}/>}
        topRight={<AdyenAdvance />}
        bottomRight={<AdyenState />}
      />
    </div>
  );
};

export default Page;
