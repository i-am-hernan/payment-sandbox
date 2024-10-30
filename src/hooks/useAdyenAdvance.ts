import { useEffect, useState } from "react";

interface AdyenAdvanceHook {
  error: object | null;
  result: object | null;
}

export const useAdyenAdvance = (
  txVariant: string,
  checkoutAPIVersion: {
    paymentMethods: string;
    payments: string;
    paymentDetails: string;
  },
  checkoutConfiguration: any,
  txVariantConfiguration: any,
  paymentMethodsResponse: any,
  paymentsRequest: any,
  paymentsDetailsRequest: any,
  checkoutRef: any
): AdyenAdvanceHook => {
  const [error, setError] = useState<object | null>(null);
  const [result, setResult] = useState<object | null>(null);

  useEffect(() => {
    const handleSubmit = async (state: any, dropin: any) => {
      const response = await fetch(
        `/api/checkout/v${checkoutAPIVersion.payments}/payments`,
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
      if (paymentResponse.status >= 400) {
        setError(paymentResponse);
      } else if (paymentResponse.action) {
        dropin.handleAction(paymentResponse.action);
      } else {
        setResult(paymentResponse);
      }
    };

    const handleAdditionalDetails = async (state: any, dropin: any) => {
      const response = await fetch(
        `/api/checkout/v${checkoutAPIVersion.paymentDetails}/payments/details`,
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
      const paymentDetailsResponse = await response.json();
      if (paymentDetailsResponse.statusCode >= 400) {
        setError(paymentDetailsResponse);
      } else if (paymentDetailsResponse.action) {
        dropin.handleAction(paymentDetailsResponse.action);
      } else {
        setResult(paymentDetailsResponse);
      }
    };
    const handleError = (error: any) => {
      setError(error);
    };

    // Execute the string as JavaScript
    const executeConfiguration = new Function(
      "handleSubmit",
      "handleAdditionalDetails",
      "handleError",
      `return ${checkoutConfiguration}`
    )(handleSubmit, handleAdditionalDetails, handleError);

    let configuration: any = {
      ...executeConfiguration,
      paymentMethodsResponse: paymentMethodsResponse,
    };
    // console.log("checkoutConfiguration", checkoutConfiguration);
    try {
      const initCheckout: any = async () => {
        const checkout = await (window as any).AdyenCheckout(configuration);
        const component = checkout
          .create(txVariant, {
            ...txVariantConfiguration,
          })
          .mount(checkoutRef.current);
      };
      if (checkoutRef.current) {
        initCheckout();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error);
      }
    }
  }, [
    txVariant,
    txVariantConfiguration,
    paymentMethodsResponse,
    paymentsRequest,
    paymentsDetailsRequest,
    checkoutAPIVersion,
    checkoutConfiguration,
    checkoutRef,
  ]);

  return { error, result };
};
