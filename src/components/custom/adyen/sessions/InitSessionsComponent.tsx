"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdyenSessions } from "@/hooks/useAdyenSessions";
import { useApi } from "@/hooks/useApi";
import { useRef } from "react";

export const InitSessionsComponent = (props: any) => {
  const {
    checkoutAPIVersion,
    checkoutConfiguration,
    variant,
    txVariantConfiguration,
    sessionsRequest,
  } = props;

  const {
    data: sessionsResponse,
    loading: loadingSessions,
    error: sessionError,
  } = useApi(
    `api/checkout/v${checkoutAPIVersion.sessions}/sessions`,
    "POST",
    sessionsRequest
  );

  const checkoutRef = useRef(null);
  // need to update state with the paymentMethodsResponse, but just pull paymentResponse for now

  const { result: adyenResult, error: adyenSDKError }: any = useAdyenSessions(
    variant,
    checkoutAPIVersion,
    checkoutConfiguration,
    txVariantConfiguration,
    sessionsResponse,
    checkoutRef
  );

  const error =
    adyenSDKError || sessionError
      ? { ...adyenSDKError, ...sessionError }
      : null;
  console.log("sessionsRequest", sessionsRequest);
  return (
    <div className="flex justify-center items-center min-h-screen">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>{`Error: ${error.errorCode} ${error.errorType}`}</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      {adyenResult && (
        <Alert variant="default" className="border-primary">
          <AlertTitle>{adyenResult.resultCode}</AlertTitle>
        </Alert>
      )}
      {loadingSessions && (
        <Skeleton className="w-[100px] h-[20px] rounded-full" />
      )}
      {!adyenSDKError && !adyenResult && !loadingSessions && (
        <div className="!max-w-[45vw]">
          <div className="px-auto" ref={checkoutRef}></div>
        </div>
      )}
    </div>
  );
};
