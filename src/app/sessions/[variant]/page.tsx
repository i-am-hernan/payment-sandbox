"use client";

import Code from "@/components/custom/sandbox/editors/Code";
import { ManageAdyenSessions } from "@/components/custom/adyen/sessions/ManageAdyenSessions";
import Api from "@/components/custom/sandbox/tabs/Api";
import Style from "@/components/custom/sandbox/tabs/Style";
import Html from "@/components/custom/sandbox/tabs/Html";
import Script from "@/components/custom/sandbox/tabs/Script";
import Sandbox from "@/components/custom/sandbox/layout/Sandbox";
import SandBoxTabs from "@/components/custom/sandbox/layout/SandboxTabs";
import Sidebar from "@/components/custom/sandbox/navbars/Sidebar";
import Topbar from "@/components/custom/sandbox/navbars/Topbar";
import Events from "@/components/custom/sandbox/tabs/Event";
import type { RootState } from "@/store/store";
import { formulaActions } from "@/store/reducers";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";

interface SectionType {
  section: "Client" | "Server" | "Webhooks";
}

const { updateSessionsRequest } = formulaActions;

const Page: any = () => {
  const [section, setSection] = useState<SectionType["section"]>("Server");

  const { componentState } = useSelector((state: RootState) => state.component);
  const { theme } = useSelector((state: RootState) => state.user);
  const { variant } = useParams<{
    variant: string;
  }>();

  const { run, unsavedChanges, request, checkoutAPIVersion } = useSelector(
    (state: RootState) => state.formula
  );
  const { sessions } = request;
  const { sessions: sessionsAPIVersion } = checkoutAPIVersion;

  const { defaultMerchantAccount } = useSelector(
    (state: RootState) => state.user
  );

  const paymentMethodsMerchantAccount = {
    merchantAccount: `${defaultMerchantAccount}`,
  };

  let tabsMap: any = [];
  let crumbs: Array<string> = [];

  let topRightTabsMap = [
    {
      title: `${variant}`,
      icon: (
        <span className="flex">
          <span className="font-semibold px-1 text-xxs text-preview">
            preview
          </span>
        </span>
      ),
      content: <ManageAdyenSessions key={run ? "run" : "default"} />,
      value: variant,
    },
  ];
  let bottomRightTabsMap = [
    {
      title: `${variant} (read-only)`,
      icon: (
        <span className="flex">
          <span className="font-semibold px-1 text-xxs text-info">state</span>
        </span>
      ),
      content: (
        <Code
          code={JSON.stringify(componentState)}
          theme={theme}
          type="json"
          readOnly={true}
        />
      ),
      value: "state",
    },
  ];

  if (section === "Client") {
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
    crumbs = ["sessions", variant, "client"];
  } else if (section === "Server") {
    tabsMap = [
      {
        title: `/v${sessionsAPIVersion}/sessions`,
        icon: (
          <span className="font-semibold px-1 text-xxs text-adyen">
            {"POST"}
          </span>
        ),
        content: (
          <Api
            api="sessions"
            schema="CreateCheckoutSessionRequest"
            request={sessions}
            updateRequest={updateSessionsRequest}
          />
        ),
        value: "sessions",
      },
    ];
    crumbs = ["sessions", variant, "server"];
  } else if (section === "Webhooks") {
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
    crumbs = ["sessions", variant];
  }

  return (
    <body className={`${theme}`}>
      <header>
        <Topbar />
      </header>
      <main>
        <Sandbox
          main={<SandBoxTabs key={section} tabsMap={tabsMap} crumbs={crumbs} />}
          topRight={<SandBoxTabs tabsMap={topRightTabsMap} />}
          bottomRight={<SandBoxTabs tabsMap={bottomRightTabsMap} />}
        />
      </main>
      <footer>
        <Sidebar
          section={section}
          setSection={setSection}
          unsavedChanges={unsavedChanges}
          paymentMethodsMerchantAccount={paymentMethodsMerchantAccount}
        />
      </footer>
    </body>
  );
};

export default Page;
