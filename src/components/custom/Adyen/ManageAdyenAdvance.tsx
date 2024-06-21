"use client";

import { InitAdvanceComponent } from "@/components/custom/adyen/advanced/InitAdvanceComponent";
import { RedirectAdvanceComponent } from "@/components/custom/adyen/advanced/RedirectAdvanceComponent";
import { Skeleton } from "@/components/ui/skeleton";
import useAdyenScript from "@/hooks/useAdyenScript";
import { adyenVariantActions } from "@/store/reducers";
import type { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "next/navigation";
import { currentFormulaActions } from "@/store/reducers";

const { updateIsRedirect, updateRedirectResult } = currentFormulaActions;

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
    redirectResult
  } = useSelector((state: RootState) => state.currentFormula);

  const { error: adyenScriptError, loading: loadingAdyenScript } =
    useAdyenScript(adyenWebVersion);
  const dispatch = useDispatch();
  const { variant } = useParams<{
    variant: string;
  }>();
  const searchParams = useSearchParams();
  const redirectResultQueryParameter = searchParams.get('redirectResult');

  if (redirectResultQueryParameter && !isRedirect) {
    dispatch(updateIsRedirect(true));
    //need to remove query path parameters without refreshing
    dispatch(updateRedirectResult(redirectResultQueryParameter));
    console.log('redirectResultQueryParameter',redirectResultQueryParameter);
  }

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
        <InitAdvanceComponent
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

      {isRedirect && redirectResult && (
        <RedirectAdvanceComponent redirectResult={redirectResult} />
      )}
    </div>
  );
};
