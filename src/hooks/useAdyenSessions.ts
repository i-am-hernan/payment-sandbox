import { useEffect, useState } from "react";

interface AdyenSessionsHook {
  error: object | null;
  result: object | null;
}

export const useAdyenSessions = (
  txVariant: string,
  checkoutAPIVersion: {
    sessions: string;
  },
  checkoutConfiguration: any,
  txVariantConfiguration: any,
  sessionsResponse: any,
  checkoutRef: any,
  onChange: any,
  readyToMount: boolean
): AdyenSessionsHook => {
  const [error, setError] = useState<object | null>(null);
  const [result, setResult] = useState<object | null>(null);
  // console.log("adyenWebVersion:: useAdyenSessions", adyenWebVersion);
  useEffect(() => {
    const handlePaymentCompleted = (result: any, component: any) => {
      setResult(result);
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

    const executeConfiguration = new Function(
      "handlePaymentCompleted",
      "handleError",
      "handleChange",
      `return ${checkoutConfiguration}`
    )(handlePaymentCompleted, handleError, handleChange);

    let configuration: any = {
      ...executeConfiguration,
    };

    if (readyToMount) {
      adyenV5(configuration, checkoutRef, txVariant, txVariantConfiguration);
    }

  }, [
    txVariant,
    txVariantConfiguration,
    sessionsResponse,
    checkoutAPIVersion,
    checkoutConfiguration,
    checkoutRef,
  ]);

  return { error, result };
};
