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
  onChange: any
): AdyenSessionsHook => {
  const [error, setError] = useState<object | null>(null);
  const [result, setResult] = useState<object | null>(null);

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

    const executeConfiguration = new Function(
      "handlePaymentCompleted",
      "handleError",
      "handleChange",
      `return ${checkoutConfiguration}`
    )(handlePaymentCompleted, handleError, handleChange);

    let configuration: any = {
      ...executeConfiguration,
      session: sessionsResponse,
    };
    try {
      const initCheckout: any = async () => {
        const checkout = await (window as any).AdyenCheckout(configuration);
        const component = checkout.create(txVariant).mount(checkoutRef.current);
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
    checkoutAPIVersion,
    checkoutConfiguration,
    checkoutRef,
  ]);

  return { error, result };
};
