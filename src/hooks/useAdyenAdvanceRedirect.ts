import { useEffect, useState } from "react";

interface AdyenAdvanceHook {
  error: object | null;
  result: object | null;
  loading: boolean;
}

export const useAdyenAdvanceRedirect = (
  variant: string,
  checkoutAPIVersion: string,
  paymentsDetailsRequest: any,
  redirectResult: any
): AdyenAdvanceHook => {
  const [error, setError] = useState<object | null>(null);
  const [result, setResult] = useState<object | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    let onAdditionalDetails = async () => {
      const response = await fetch(
        `/api/checkout/v${checkoutAPIVersion}/payment/details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            details: { redirectResult: redirectResult },
            ...paymentsDetailsRequest,
          }),
        }
      );
      const paymentDetailsResponse = await response.json();
      if (paymentDetailsResponse.statusCode >= 400) {
        setError(paymentDetailsResponse);
      } else {
        setLoading(false);
        setResult(paymentDetailsResponse);
      }
    };

    try {
      if (checkoutAPIVersion && redirectResult) {
        onAdditionalDetails();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error);
      }
    }
  }, [variant, paymentsDetailsRequest, checkoutAPIVersion]);

  return { error, result, loading };
};
