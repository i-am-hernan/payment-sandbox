"use client";

import AdyenState from "@/components/custom/adyen/AdyenState";
import { ManageAdyenAdvance } from "@/components/custom/adyen/ManageAdyenAdvance";
import API from "@/components/custom/sandbox/backend/API";
import CSS from "@/components/custom/sandbox/frontend/CSS";
import HTML from "@/components/custom/sandbox/frontend/HTML";
import JS from "@/components/custom/sandbox/frontend/JS";
import SandboxLayout from "@/components/custom/sandbox/layout";
import MainTabs from "@/components/custom/sandbox/layout/mainTabs";
import Sidebar from "@/components/custom/sandbox/layout/sidebar";
import Topbar from "@/components/custom/sandbox/layout/topbar";
import Events from "@/components/custom/sandbox/webhooks/Events";
import type { RootState } from "@/store/store";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";

interface SectionType {
  section: "client" | "server" | "webhooks";
}

const Page: any = () => {
  const [section, setSection] = useState<SectionType["section"]>("client");

  const { runBuild, checkoutAPIVersion } = useSelector(
    (state: RootState) => state.currentFormula
  );

  const { variant } = useParams<{
    variant: string;
  }>();

  let titles: any = [];
  let contents: any = [];

  if (section === "client") {
    titles.push(`${variant ? variant : 'checkout'}.js`, "style.css", "checkout.html");
    contents.push(
      <JS key={"JS"} />,
      <CSS key={"CSS"} />,
      <HTML key={"HTML"} />
    );
  } else if (section === "server") {
    titles.push(
      `/v${checkoutAPIVersion}/paymentMethods`,
      `/v${checkoutAPIVersion}/payments`,
      `/v${checkoutAPIVersion}/payment/details`
    );
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
        main={<MainTabs titles={titles} contents={contents} key={section} />}
        topRight={
          <ManageAdyenAdvance key={runBuild ? "runBuild" : "default"} />
        }
        bottomRight={<AdyenState />}
      />
    </div>
  );
};

export default Page;
