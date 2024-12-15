"use client";

import { ManageAdvanceComponent } from "@/components/custom/adyen/advanced/ManageAdvanceComponent";
import { ManageAdyenSessions } from "@/components/custom/adyen/sessions/ManageAdyenSessions";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  updateSessionsRequest,
} = formulaActions;

const Page: any = () => {
  const [section, setSection] = useState<SectionType["section"]>("Server");
  const { theme, defaultMerchantAccount, merchantAccount, view } = useSelector(
    (state: RootState) => state.user
  );
  const { integration, variant } = useParams<{
    integration: string;
    variant: string;
  }>();
  const searchParams = useSearchParams();
  const viewParam = searchParams.get("view");
  const { formulaLoading, formulaError, formulaSuccess } = useFormula(
    variant,
    view,
    integration
  );

  const { run, unsavedChanges, request, checkoutAPIVersion } = useSelector(
    (state: RootState) => state.formula
  );
  useView(viewParam);

  const { paymentMethods, payments, paymentsDetails, sessions } = request;

  const {
    paymentMethods: paymentMethodsAPIVersion,
    payments: paymentsAPIVersion,
    paymentsDetails: paymentsDetailsAPIVersion,
    sessions: sessionsAPIVersion,
  } = checkoutAPIVersion;

  let tabsMap: any = [];
  let crumbs: Array<string> = [];
  let topRightTabsMap =
    integration === "advance"
      ? [
          {
            title: `${variant}`,
            icon: (
              <span className="font-semibold px-1 text-xxs text-preview">
                preview
              </span>
            ),
            content: <ManageAdvanceComponent key={run ? "run" : "default"} />,
            value: variant,
          },
        ]
      : integration === "sessions"
        ? [
            {
              title: `${variant}`,
              icon: (
                <span className="font-semibold px-1 text-xxs text-preview">
                  preview
                </span>
              ),
              content: <ManageAdyenSessions key={run ? "run" : "default"} />,
              value: variant,
            },
          ]
        : [];

  let bottomRightTabsMap = [
    {
      title: `${variant} (read-only)`,
      icon: (
        <span className="font-semibold px-1 text-xxs text-info">state</span>
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
          <span className="font-semibold px-1 text-xxs text-js">{"JS"}</span>
        ),
        content: <Script key={"script"} />,
        value: `${variant}.js`,
        unsavedChanges: unsavedChanges.js,
      },
      {
        title: "style.css",
        icon: (
          <span className="font-semibold px-1 text-xxs text-info">{"#"}</span>
        ),
        content: <Style key={"stye"} />,
        value: "style.css",
        unsavedChanges: unsavedChanges.style,
      },
      {
        title: "checkout.html (read-only)",
        icon: (
          <span className="font-semibold px-1 text-xxs text-warning">
            {"</>"}
          </span>
        ),
        content: <Html key={"html"} />,
        value: "checkout.html",
        unsavedChanges: unsavedChanges.html,
      },
    ];
    crumbs = [integration, variant, "client"];
  } else if (section === "Server") {
    tabsMap =
      integration === "advance"
        ? [
            {
              title: `/v${paymentMethodsAPIVersion}/paymentMethods`,
              icon: (
                <span className="font-semibold px-1 text-xxs text-adyen">
                  POST
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
                  POST
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
                  POST
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
          ]
        : integration === "sessions"
          ? [
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
                unsavedChanges: unsavedChanges.sessions,
              },
            ]
          : [];
    crumbs = [integration, variant, "server"];
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
    crumbs = [integration, variant];
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
              ) : integration !== "sessions" && integration !== "advance" ? (
                <Alert variant="destructive" className="w-[50%]">
                  <AlertTitle>{"Error:"}</AlertTitle>
                  <AlertDescription className="text-foreground">
                    {"Integration type not valid"}
                  </AlertDescription>
                </Alert>
              ) : formulaError || !formulaSuccess ? (
                <Alert variant="destructive" className="w-[50%]">
                  <AlertTitle>{"Error:"}</AlertTitle>
                  <AlertDescription className="text-foreground">
                    {formulaError ? formulaError : "Formula unable to load"}
                  </AlertDescription>
                </Alert>
              ) : (
                <SandBoxTabs key={section} tabsMap={tabsMap} crumbs={crumbs} />
              )
            }
            topRight={
              formulaLoading || merchantAccount === null ? (
                <Loading className="text-foreground" />
              ) : integration !== "sessions" && integration !== "advance" ? (
                <Alert variant="destructive" className="w-[50%]">
                  <AlertTitle>{"Error:"}</AlertTitle>
                  <AlertDescription className="text-foreground">
                    {"Integration type not valid"}
                  </AlertDescription>
                </Alert>
              ) : formulaError || !formulaSuccess ? (
                <Alert variant="destructive" className="w-[50%]">
                  <AlertTitle>{"Error:"}</AlertTitle>
                  <AlertDescription className="text-foreground">
                    {formulaError ? formulaError : "Formula unable to load"}
                  </AlertDescription>
                </Alert>
              ) : (
                <SandBoxTabs tabsMap={topRightTabsMap} />
              )
            }
            bottomRight={
              formulaLoading || merchantAccount === null ? (
                <Loading className="text-foreground" />
              ) : integration !== "sessions" && integration !== "advance" ? (
                <Alert variant="destructive" className="w-[50%]">
                  <AlertTitle>{"Error:"}</AlertTitle>
                  <AlertDescription className="text-foreground">
                    {"Integration type not valid"}
                  </AlertDescription>
                </Alert>
              ) : formulaError || !formulaSuccess ? (
                <Alert variant="destructive" className="w-[50%]">
                  <AlertTitle>{"Error:"}</AlertTitle>
                  <AlertDescription className="text-foreground">
                    {formulaError ? formulaError : "Formula unable to load"}
                  </AlertDescription>
                </Alert>
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
            merchantAccount={merchantAccount}
            variant={variant}
            view={view}
            integration={integration}
          />
        </footer>
      </React.Fragment>
      <ScreenSizeDialog />
    </div>
  );
};

export default Page;
