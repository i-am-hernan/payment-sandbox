"use client";

import { ManageAdvanceComponent } from "@/components/custom/adyen/advanced/ManageAdvanceComponent";
import { ManageAdyenSessions } from "@/components/custom/adyen/sessions/ManageAdyenSessions";
import Sandbox from "@/components/custom/sandbox/layout/Sandbox";
import SandBoxTabs from "@/components/custom/sandbox/layout/SandboxTabs";
import { ScreenSizeDialog } from "@/components/custom/sandbox/mobile/screenSizeDialog";
import Sidebar from "@/components/custom/sandbox/navbars/Sidebar";
import Topbar from "@/components/custom/sandbox/navbars/Topbar";
import Api from "@/components/custom/sandbox/tabs/Api";
import Sdk from "@/components/custom/sandbox/tabs/Sdk";
import StateData from "@/components/custom/sandbox/tabs/StateData";
import Style from "@/components/custom/sandbox/tabs/Style";
import Loading from "@/components/custom/utils/Loading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFormula } from "@/hooks/useFormula";
import useMerchantInCookie from "@/hooks/useMerchantInCookie";
import { useStyle } from "@/hooks/useStyle";
import { useView } from "@/hooks/useView";
import { formulaActions, userActions } from "@/store/reducers";
import type { RootState } from "@/store/store";
import { useParams, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CheckoutPage from "@/components/custom/checkout/CheckoutPage";
import Network from "@/components/custom/sandbox/tabs/Network";
import Features from "@/components/custom/sandbox/tabs/Features";

interface SectionType {
  section: "Client" | "Style";
}

const {
  updatePaymentMethodsRequest,
  updatePaymentsRequest,
  updatePaymentsDetailsRequest,
  updateSessionsRequest,
  updateCheckoutConfiguration,
  updateTxVariantConfiguration,
  updateStyle,
  updateApiRequestMerchantAccount,
  updateBuildMerchantAccount,
  updateReset,
} = formulaActions;

const { updateMerchantAccount } = userActions;
const integration: string = "advance";
const variant: string = "dropin";

const Page: any = () => {
  const [section, setSection] = useState<SectionType["section"]>("Client");
  const { theme, defaultMerchantAccount, merchantAccount, view, logs } = useSelector(
    (state: RootState) => state.user
  );

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
  useView("subwindow");

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

  const dispatch = useDispatch();

  useMerchantInCookie(defaultMerchantAccount, (merchantAccount: string) => {
    dispatch(updateApiRequestMerchantAccount(merchantAccount));
    dispatch(updateBuildMerchantAccount(merchantAccount));
    dispatch(updateMerchantAccount(merchantAccount));
    dispatch(updateReset());
  });
  console.log("checkoutConfiguration", checkoutConfiguration)
  console.log("txVariantConfiguration", txVariantConfiguration)
  let tabsMap: any = [];
  let topRightTabsMap = [
    {
      title: `${variant}`,
      icon: (
        <span className="font-semibold px-1 text-xxs text-adyen">
          {"PREVIEW"}
        </span>
      ),
      content: (
        <CheckoutPage>
          <ManageAdvanceComponent key={run ? "run" : "default"} variant={variant} />
        </CheckoutPage>
      ),
      value: variant,
    },
  ]
  if (section === "Client") {
    tabsMap = [
      {
        title: "checkout",
        icon: (
          <span className="font-semibold px-1 text-xxs text-info">{"FEATURES"}</span>
        ),
        content: (
          <Features
            checkoutConfiguration={checkoutConfiguration}
            updateCheckoutConfiguration={updateCheckoutConfiguration}
            txVariantConfiguration={txVariantConfiguration}
            updateTxVariantConfiguration={updateTxVariantConfiguration}
            variant={variant}
            theme={theme}
            integration={integration}
            view={view}
            description="Create a configuration object for Checkout"
          />
        ),
        value: `checkout`,
        unsavedChanges: unsavedChanges.checkout,
      }
    ];
  } else if (section === "Style") {
    tabsMap = [
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
    ];
  }

  return (
    <div className={`${theme} border-r-2 border-border bg-dotted-grid bg-grid bg-background`}>
      <React.Fragment>
        <header>
          <Topbar
            view={view}
            merchantAccount={merchantAccount}
            integration={integration}
            variant={variant}
          />
        </header>
        <main>
          <Sandbox
            main={
              formulaLoading || merchantAccount === null ? (
                <Loading className="text-foreground hidden" />
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
                <SandBoxTabs key={section} tabsMap={tabsMap} />
              )
            }
            topRight={
              formulaLoading || merchantAccount === null ? (
                <Loading className="text-foreground hidden" />
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
            view={view}
            logs={logs}
          />
        </main>
        <footer className="h-[100%]">
          <Sidebar
            section={section}
            sections={["Client", "Style"]}
            setSection={setSection}
            unsavedChanges={unsavedChanges}
            merchantAccount={merchantAccount}
            variant={variant}
            view={view}
            integration={integration}
            logs={logs}
          />
        </footer>
      </React.Fragment>
      <ScreenSizeDialog />
    </div>
  );
};

export default Page;
