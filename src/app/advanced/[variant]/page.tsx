"use client";

import CodeEditor from "@/components/custom/sandbox/editors/codeEditor";
import { ManageAdvanceComponent } from "@/components/custom/adyen/advanced/ManageAdvanceComponent";
import Api from "@/components/custom/sandbox/tabs/api";
import CSS from "@/components/custom/sandbox/tabs/css";
import Html from "@/components/custom/sandbox/tabs/html";
import JS from "@/components/custom/sandbox/tabs/js";
import Sandbox from "@/components/custom/sandbox/layout/sandbox";
import SandBoxTabs from "@/components/custom/sandbox/layout/SandboxTabs";
import Sidebar from "@/components/custom/sandbox/navbars/sidebar";
import Topbar from "@/components/custom/sandbox/navbars/topbar";
import Events from "@/components/custom/sandbox/tabs/events";

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

  const { paymentMethods, payments, paymentDetails } =
    checkoutAPIVersion;

  let titles: any = [];
  let contents: any = [];
  let values: any = [];

  if (section === "client") {
    titles = [
      "checkout.html",
      "style.css",
      `${variant ? variant : "checkout"}.js`,
    ];
    contents = [<Html key={"HTML"} />, <CSS key={"CSS"} />, <JS key={"JS"} />];
    values = ["html", "css", "js"];
  } else if (section === "server") {
    titles = [
      `/v${paymentMethods}/paymentMethods`,
      `/v${payments}/payments`,
      `/v${paymentDetails}/payment/details`,
    ];
    contents = [
      <Api key="paymentMethods" api="paymentMethods" schema="PaymentMethodsRequest" />,
      <Api key="payments" api="payments" schema="PaymentRequest" />,
      <Api key="paymentDetails" api="paymentDetails" schema="PaymentDetailsRequest" />,
    ];

    values = ["paymentmethods", "payments", "paymentdetails"];
  } else if (section === "webhooks") {
    titles = ["Events"];
    contents = [<Events key={"Events"} />];
    values = ["events"];
  }
  return (
    <div>
      <Sidebar section={section} setSection={setSection} />
      <Topbar />
      <Sandbox
        main={
          <SandBoxTabs
            titles={titles}
            contents={contents}
            key={section}
            values={values}
          />
        }
        topRight={<ManageAdvanceComponent key={run ? "run" : "default"} />}
        bottomRight={
          <CodeEditor code={JSON.stringify(variantState)} type="json" />
        }
      />
    </div>
  );
};

export default Page;
