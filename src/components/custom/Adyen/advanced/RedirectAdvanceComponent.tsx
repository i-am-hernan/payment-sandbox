"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useAdyenAdvanceRedirect } from "@/hooks/useAdyenAdvanceRedirect";
import { useRef } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// import { ReactComponent as AdyenIdkIcon } from "@/assets/adyen-idk-icon.svg"

export const RedirectAdvanceComponent = (props: any) => {
  const {
    checkoutAPIVersion,
    variant,
    paymentsDetailsRequest,
    redirectResult,
  } = props;

  const { result, error, loading }: any = useAdyenAdvanceRedirect(
    variant,
    checkoutAPIVersion,
    paymentsDetailsRequest,
    redirectResult
  );

  return (
    <div>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>{`Error: ${error.errorCode} ${error.errorType}`}</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      {result && (
        <Alert variant="default" className="border-primary">
          <AlertTitle>{result.resultCode}</AlertTitle>
          <AlertDescription>
            {`PSP Reference: ${result.pspReference}`}
          </AlertDescription>
        </Alert>
      )}
      {loading && <Skeleton className="w-[100px] h-[20px] rounded-full" />}
    </div>
  );
};
