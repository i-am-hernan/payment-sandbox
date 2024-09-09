"use client";

import { ManageAdvanceComponent } from "@/components/custom/adyen/advanced/ManageAdvanceComponent";
import Code from "@/components/custom/sandbox/editors/Code";
import Sandbox from "@/components/custom/sandbox/layout/Sandbox";
import SandBoxTabs from "@/components/custom/sandbox/layout/SandboxTabs";
import Sidebar from "@/components/custom/sandbox/navbars/Sidebar";
import Topbar from "@/components/custom/sandbox/navbars/Topbar";
import Api from "@/components/custom/sandbox/tabs/Api";
import Events from "@/components/custom/sandbox/tabs/Event";
import Html from "@/components/custom/sandbox/tabs/Html";
import Script from "@/components/custom/sandbox/tabs/Script";
import Style from "@/components/custom/sandbox/tabs/Style";
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

  // Change path to advance instead of advcanced

  let tabsMap: any = [];
  let crumbs: Array<string> = [];
  let topRightTabsMap: any = [
    {
      title: `${variant}`,
      icon: (
        <span className="flex">
          <span className="font-semibold px-1 text-xxs text-adyen">
            preview
          </span>
        </span>
      ),
      content: <ManageAdvanceComponent key={run ? "run" : "default"} />,
      value: variant,
    },
  ];

  let bottomRightTabsMap: any = [
    {
      title: `${variant} (read-only)`,
      icon: (
        <span className="flex">
          <span className="font-semibold px-1 text-xxs text-info">state</span>
        </span>
      ),
      content: (
        <Code code={JSON.stringify(variantState)} type="json" readOnly={true} />
      ),
      value: "state",
    },
  ];

  if (section === "client") {
    tabsMap = [
      {
        title: `${variant ? variant : "checkout"}.js`,
        icon: (
          <span className="flex">
            <span className="font-semibold px-1 text-xxs text-js">{"JS"}</span>
          </span>
        ),
        content: <Script key={"script"} />,
        value: `${variant}.js`,
        unsavedChanges: unsavedChanges.js,
      },
      {
        title: "style.css",
        icon: (
          <span className="flex">
            <span className="font-semibold px-1 text-xxs text-info">{"#"}</span>
          </span>
        ),
        content: <Style key={"stye"} />,
        value: "style.css",
        unsavedChanges: unsavedChanges.style,
      },
      {
        title: "checkout.html (read-only)",
        icon: (
          <span className="flex">
            <span className="font-semibold px-1 text-xxs text-warning">
              {"</>"}
            </span>
          </span>
        ),
        content: <Html key={"html"} />,
        value: "checkout.html",
        unsavedChanges: unsavedChanges.html,
      },
    ];
    crumbs = ["advanced", variant, "client"];
  } else if (section === "server") {
    tabsMap = [
      {
        title: `/v${paymentMethodsAPIVersion}/paymentMethods`,
        icon: (
          <span className="font-semibold px-1 text-xxs text-adyen">
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
          <span className="font-semibold px-1 text-xxs text-adyen">
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
          <span className="font-semibold px-1 text-xxs text-adyen">
            {"POST"}
          </span>
        ),
        content: <Api api="paymentDetails" schema="PaymentDetailsRequest" />,
        value: "paymentdetails",
        unsavedChanges: unsavedChanges.paymentDetails,
      },
    ];
    crumbs = ["advanced", variant, "server"];
  } else if (section === "webhooks") {
    tabsMap = [
      {
        title: "webhooks",
        icon: (
          <span className="font-semibold px-1 text-xxs text-info">
            {"event"}
          </span>
        ),
        content: <Events key={"Events"} />,
        value: "events",
      },
    ];
    crumbs = ["advanced", variant];
  }
  // Make the bottom right corner also a tab with API logs and state of the variant
  return (
    <div>
      <Sidebar
        section={section}
        setSection={setSection}
        unsavedChanges={unsavedChanges}
      />
      <Topbar />
      <Sandbox
        main={<SandBoxTabs key={section} tabsMap={tabsMap} crumbs={crumbs} />}
        topRight={<SandBoxTabs tabsMap={topRightTabsMap} />}
        bottomRight={
          <SandBoxTabs tabsMap={bottomRightTabsMap} />
        }
      />
    </div>
  );
};

export default Page;
