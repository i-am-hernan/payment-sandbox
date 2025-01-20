"use client";

import { ManageAdvanceComponent } from "@/components/custom/adyen/advanced/ManageAdvanceComponent";
import { ManageAdyenSessions } from "@/components/custom/adyen/sessions/ManageAdyenSessions";
import Loading from "@/components/custom/utils/Loading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFormula } from "@/hooks/useFormula";
import { useView } from "@/hooks/useView";
import type { RootState } from "@/store/store";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
import UpdateMerchantCookie from "@/components/custom/adyen/account/UpdateMerchantCookie";
import { useStyle } from "@/hooks/useStyle";

const Page: any = () => {
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

  const { run, style } = useSelector((state: RootState) => state.formula);
  useView(viewParam);

  const {
    loading: styleLoading,
    error: styleError,
    success: styleSuccess,
  } = useStyle(variant, style);

  return (
    <div className={`${theme}`}>
      <React.Fragment>
        <main className="h-[100vh] w-[100vw]">
          <UpdateMerchantCookie showTrigger={false} />
          {formulaLoading || merchantAccount === null ? (
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
          ) : integration === "advance" ? (
            <ManageAdvanceComponent key={run ? "run" : "default"} />
          ) : (
            <ManageAdyenSessions key={run ? "run" : "default"} />
          )}
        </main>
      </React.Fragment>
    </div>
  );
};

export default Page;
