"use client";

import { AdvanceComponent } from "@/components/custom/adyen/advanced/AdvanceComponent";
import { AdvanceRedirectComponent } from "@/components/custom/adyen/advanced/AdvanceRedirectComponent";
import { Skeleton } from "@/components/ui/skeleton";
import useAdyenScript from "@/hooks/useAdyenScript";
import type { RootState } from "@/store/store";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { adyenVariantActions } from "@/store/reducers";
import { useDispatch } from "react-redux";

const { updateVariantState } = adyenVariantActions;

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
  const { error: adyenScriptError, loading: loadingAdyenScript } =
    useAdyenScript(adyenWebVersion);

  const dispatch = useDispatch();  
  if (!variant) return null;

  if (loadingAdyenScript || !variant) {
    return (
      <div className="flex flex-col space-y-3 items-center m-4">
        <Skeleton className="h-[180px] w-[250px] rounded-xl bg-border" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-[250px] bg-border" />
          <Skeleton className="h-7 w-[250px] bg-border" />
        </div>
      </div>
    );
  }

  if (adyenScriptError) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {!isRedirect && (
        <AdvanceComponent
          checkoutAPIVersion={checkoutAPIVersion}
          checkoutConfiguration={{
            ...checkoutConfiguration,
            onChange: (state: any) => {
              dispatch(updateVariantState(state));
            },
          }}
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
