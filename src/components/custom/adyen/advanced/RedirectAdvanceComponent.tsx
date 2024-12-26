"use client";

import { useAdyenAdvanceRedirect } from "@/hooks/useAdyenAdvanceRedirect";
import Error from "../../utils/Error";
import Loading from "../../utils/Loading";
import Result from "../../utils/Result";

export const RedirectAdvanceComponent = (props: any) => {
  const {
    checkoutAPIVersion,
    variant,
    paymentsDetailsRequest,
    redirectResult,
  } = props;

  const {
    result: adyenResult,
    error: adyenSDKError,
    loading,
  }: any = useAdyenAdvanceRedirect(
    variant,
    checkoutAPIVersion,
    paymentsDetailsRequest,
    redirectResult
  );

  return (
    <div className="flex justify-center items-center h-[100%]">
      {adyenSDKError && <Error error={adyenSDKError} />}
      {adyenResult && <Result adyenResult={adyenResult} />}
      {loading && <Loading className="text-foreground" />}
    </div>
  );
};
