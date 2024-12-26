"use client";

import Error from "@/components/custom/utils/Error";
import Loading from "@/components/custom/utils/Loading";
import Result from "@/components/custom/utils/Result";
import { useAdyenAdvance } from "@/hooks/useAdyenAdvance";
import { useApi } from "@/hooks/useApi";
import { useEffect, useRef, useState } from "react";

export const InitAdvanceComponent = (props: any) => {
  const {
    checkoutConfiguration,
    checkoutAPIVersion,
    adyenWebVersion,
    variant,
    txVariantConfiguration,
    paymentMethodsRequest,
    paymentsRequest,
    paymentsDetailsRequest,
    onPaymentMethodsResponse,
    onChange,
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

  const [readyToMount, setReadyToMount] = useState(false);
  const checkoutRef = useRef(null);

  useEffect(() => {
    if (paymentMethodsResponse && !paymentMethodsError) {
      onPaymentMethodsResponse(paymentMethodsResponse);
      setReadyToMount(true);
    }
  }, [paymentMethodsResponse]);

  const { result: adyenResult, error: adyenSDKError }: any = useAdyenAdvance(
    variant,
    checkoutAPIVersion,
    adyenWebVersion,
    checkoutConfiguration,
    txVariantConfiguration,
    paymentMethodsResponse,
    paymentsRequest,
    paymentsDetailsRequest,
    checkoutRef,
    onChange,
    readyToMount
  );

  const error =
    adyenSDKError || paymentMethodsError
      ? { ...adyenSDKError, ...paymentMethodsError }
      : null;

  return (
    <div className="flex justify-center items-center h-[100%]">
      {error && <Error error={error} />}
      {adyenResult && <Result adyenResult={adyenResult} />}
      {loadingPaymentMethods && <Loading className="text-foreground" />}
      {!adyenSDKError && !adyenResult && !loadingPaymentMethods && (
        <div className="h-[100%] w-[100%] max-w-[40vw] p-2">
          <div className="px-auto !border-red" ref={checkoutRef}></div>
        </div>
      )}
    </div>
  );
};
