"use client";

import { ManageAdvanceComponent } from "@/components/custom/adyen/advanced/ManageAdvanceComponent";
import Sandbox from "@/components/custom/sandbox/layout/Sandbox";
import SandBoxTabs from "@/components/custom/sandbox/layout/SandboxTabs";
import Sidebar from "@/components/custom/sandbox/navbars/Sidebar";
import Topbar from "@/components/custom/sandbox/navbars/Topbar";
import Api from "@/components/custom/sandbox/tabs/Api";
import Events from "@/components/custom/sandbox/tabs/Event";
import Html from "@/components/custom/sandbox/tabs/Html";
import Script from "@/components/custom/sandbox/tabs/Script";
import StateData from "@/components/custom/sandbox/tabs/StateData";
import Style from "@/components/custom/sandbox/tabs/Style";
import { formulaActions } from "@/store/reducers";
import type { RootState } from "@/store/store";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useApi } from "@/hooks/useApi";

interface SectionType {
  section: "Client" | "Server" | "Webhooks";
}

const {
  updatePaymentMethodsRequest,
  updatePaymentsRequest,
  updatePaymentsDetailsRequest,
  updateFormula,
  updateApiRequestMerchantAccount,
  updateBuildMerchantAccount,
  updateRun,
  updateReset,
  updateVariantReturnUrl,
  updateBuildCheckoutReturnUrls,
} = formulaActions;

const Page: any = () => {
  const [section, setSection] = useState<SectionType["section"]>("Server");
  const { theme } = useSelector((state: RootState) => state.user);
  const { variant } = useParams<{
    variant: string;
  }>();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const {
    data: formula,
    loading: loadingFormula,
    error: formulaError,
  } = useApi(`api/formula${id ? "/" + id : ""}`, "GET");

  const { run, unsavedChanges, request, checkoutAPIVersion } = useSelector(
    (state: RootState) => state.formula
  );

  const { defaultMerchantAccount, merchantAccount } = useSelector(
    (state: RootState) => state.user
  );

  const { paymentMethods, payments, paymentsDetails } = request;

  const paymentMethodsMerchantAccount = {
    merchantAccount: `${defaultMerchantAccount}`,
  };

  const {
    paymentMethods: paymentMethodsAPIVersion,
    payments: paymentsAPIVersion,
    paymentsDetails: paymentsDetailsAPIVersion,
  } = checkoutAPIVersion;

  useEffect(() => {
    const syncFormula = (formula: any) => {
      let { data } = formula;
      let { configuration } = data;
      dispatch(updateFormula({ ...configuration }));
    };
    const updateMerchantAccount = (merchantAccount: string) => {
      dispatch(updateApiRequestMerchantAccount(merchantAccount));
      dispatch(updateBuildMerchantAccount(merchantAccount));
    };
    const updateReturnUrl = (returnUrl: string) => {
      dispatch(updateBuildCheckoutReturnUrls(returnUrl));
      dispatch(updateVariantReturnUrl(returnUrl));
    };

    const syncSandBoxWithFormula = () => {
      dispatch(updateReset());
    };

    const rebuildCheckout = () => {
      dispatch(updateRun());
    };

    if (variant && formula && merchantAccount) {
      const isDefault = id === null ? true : false;
      if (isDefault) {
        // if we get the default configuration, then we set the return url to the default
        updateReturnUrl(
          `${process.env.NEXT_PUBLIC_CLIENT_URL}/advance/${variant}`
        );
      } else if (formula.success) {
        syncFormula(formula);
      }
      // We will never store merchant account in data layer, need to update global state with cookie value
      updateMerchantAccount(merchantAccount);
      syncSandBoxWithFormula();
      rebuildCheckout();
    }
  }, [variant, formula, merchantAccount, id]);

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
    </div>
  );
};

export default Page;
