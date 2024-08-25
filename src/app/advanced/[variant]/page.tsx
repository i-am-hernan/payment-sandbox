"use client";

import { ManageAdvanceComponent } from "@/components/custom/adyen/advanced/ManageAdvanceComponent";
import CodeEditor from "@/components/custom/sandbox/editors/CodeEdito";
import Sandbox from "@/components/custom/sandbox/layout/Sandbox";
import SandBoxTabs from "@/components/custom/sandbox/layout/SandboxTabs";
import Sidebar from "@/components/custom/sandbox/navbars/Sidebar";
import Topbar from "@/components/custom/sandbox/navbars/Topbar";
import Api from "@/components/custom/sandbox/tabs/Api";
import Events from "@/components/custom/sandbox/tabs/Event";
import Html from "@/components/custom/sandbox/tabs/Html";
import Script from "@/components/custom/sandbox/tabs/Script";
import Style from "@/components/custom/sandbox/tabs/Style";
import CodeIcon from "@mui/icons-material/Code";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import JavascriptIcon from "@mui/icons-material/Javascript";
import WebhookIcon from "@mui/icons-material/Webhook";

import type { RootState } from "@/store/store";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";

interface SectionType {
  section: "client" | "server" | "webhooks";
}

const Page: any = () => {
  const [section, setSection] = useState<SectionType["section"]>("client");
  const { run, checkoutAPIVersion, unsavedChanges } = useSelector(
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
        icon: <CodeIcon fontSize="small" />,
        content: <Html key={"html"} />,
        value: "html",
        unsavedChanges: unsavedChanges.html,
      },
      {
        title: "style.css",
        icon: <FormatColorFillIcon fontSize="small" />,
        content: <Style key={"stye"} />,
        value: "style",
        unsavedChanges: unsavedChanges.style,
      },
      {
        title: `${variant ? variant : "checkout"}.js`,
        icon: <JavascriptIcon fontSize="small" />,
        content: <Script key={"script"} />,
        value: "script",
        unsavedChanges: unsavedChanges.js,
      },
    ];
  } else if (section === "server") {
    tabsMap = [
      {
        title: `/v${paymentMethodsAPIVersion}/paymentMethods`,
        icon: (
          <span className="font-semibold px-1 text-xs text-adyen">
            {"POST"}
          </span>
        ),
        content: <Api api="paymentMethods" schema="PaymentMethodsRequest" />,
        value: "paymentmethods",
        unsavedChanges: unsavedChanges.paymentMethods,
      },
      {
        title: `/v${paymentsAPIVersion}/payments`,
        icon: (
          <span className="font-semibold px-1 text-xs text-adyen">
            {"POST"}
          </span>
        ),
        content: <Api api="payments" schema="PaymentRequest" />,
        value: "payments",
        unsavedChanges: unsavedChanges.payments,
      },
      {
        title: `/v${paymentDetailsAPIVersion}/payment/details`,
        icon: (
          <span className="font-semibold px-1 text-xs text-adyen">
            {"POST"}
          </span>
        ),
        content: <Api api="paymentDetails" schema="PaymentDetailsRequest" />,
        value: "paymentdetails",
        unsavedChanges: unsavedChanges.paymentDetails,
      },
    ];
  } else if (section === "webhooks") {
    tabsMap = [
      {
        title: "Events",
        icon: <WebhookIcon />,
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
