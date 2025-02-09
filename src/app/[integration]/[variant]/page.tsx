"use client";

import { ManageAdvanceComponent } from "@/components/custom/adyen/advanced/ManageAdvanceComponent";
import { ManageAdyenSessions } from "@/components/custom/adyen/sessions/ManageAdyenSessions";
import Sandbox from "@/components/custom/sandbox/layout/Sandbox";
import SandBoxTabs from "@/components/custom/sandbox/layout/SandboxTabs";
import { ScreenSizeDialog } from "@/components/custom/sandbox/mobile/screenSizeDialog";
import FooterBar from "@/components/custom/sandbox/navbars/FooterBar";
import Sidebar from "@/components/custom/sandbox/navbars/Sidebar";
import Topbar from "@/components/custom/sandbox/navbars/Topbar";
import Api from "@/components/custom/sandbox/tabs/Api";
import Html from "@/components/custom/sandbox/tabs/Html";
import SdkTabs from "@/components/custom/sandbox/tabs/SdkTabs";
import StateData from "@/components/custom/sandbox/tabs/StateData";
import Style from "@/components/custom/sandbox/tabs/Style";
import Loading from "@/components/custom/utils/Loading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFormula } from "@/hooks/useFormula";
import { useStyle } from "@/hooks/useStyle";
import { useView } from "@/hooks/useView";
import { formulaActions } from "@/store/reducers";
import type { RootState } from "@/store/store";
import { useParams, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";

interface SectionType {
  section: "Client" | "Server";
}

const {
  updatePaymentMethodsRequest,
  updatePaymentsRequest,
  updatePaymentsDetailsRequest,
  updateSessionsRequest,
  updateCheckoutConfiguration,
  updateTxVariantConfiguration,
  updateStyle,
} = formulaActions;

const Page: any = () => {
  const [section, setSection] = useState<SectionType["section"]>("Server");
  const { theme, merchantAccount, view } = useSelector(
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

  const {
    run,
    unsavedChanges,
    request,
    checkoutAPIVersion,
    checkoutConfiguration,
    txVariantConfiguration,
    style,
  } = useSelector((state: RootState) => state.formula);
  useView(viewParam);

  const { paymentMethods, payments, paymentsDetails, sessions } = request;
  const {
    loading: styleLoading,
    error: styleError,
    success: styleSuccess,
  } = useStyle(variant, style);

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
        title: "checkout",
        icon: (
          <span className="font-semibold px-1 text-xxs text-js">{"JS"}</span>
        ),
        content: (
          <SdkTabs
            sdkMap={{
              checkoutConfiguration: {
                storeConfiguration: checkoutConfiguration,
                updateStoreConfiguration: updateCheckoutConfiguration,
                configurationType: "checkoutConfiguration",
                description: "Create a checkout configuration object for a Web Components integration",
              },
              txVariantConfiguration: {
                storeConfiguration: txVariantConfiguration,
                updateStoreConfiguration: updateTxVariantConfiguration,
                configurationType: "txVariantConfiguration",
                description: `Create a ${variant} configuration object for a Web Components integration`,
              },
            }}
            variant={variant}
            theme={theme}
            integration={integration}
            view={view}
            key={"checkout"}
          />
        ),
        value: `checkout`,
        unsavedChanges: unsavedChanges.js,
      },
      {
        title: "style",
        icon: (
          <span className="font-semibold px-1 text-xxs text-info">{"CSS"}</span>
        ),
        content: (
          <Style
            key={"style"}
            storeConfiguration={style}
            updateStoreConfiguration={updateStyle}
            configurationType="style"
            variant={variant}
            theme={theme}
            integration={integration}
            view={view}
            description={`Customize the style of ${variant}. Inspect the browser console to view all selectors.`}
          />
        ),
        value: "style",
        unsavedChanges: unsavedChanges.style,
      },
      {
        title: "page",
        icon: (
          <span className="font-semibold px-1 text-xxs text-warning">
            {"HTML"}
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
              title: "/paymentMethods",
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
                  description={
                    "Create a /paymentMethods request for a Web Components integration"
                  }
                />
              ),
              value: "paymentmethods",
              unsavedChanges: unsavedChanges.paymentMethods,
            },
            {
              title: "/payments",
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
                  description={
                    "Create a /payments request for a Web Components integration"
                  }
                />
              ),
              value: "payments",
              unsavedChanges: unsavedChanges.payments,
            },
            {
              title: "/payments/details",
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
                  description={
                    "Create a /payment/details request for a Web Components integration"
                  }
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
                    description={"Create a /sessions request"}
                  />
                ),
                value: "sessions",
                unsavedChanges: unsavedChanges.sessions,
              },
            ]
          : [];
    crumbs = [integration, variant, "server"];
  }

  return (
    <div className={`${theme} border-r-2`}>
      <React.Fragment>
        <header>
          <Topbar
            view={view}
            merchantAccount={merchantAccount}
            integration={integration}
          />
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
                <SandBoxTabs tabsMap={bottomRightTabsMap} type="subwindow" />
              )
            }
            view={view}
          />
        </main>
        <footer className="h-[100%]">
          <Sidebar
            section={section}
            setSection={setSection}
            unsavedChanges={unsavedChanges}
            merchantAccount={merchantAccount}
            variant={variant}
            view={view}
            integration={integration}
          />
          <FooterBar integration={integration} />
        </footer>
      </React.Fragment>
      <ScreenSizeDialog />
    </div>
  );
};

export default Page;
