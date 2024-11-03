"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useAdyenAdvance } from "@/hooks/useAdyenAdvance";
import { useApi } from "@/hooks/useApi";
import { useRef, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const InitAdvanceComponent = (props: any) => {
  const {
    checkoutConfiguration,
    checkoutAPIVersion,
    variant,
    txVariantConfiguration,
    paymentMethodsRequest,
    paymentsRequest,
    paymentsDetailsRequest,
    onPaymentMethodsResponse,
  } = props;

  const {
    data: paymentMethodsResponse,
    loading: loadingPaymentMethods,
    error: paymentMethodsError,
  } = useApi(
    `api/checkout/v${checkoutAPIVersion.paymentMethods}/paymentMethods`,
    "POST",
    paymentMethodsRequest
  );

  const checkoutRef = useRef(null);

  useEffect(() => {
    onPaymentMethodsResponse(paymentMethodsResponse);
  }, [paymentMethodsResponse]);

  const { result: adyenResult, error: adyenSDKError }: any = useAdyenAdvance(
    variant,
    checkoutAPIVersion,
    checkoutConfiguration,
    txVariantConfiguration,
    paymentMethodsResponse,
    paymentsRequest,
    paymentsDetailsRequest,
    checkoutRef
  );

  const error =
    adyenSDKError || paymentMethodsError
      ? { ...adyenSDKError, ...paymentMethodsError }
      : null;

  return (
    <div className="flex justify-center items-center">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>{`Error: ${error.errorCode} ${error.errorType}`}</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      {adyenResult && (
        <Alert variant="default" className="border-primary">
          <AlertTitle>{adyenResult.resultCode}</AlertTitle>
          <AlertDescription>{`PSP Reference: ${adyenResult.pspReference}`}</AlertDescription>
        </Alert>
      )}
      {loadingPaymentMethods && (
        <Skeleton className="w-[100px] h-[20px] rounded-full" />
      )}
      {!adyenSDKError && !adyenResult && !loadingPaymentMethods && (
        <div className="!max-w-[45vw]">
          <div className="px-auto !border-red" ref={checkoutRef}></div>
        </div>
      )}
    </div>
  );
};
