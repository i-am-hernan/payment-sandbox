"use client";

import { ManageAdvanceComponent } from "@/components/custom/adyen/advanced/ManageAdvanceComponent";
import Sandbox from "@/components/custom/sandbox/layout/Sandbox";
import SandBoxTabs from "@/components/custom/sandbox/layout/SandboxTabs";
import { ScreenSizeDialog } from "@/components/custom/sandbox/mobile/screenSizeDialog";
import Sidebar from "@/components/custom/sandbox/navbars/Sidebar";
import Topbar from "@/components/custom/sandbox/navbars/Topbar";
import Api from "@/components/custom/sandbox/tabs/Api";
import Events from "@/components/custom/sandbox/tabs/Event";
import Html from "@/components/custom/sandbox/tabs/Html";
import Script from "@/components/custom/sandbox/tabs/Script";
import StateData from "@/components/custom/sandbox/tabs/StateData";
import Style from "@/components/custom/sandbox/tabs/Style";
import Loading from "@/components/custom/utils/Loading";
import { useFormula } from "@/hooks/useFormula";
import { useView } from "@/hooks/useView";
import { formulaActions } from "@/store/reducers";
import type { RootState } from "@/store/store";
import { useParams, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";

interface SectionType {
  section: "Client" | "Server" | "Webhooks";
}

const {
  updatePaymentMethodsRequest,
  updatePaymentsRequest,
  updatePaymentsDetailsRequest,
} = formulaActions;

const Page: any = () => {
  const [section, setSection] = useState<SectionType["section"]>("Server");
  const { theme, defaultMerchantAccount, merchantAccount, view } = useSelector(
    (state: RootState) => state.user
  );
  const { variant } = useParams<{
    variant: string;
  }>();
  const searchParams = useSearchParams();
  const viewParam = searchParams.get("view");
  const { formulaLoading, formulaError, formulaSuccess } = useFormula(
    variant,
    view
  );

  const { run, unsavedChanges, request, checkoutAPIVersion } =
    useSelector((state: RootState) => state.formula);
  useView(viewParam);

  const { paymentMethods, payments, paymentsDetails } = request;
  const paymentMethodsMerchantAccount = {
    merchantAccount: `${defaultMerchantAccount}`,
  };
  const {
    paymentMethods: paymentMethodsAPIVersion,
    payments: paymentsAPIVersion,
    paymentsDetails: paymentsDetailsAPIVersion,
  } = checkoutAPIVersion;

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
      content: <ManageAdvanceComponent key={run ? "run" : "default"} />,
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
      content: <StateData theme={theme} />,
      value: "state",
    },
  ];
  if (section === "Client") {
    tabsMap = [
      {
        title: "checkout.js",
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
  } else if (section === "Server") {
    tabsMap = [
      {
        title: `/v${paymentMethodsAPIVersion}/paymentMethods`,
        icon: (
          <span className="font-semibold px-1 text-xxs text-adyen">
            {"POST"}
          </span>
        ),
        content: (
          <Api
            api="paymentMethods"
            schema="PaymentMethodsRequest"
            request={paymentMethods}
            updateRequest={updatePaymentMethodsRequest}
          />
        ),
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
        content: (
          <Api
            api="payments"
            schema="PaymentRequest"
            request={payments}
            updateRequest={updatePaymentsRequest}
          />
        ),
        value: "payments",
        unsavedChanges: unsavedChanges.payments,
      },
      {
        title: `/v${paymentsDetailsAPIVersion}/payment/details`,
        icon: (
          <span className="font-semibold px-1 text-xxs text-adyen">
            {"POST"}
          </span>
        ),
        content: (
          <Api
            api="paymentsDetails"
            schema="PaymentDetailsRequest"
            request={paymentsDetails}
            updateRequest={updatePaymentsDetailsRequest}
          />
        ),
        value: "paymentsDetails",
        unsavedChanges: unsavedChanges.paymentsDetails,
      },
    ];
    crumbs = ["advanced", variant, "server"];
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
    crumbs = ["advanced", variant];
  }

  return (
    <div className={`${theme} border-r-2`}>
      <React.Fragment>
        <header>
          <Topbar view={view} merchantAccount={merchantAccount} />
        </header>
        <main>
          <Sandbox
            main={
              formulaLoading || merchantAccount === null ? (
                <Loading className="text-foreground" />
              ) : formulaError ? (
                <div className="text-error p-4">
                  Error loading formula: {formulaError}
                </div>
              ) : !formulaSuccess ? (
                <div className="text-warning p-4">Formula not loaded</div>
              ) : (
                <SandBoxTabs key={section} tabsMap={tabsMap} crumbs={crumbs} />
              )
            }
            topRight={
              formulaLoading || merchantAccount === null ? (
                <Loading className="text-foreground" />
              ) : formulaError ? (
                <div className="text-error p-4">
                  Error loading formula: {formulaError}
                </div>
              ) : !formulaSuccess ? (
                <div className="text-warning p-4">Formula not loaded</div>
              ) : (
                <SandBoxTabs tabsMap={topRightTabsMap} />
              )
            }
            bottomRight={
              formulaLoading || merchantAccount === null ? (
                <Loading className="text-foreground" />
              ) : formulaError ? (
                <div className="text-error p-4">
                  Error loading formula: {formulaError}
                </div>
              ) : !formulaSuccess ? (
                <div className="text-warning p-4">Formula not loaded</div>
              ) : (
                <SandBoxTabs tabsMap={bottomRightTabsMap} />
              )
            }
            view={view}
            key={view}
          />
        </main>
        <footer>
          <Sidebar
            section={section}
            setSection={setSection}
            unsavedChanges={unsavedChanges}
            paymentMethodsMerchantAccount={paymentMethodsMerchantAccount}
            variant={variant}
            view={view}
          />
        </footer>
      </React.Fragment>
      <ScreenSizeDialog />
    </div>
  );
};

export default Page;
