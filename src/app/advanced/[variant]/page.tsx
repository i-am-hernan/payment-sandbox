"use client";

import CodeEditor from "@/components/custom/sandbox/editors/codeEditor";
import { ManageAdvanceComponent } from "@/components/custom/adyen/advanced/ManageAdvanceComponent";
import API from "@/components/custom/sandbox/tabs/api";
import CSS from "@/components/custom/sandbox/tabs/css";
import Html from "@/components/custom/sandbox/tabs/html";
import JS from "@/components/custom/sandbox/tabs/js";
import Sandbox from "@/components/custom/sandbox/layout/sandbox";
import Tabs from "@/components/custom/sandbox/layout/tabs";
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
  const { run, build } = useSelector((state: RootState) => state.formula);
  const { checkoutAPIVersion } = build;
  const { variantState } = useSelector(
    (state: RootState) => state.adyenVariant
  );

  const { variant } = useParams<{
    variant: string;
  }>();

  let titles: any = [];
  let contents: any = [];

  if (section === "client") {
    titles.push(
      "checkout.html",
      "style.css",
      `${variant ? variant : "checkout"}.js`
    );
    contents.push(
      <Html key={"HTML"} />,
      <CSS key={"CSS"} />,
      <JS key={"JS"} />
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
      <Sandbox
        main={<Tabs titles={titles} contents={contents} key={section} />}
        topRight={<ManageAdvanceComponent key={run ? "run" : "default"} />}
        bottomRight={
          <CodeEditor code={JSON.stringify(variantState)} type="json" />
        }
      />
    </div>
  );
};

export default Page;
