"use client";

import type { RootState } from "@/store/store";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { AdvanceComponent } from "@/components/custom/adyen/advanced/AdvanceComponent";
import { AdvanceRedirectComponent } from "@/components/custom/adyen/advanced/AdvanceRedirectComponent";

// This should have the logic to pull from global state and to pass it to the corresponding component
// we also need to get the variant from the path
// we also need to understand if this is a redirect
export const AdyenAdvance = () => {
  const { variant } = useParams<{ variant: string }>();

  const {
    checkoutConfiguration,
    checkoutAPIVersion,
    adyenWebVersion,
    txVariantConfiguration,
    paymentMethodsRequest,
    paymentsRequest,
    paymentsDetailsRequest,
  } = useSelector((state: RootState) => state.currentFormula);

  const isRedirect = false;

  if (!variant) return null;

  return (
    <div>
      {!isRedirect && (
        <AdvanceComponent
          checkoutAPIVersion={checkoutAPIVersion}
          adyenWebVersion={adyenWebVersion}
          checkoutConfiguration={checkoutConfiguration}
          variant={variant}
          txVariantConfiguration={txVariantConfiguration}
          paymentMethodsRequest={paymentMethodsRequest}
          paymentsRequest={paymentsRequest}
          paymentsDetailsRequest={paymentsDetailsRequest}
        />
      )}

      {isRedirect && <AdvanceRedirectComponent />}
    </div>
  );
};
