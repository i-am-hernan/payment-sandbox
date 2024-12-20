import { sandboxActions } from "@/store/reducers";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface AdyenAdvanceHook {
  error: object | null;
  result: object | null;
  loading: boolean;
}

export const useAdyenAdvanceRedirect = (
  variant: string,
  checkoutAPIVersion: {
    paymentMethods: string;
    payments: string;
    paymentsDetails: string;
  },
  paymentsDetailsRequest: any,
  redirectResult: any
): AdyenAdvanceHook => {
  const [error, setError] = useState<object | null>(null);
  const [result, setResult] = useState<object | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  const { updateNetworkResponse } = sandboxActions;

  useEffect(() => {
    let onAdditionalDetails = async () => {
      const response = await fetch(`/api/checkout/v${checkoutAPIVersion.paymentsDetails}/payment/details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          details: { redirectResult: redirectResult },
          ...paymentsDetailsRequest,
        }),
      });
      const paymentDetailsResponse = await response.json();
      dispatch(updateNetworkResponse(paymentDetailsResponse));

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
  }, [variant, paymentsDetailsRequest]);

  return { error, result, loading };
};
