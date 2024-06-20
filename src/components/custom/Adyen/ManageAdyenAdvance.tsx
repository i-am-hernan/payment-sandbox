"use client";

import { InitAdvanceComponent } from "@/components/custom/adyen/advanced/InitAdvanceComponent";
import { RedirectAdvanceComponent } from "@/components/custom/adyen/advanced/RedirectAdvanceComponent";
import { Skeleton } from "@/components/ui/skeleton";
import useAdyenScript from "@/hooks/useAdyenScript";
import { adyenVariantActions } from "@/store/reducers";
import type { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";

const { updateVariantState } = adyenVariantActions;

export const ManageAdyenAdvance = () => {
  const {
    checkoutConfiguration,
    checkoutAPIVersion,
    adyenWebVersion,
    txVariantConfiguration,
    paymentMethodsRequest,
    paymentsRequest,
    paymentsDetailsRequest,
    isRedirect,
    redirectResult,
    txVariant,
  } = useSelector((state: RootState) => state.currentFormula);

  const { error: adyenScriptError, loading: loadingAdyenScript } =
    useAdyenScript(adyenWebVersion);

  const dispatch = useDispatch();

  if (loadingAdyenScript || !txVariant) {
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
        <InitAdvanceComponent
          checkoutAPIVersion={checkoutAPIVersion}
          checkoutConfiguration={{
            ...checkoutConfiguration,
            onChange: (state: any) => {
              dispatch(updateVariantState(state));
            },
          }}
          txVariant={txVariant}
          txVariantConfiguration={txVariantConfiguration}
          paymentMethodsRequest={paymentMethodsRequest}
          paymentsRequest={paymentsRequest}
          paymentsDetailsRequest={paymentsDetailsRequest}
        />
      )}

      {isRedirect && redirectResult && (
        <RedirectAdvanceComponent redirectResult={redirectResult} />
      )}
    </div>
  );
};
