import { useEffect, useState } from "react";

interface AdyenSessionsHook {
  error: object | null;
  result: object | null;
  loading: boolean;
}

export const useAdyenSessionsRedirect = (
  checkoutConfiguration: any,
  sessionId: string,
  redirectResult: string
): AdyenSessionsHook => {
  const [error, setError] = useState<object | null>(null);
  const [result, setResult] = useState<object | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let configuration: any = {
      ...checkoutConfiguration,
      session: {
        id: sessionId,
      },
      onPaymentCompleted: async (result: any, component: any) => {
        setLoading(false);
        setResult(result);
      },
    };

    try {
      const initCheckout: any = async () => {
        const checkout = await (window as any).AdyenCheckout(configuration);
        console.log(redirectResult);
        checkout.submitDetails({ details: { redirectResult: redirectResult } });
      };
      initCheckout();
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      }
    }

    //TODO: Why do we want useEffect dependency on every change of the following values
  }, [redirectResult, sessionId]);

  return { error, result, loading };
};
