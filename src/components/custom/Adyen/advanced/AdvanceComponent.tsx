"use client";

import { useApi } from "@/hooks/useApi";
import { useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// import { ReactComponent as AdyenIdkIcon } from "@/assets/adyen-idk-icon.svg"

export const AdvanceComponent = (props: any) => {
  const {
    checkoutConfiguration,
    checkoutAPIVersion,
    variant,
    txVariantConfiguration,
    paymentMethodsRequest,
    paymentsRequest,
    paymentsDetailsRequest,
  } = props;

  const {
    data,
    loading: loadingAPI,
    error: adyenApiError,
  } = useApi(
    `/api/checkout/v${checkoutAPIVersion}/paymentMethods`,
    "POST",
    paymentMethodsRequest
  );

  const checkoutRef = useRef(null);
  // need to update state with the paymentMethodsResponse, but just pull paymentResponse for now

  useEffect(() => {
    let configuration: any = {
      ...checkoutConfiguration,
      paymentMethodsResponse: data,
      onAdditionalDetails: async (state: any, dropin: any) => {
        const response = await fetch(
          `/api/checkout/v${checkoutAPIVersion}/payments/details`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...paymentsDetailsRequest,
              details: state.data.details,
            }),
          }
        );
        const paymentResponse = await response.json();
        if (paymentResponse.action) {
          dropin.handleAction(paymentResponse.action);
        } else {
          // handle payment success
        }
      },
      onSubmit: async (state: any, dropin: any) => {
        const response = await fetch(
          `/api/checkout/v${checkoutAPIVersion}/payments`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...paymentsRequest,
              paymentMethod: state.data.paymentMethod,
            }),
          }
        );
        const paymentResponse = await response.json();
        if (paymentResponse.action) {
          dropin.handleAction(paymentResponse.action);
        } else {
          // handle payment success
        }
      },
    };
    try {
      const initCheckout: any = async () => {
        const checkout = await (window as any).AdyenCheckout(configuration);
        const component = checkout
          .create(variant, {
            ...txVariantConfiguration,
          })
          .mount(checkoutRef.current);
      };
      if (checkoutRef.current) {
        initCheckout();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      }
    }
  }, [
    variant,
    checkoutRef,
    txVariantConfiguration,
    data,
    paymentsRequest,
    checkoutAPIVersion,
    checkoutConfiguration,
  ]);

  return (
    <div>
      {loadingAPI ? (
        <Skeleton className="w-[100px] h-[20px] rounded-full" />
      ) : (
        <div id="checkout" ref={checkoutRef}></div>
      )}
      {adyenApiError && <div>Error...</div>}
    </div>
  );
};
