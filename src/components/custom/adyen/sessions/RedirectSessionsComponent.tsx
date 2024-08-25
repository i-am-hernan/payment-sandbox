"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useAdyenAdvanceRedirect } from "@/hooks/useAdyenAdvanceRedirect";
import { useRef } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAdyenSessionsRedirect } from "@/hooks/useAdyenSessionsRedirect";

// import { ReactComponent as AdyenIdkIcon } from "@/assets/adyen-idk-icon.svg"

export const RedirectSessionsComponent = (props: any) => {
  const { redirectResult, sessionId, checkoutConfiguration } = props;

  //   const { result, error, loading }: any = useAdyenAdvanceRedirect(
  //     variant,
  //     checkoutAPIVersion,
  //     redirectResult
  //   );

  //TODO: Should we load DropIn again as the docs here suggest instead of just simply showing the redirectResult and sessionId?
  // https://docs.adyen.com/online-payments/build-your-integration/sessions-flow/?platform=Web&integration=Drop-in&version=5.67.1#handle-the-redirect
  const { result, error, loading }: any = useAdyenSessionsRedirect(checkoutConfiguration, sessionId, redirectResult);

  console.log(result);
  console.log(error);
  console.log(loading);

  return (
    <div>
      RedirectResult:
      {redirectResult}
      <br></br>
      SessionId:
      {sessionId}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>{`Error: ${error.errorCode} ${error.errorType}`}</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      {result && (
        <Alert variant="default" className="border-primary">
          <AlertTitle>{result.resultCode}</AlertTitle>
          {/* TODO: PSP Reference is not returned in Sessions Flow */}
        </Alert>
      )}
      {loading && (
        <div className="flex flex-col space-y-3 items-center m-4">
          <Skeleton className="h-[180px] w-[250px] rounded-xl bg-border" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-[250px] bg-border" />
            <Skeleton className="h-7 w-[250px] bg-border" />
          </div>
        </div>
      )}
    </div>
  );
};
