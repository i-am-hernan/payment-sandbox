import { useEffect, useState } from "react";

interface AdyenSessionsHook {
  error: object | null;
  result: object | null;
}

export const useAdyenSessions = (
  txVariant: string,
  checkoutAPIVersion: string,
  checkoutConfiguration: any,
  txVariantConfiguration: any,
  sessionsResponse: any,
  //   paymentMethodsResponse: any,
  //   paymentsRequest: any,
  //   paymentsDetailsRequest: any,
  checkoutRef: any
): AdyenSessionsHook => {
  const [error, setError] = useState<object | null>(null);
  const [result, setResult] = useState<object | null>(null);

  useEffect(() => {
    let configuration: any = {
      ...checkoutConfiguration,
      session: sessionsResponse,
      amount: 1000,
      countryCode: "US", // TODO: Load this from somewhere
      locale: "en-US",
      //   paymentMethodsResponse: paymentMethodsResponse,
      //   onError: (error: any) => {
      //     setError(error);
      //   },
      //   onAdditionalDetails: async (state: any, dropin: any) => {
      //     const response = await fetch(`/api/checkout/v${checkoutAPIVersion}/payments/details`, {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify({
      //         ...paymentsDetailsRequest,
      //         details: state.data.details,
      //       }),
      //     });
      //     const paymentDetailsResponse = await response.json();
      //     if (paymentDetailsResponse.statusCode >= 400) {
      //       setError(paymentDetailsResponse);
      //     } else if (paymentDetailsResponse.action) {
      //       dropin.handleAction(paymentDetailsResponse.action);
      //     } else {
      //       setResult(paymentDetailsResponse);
      //     }
      //   },
      //   onSubmit: async (state: any, dropin: any) => {
      //     const response = await fetch(`/api/checkout/v${checkoutAPIVersion}/payments`, {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify({
      //         ...paymentsRequest,
      //         ...state.data,
      //       }),
      //     });
      //     const paymentResponse = await response.json();
      //     if (paymentResponse.status >= 400) {
      //       setError(paymentResponse);
      //     } else if (paymentResponse.action) {
      //       dropin.handleAction(paymentResponse.action);
      //     } else {
      //       setResult(paymentResponse);
      //     }
      //   },
      onPaymentCompleted: (result: any, component: any) => {
        console.log("-------PAYMENT COMPLETED WITH SESSIONS======");
      },
      onPaymentFailed: (result: any, component: any) => {
        console.log("-------UH OH .. PAYMENT FAILED----");
      },
    };
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
    sessionsResponse,
    // paymentMethodsResponse,
    // paymentsRequest,
    // paymentsDetailsRequest,
    checkoutAPIVersion,
    checkoutConfiguration,
    checkoutRef,
  ]);

  return { error, result };
};
