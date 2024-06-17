import { useEffect, useState } from "react";

interface AdyenAdvanceHook {
  error: string | null;
  result: object | null;
}

export const useAdyenAdvance = (
  variant: string,
  checkoutAPIVersion: string,
  checkoutConfiguration: any,
  txVariantConfiguration: any,
  paymentMethodsResponse: any,
  paymentsRequest: any,
  paymentsDetailsRequest: any,
  checkoutRef: any,
): AdyenAdvanceHook => {
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<object | null>(null);

  useEffect(() => {
    let configuration: any = {
      ...checkoutConfiguration,
      paymentMethodsResponse: paymentMethodsResponse,
      onError: (error: any) => {
        setError(JSON.stringify(error));
      },
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
              ...state.data,
            }),
          }
        );
        const paymentResponse = await response.json();
        if (paymentResponse.action) {
          dropin.handleAction(paymentResponse.action);
        } else {
          // handle payment success
          setResult(paymentResponse);
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
        setError(JSON.stringify(error));
      }
    }
  }, [
    variant,
    checkoutRef,
    txVariantConfiguration,
    paymentMethodsResponse,
    paymentsRequest,
    checkoutAPIVersion,
    checkoutConfiguration,
    checkoutRef
  ]);

  return { error, result };
};
