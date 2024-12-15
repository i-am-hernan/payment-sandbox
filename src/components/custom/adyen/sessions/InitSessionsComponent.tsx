"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAdyenSessions } from "@/hooks/useAdyenSessions";
import { useApi } from "@/hooks/useApi";
import { useEffect, useRef, useState } from "react";
import Loading from "../../utils/Loading";

export const InitSessionsComponent = (props: any) => {
  const {
    checkoutAPIVersion,
    adyenWebVersion,
    checkoutConfiguration,
    variant,
    txVariantConfiguration,
    sessionsRequest,
    onSessionsResponse,
    onChange,
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
  const [readyToMount, setReadyToMount] = useState(false);
  const checkoutRef = useRef(null);

  useEffect(() => {
    if (sessionsResponse && !sessionError) {
      onSessionsResponse(sessionsResponse);
      setReadyToMount(true);
    }
  }, [sessionsResponse]);

  const { result: adyenResult, error: adyenSDKError }: any = useAdyenSessions(
    variant,
    checkoutAPIVersion,
    checkoutConfiguration,
    txVariantConfiguration,
    sessionsResponse,
    checkoutRef,
    onChange,
    readyToMount,
    adyenWebVersion
  );

  const error =
    adyenSDKError || sessionError
      ? { ...adyenSDKError, ...sessionError }
      : null;
  console.log("adyenWebVersion:: initSessionsComponent", adyenWebVersion);
  return (
    <div className="flex justify-center items-center h-[100%]">
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
      {loadingSessions && <Loading className="text-foreground" />}
      {!adyenSDKError && !adyenResult && !loadingSessions && (
        <div className="h-[100%] w-[100%] max-w-[40vw] p-2">
          <div className="px-auto !border-red" ref={checkoutRef}></div>
        </div>
      )}
    </div>
  );
};
