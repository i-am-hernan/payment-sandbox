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
import React, { Suspense, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CheckoutPage from "@/components/custom/checkout/CheckoutPage";
import Network from "@/components/custom/sandbox/tabs/Network";

interface SectionType {
    section: "Client" | "Server" | "Style";
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

const DemoContent = () => {
    const [section, setSection] = useState<SectionType["section"]>("Server");
    const { theme, defaultMerchantAccount, merchantAccount, view, logs } = useSelector(
        (state: RootState) => state.user
    );
    //   const { integration, variant } = useParams<{
    //     integration: string;
    //     variant: string;
    //   }>();
    const integration: string = "advance";
    const variant: string = "paypal";
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

    const dispatch = useDispatch();

    useMerchantInCookie(defaultMerchantAccount, (merchantAccount: string) => {
        dispatch(updateApiRequestMerchantAccount(merchantAccount));
        dispatch(updateBuildMerchantAccount(merchantAccount));
        dispatch(updateMerchantAccount(merchantAccount));
        dispatch(updateReset());
    });

    console.log("merchantAccount", merchantAccount);
    console.log("formulaLoading", formulaLoading);
    let tabsMap: any = [];
    let crumbs: Array<string> = [];
    let topRightTabsMap =
        integration === "advance"
            ? [
                {
                    title: `${variant}`,
                    icon: (
                        <span className="font-semibold px-1 text-xxs text-adyen">
                            {integration.toUpperCase()}
                        </span>
                    ),
                    content: view === "demo" ? (
                        <CheckoutPage>
                            <ManageAdvanceComponent key={run ? "run" : "default"} />
                        </CheckoutPage>
                    ) : (
                        <ManageAdvanceComponent key={run ? "run" : "default"} />
                    ),
                    value: variant,
                },
            ]
            : integration === "sessions"
                ? [
                    {
                        title: `${variant}`,
                        icon: (
                            <span className="font-semibold px-1 text-xxs text-adyen">
                                {integration.toUpperCase()}
                            </span>
                        ),
                        content: view === "demo" ? (
                            <CheckoutPage>
                                <ManageAdyenSessions key={run ? "run" : "default"} />
                            </CheckoutPage>
                        ) : (
                            <ManageAdyenSessions key={run ? "run" : "default"} />
                        ),
                        value: variant,
                    },
                ]
                : [];

    let bottomRightTabsMap = [
        {
            title: `${variant}`,
            icon: (
                <span className="font-semibold px-1 text-xxs text-info">STATE</span>
            ),
            content: <StateData theme={theme} />,
            value: "state",
        },
        {
            title: `logs`,
            icon: <span className="font-semibold px-1 text-xxs text-info">NETWORK</span>,
            content: <Network theme={theme} />,
            value: "network",
        }
    ];

    if (section === "Client") {
        tabsMap = [
            {
                title: "checkout",
                icon: (
                    <span className="font-semibold px-1 text-xxs text-js">{"JS"}</span>
                ),
                content: (
                    <Sdk
                        storeConfiguration={checkoutConfiguration}
                        updateStoreConfiguration={updateCheckoutConfiguration}
                        configurationType="checkoutConfiguration"
                        variant={variant}
                        theme={theme}
                        integration={integration}
                        view={view}
                        key={"checkout"}
                        description={"Create a configuration object for Checkout"}
                    />
                ),
                value: `checkout`,
                unsavedChanges: unsavedChanges.checkout,
            },
            {
                title: `${variant}`,
                icon: (
                    <span className="font-semibold px-1 text-xxs text-js">{"JS"}</span>
                ),
                content: (
                    <Sdk
                        storeConfiguration={txVariantConfiguration}
                        updateStoreConfiguration={updateTxVariantConfiguration}
                        configurationType="txVariantConfiguration"
                        variant={variant}
                        theme={theme}
                        integration={integration}
                        view={view}
                        key={"variant"}
                        description={`Create a configuration object for ${variant}`}
                    />
                ),
                value: `${variant}`,
                unsavedChanges: unsavedChanges.variant,
            },
        ];
        crumbs = [integration, variant, "sdk"];
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
                                    "Configure the request for the payment methods endpoint"
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
                                    "Configure the request for the payments endpoint"
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
                                    "Configure the request for the payment details endpoint"
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
        crumbs = [integration, variant, "api"];
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
        crumbs = [integration, variant];
    }

    return (
        <div className={`${theme} border-r-2 border-border bg-dotted-grid bg-grid bg-background`}>
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
                                <SandBoxTabs key={section} tabsMap={tabsMap} crumbs={crumbs} />
                            )
                        }
                        topRight={
                            formulaLoading || merchantAccount === null ? (
                                <h1>Loading</h1>
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
                                <SandBoxTabs tabsMap={bottomRightTabsMap} type="subwindow" />
                            )
                        }
                        view={view}
                        logs={logs}
                    />
                </main>
            </React.Fragment>
            <ScreenSizeDialog />
        </div>
    );
};

const Page = () => {
    return (
        <Suspense fallback={<Loading className="text-foreground" />}>
            <DemoContent />
        </Suspense>
    );
};

export default Page;
