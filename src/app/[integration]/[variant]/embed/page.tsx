"use client";

import { ManageAdvanceComponent } from "@/components/custom/adyen/advanced/ManageAdvanceComponent";
import { ManageAdyenSessions } from "@/components/custom/adyen/sessions/ManageAdyenSessions";
import Loading from "@/components/custom/utils/Loading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFormula } from "@/hooks/useFormula";
import { useStyle } from "@/hooks/useStyle";
import { useView } from "@/hooks/useView";
import { formulaActions, userActions } from "@/store/reducers";
import type { RootState } from "@/store/store";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Page: any = () => {
  const { theme, view } = useSelector((state: RootState) => state.user);
  const { integration, variant } = useParams<{
    integration: string;
    variant: string;
  }>();
  const searchParams = useSearchParams();
  const viewParam = searchParams.get("view");
  const merchantAccount = searchParams.get("merchantAccount");
  const { formulaLoading, formulaError, formulaSuccess } = useFormula(
    variant,
    view,
    integration
  );
  const {
    updateApiRequestMerchantAccount,
    updateBuildMerchantAccount,
    updateReset,
  } = formulaActions;
  const { updateMerchantAccount } = userActions;
  const { run, style } = useSelector((state: RootState) => state.formula);
  const dispatch = useDispatch();

  useView(viewParam);
  useEffect(() => {
    if (merchantAccount) {
      dispatch(updateApiRequestMerchantAccount(merchantAccount));
      dispatch(updateMerchantAccount(merchantAccount));
      dispatch(updateReset());
    }
  }, [merchantAccount]);

  const {
    loading: styleLoading,
    error: styleError,
    success: styleSuccess,
  } = useStyle(variant, style);

  return (
    <div className={`${theme} embed-iframe`}>
      <React.Fragment>
        <main className="h-[100vh] w-[100vw] bg-transparent">
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
            <ManageAdvanceComponent key={run ? "run" : "default"} variant={variant} />
          ) : (
            <ManageAdyenSessions key={run ? "run" : "default"} variant={variant} />
          )}
        </main>
      </React.Fragment>
    </div>
  );
};

export default Page;
