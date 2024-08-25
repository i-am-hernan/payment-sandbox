"use client";

import { ManageAdvanceComponent } from "@/components/custom/adyen/advanced/ManageAdvanceComponent";
import CodeEditor from "@/components/custom/sandbox/editors/CodeEdito";
import Sandbox from "@/components/custom/sandbox/layout/Sandbo";
import SandBoxTabs from "@/components/custom/sandbox/layout/SandboxTabs";
import Sidebar from "@/components/custom/sandbox/navbars/Sideba";
import Topbar from "@/components/custom/sandbox/navbars/Topba";
import Api from "@/components/custom/sandbox/tabs/Ap";
import CSS from "@/components/custom/sandbox/tabs/Style";
import Events from "@/components/custom/sandbox/tabs/Event";
import Html from "@/components/custom/sandbox/tabs/Htm";
import JS from "@/components/custom/sandbox/tabs/Script";

import type { RootState } from "@/store/store";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";

interface SectionType {
  section: "client" | "server" | "webhooks";
}

const Page: any = () => {
  const [section, setSection] = useState<SectionType["section"]>("client");
  const { run, checkoutAPIVersion } = useSelector(
    (state: RootState) => state.formula
  );
  const { variantState } = useSelector(
    (state: RootState) => state.adyenVariant
  );

  const { variant } = useParams<{
    variant: string;
  }>();

  const {
    paymentMethods: paymentMethodsAPIVersion,
    payments: paymentsAPIVersion,
    paymentDetails: paymentDetailsAPIVersion,
  } = checkoutAPIVersion;

  let tabsMap: any = [];

  if (section === "client") {
    tabsMap = [
      {
        title: "checkout.html",
        content: <Html key={"HTML"} />,
        value: "html",
      },
      {
        title: "style.css",
        content: <CSS key={"CSS"} />,
        value: "css",
      },
      {
        title: `${variant ? variant : "checkout"}.js`,
        content: <JS key={"JS"} />,
        value: "js",
      },
    ];
  } else if (section === "server") {
    tabsMap = [
      {
        title: `/v${paymentMethodsAPIVersion}/paymentMethods`,
        content: <Api api="paymentMethods" schema="PaymentMethodsRequest" />,
        value: "paymentmethods",
      },
      {
        title: `/v${paymentsAPIVersion}/payments`,
        content: <Api api="payments" schema="PaymentRequest" />,
        value: "payments",
      },
      {
        title: `/v${paymentDetailsAPIVersion}/payment/details`,
        content: <Api api="paymentDetails" schema="PaymentDetailsRequest" />,
        value: "paymentdetails",
      },
    ];
  } else if (section === "webhooks") {
    tabsMap = [
      {
        title: "Events",
        content: <Events key={"Events"} />,
        value: "events",
      },
    ];
  }
  return (
    <div>
      <Sidebar section={section} setSection={setSection} />
      <Topbar />
      <Sandbox
        main={<SandBoxTabs key={section} tabsMap={tabsMap} />}
        topRight={<ManageAdvanceComponent key={run ? "run" : "default"} />}
        bottomRight={
          <CodeEditor code={JSON.stringify(variantState)} type="json" />
        }
      />
    </div>
  );
};

export default Page;
