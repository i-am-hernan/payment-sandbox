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
  checkoutRef: any
): AdyenSessionsHook => {
  const [error, setError] = useState<object | null>(null);
  const [result, setResult] = useState<object | null>(null);

  useEffect(() => {
    let configuration: any = {
      ...checkoutConfiguration,
      session: sessionsResponse,
      showPayButton: true,
      onPaymentCompleted: (result: any, component: any) => {
        console.log(result);
        //TODO: handle the result
        setResult(result);
        console.log("-------PAYMENT COMPLETED WITH SESSIONS------");
      },
      onPaymentFailed: (error: any, component: any) => {
        console.log(error);
        //TODO: handle the error
        setError(error);
        console.log("-------UH OH .. PAYMENT FAILED----");
      },
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
  }, [txVariant, txVariantConfiguration, sessionsResponse, checkoutAPIVersion, checkoutConfiguration, checkoutRef]);

  return { error, result };
};
