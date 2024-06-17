"use client";

import { useApi } from "@/hooks/useApi";
import { useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdyenAdvance } from "@/hooks/useAdyenAdvance";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// import { ReactComponent as AdyenIdkIcon } from "@/assets/adyen-idk-icon.svg"

export const InitAdvanceComponent = (props: any) => {
  const {
    checkoutConfiguration,
    checkoutAPIVersion,
    variant,
    txVariantConfiguration,
    paymentMethodsRequest,
    paymentsRequest,
    paymentsDetailsRequest
  } = props;

  const {
    data: paymentMethodsResponse,
    loading: loadingPaymentMethods,
    error: paymentMethodsError,
  } = useApi(
    `api/checkout/v${checkoutAPIVersion}/paymentMethods`,
    "POST",
    paymentMethodsRequest
  );

  const checkoutRef = useRef(null);
  // need to update state with the paymentMethodsResponse, but just pull paymentResponse for now

  const { result: adyenResult, error: adyenSDKError } = useAdyenAdvance(
    variant,
    checkoutAPIVersion,
    checkoutConfiguration,
    txVariantConfiguration,
    paymentMethodsResponse,
    paymentsRequest,
    paymentsDetailsRequest,
    checkoutRef
  );

  return (
    <div>
      {(paymentMethodsError || adyenSDKError) && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Your session has expired. Please log in again.
          </AlertDescription>
        </Alert>
      )}
      {adyenResult && (
        <Alert>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Your session has expired. Please log in again.
          </AlertDescription>
        </Alert>
      )}
      {loadingPaymentMethods ? (
        <Skeleton className="w-[100px] h-[20px] rounded-full" />
      ) : (
        <div id="checkout" ref={checkoutRef}></div>
      )}
    </div>
  );
};
