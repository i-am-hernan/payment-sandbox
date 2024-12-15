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
  adyenWebVersion: string,
  checkoutConfiguration: any,
  txVariantConfiguration: any,
  paymentMethodsResponse: any,
  paymentsRequest: any,
  paymentsDetailsRequest: any,
  checkoutRef: any,
  onChange: any,
  readyToMount: boolean
): AdyenAdvanceHook => {
  const [error, setError] = useState<object | null>(null);
  const [result, setResult] = useState<object | null>(null);

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

  const handleChange = (state: any) => {
    onChange(state);
  };

  const adyenV5 = (
    configuration: any,
    checkoutRef: any,
    txVariant: string,
    txVariantConfiguration: any
  ) => {
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
  };

  useEffect(() => {
    const executeConfiguration = new Function(
      "handleSubmit",
      "handleAdditionalDetails",
      "handleError",
      "handleChange",
      `return ${checkoutConfiguration}`
    )(handleSubmit, handleAdditionalDetails, handleError, handleChange);

    let configuration: any = {
      ...executeConfiguration,
    };

    if (readyToMount) {
      if (/^5./.test(adyenWebVersion)) {
        adyenV5(configuration, checkoutRef, txVariant, txVariantConfiguration);
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
    readyToMount,
    adyenWebVersion,
  ]);

  return { error, result };
};
