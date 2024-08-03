"use client";

import { InitAdvanceComponent } from "@/components/custom/adyen/advanced/InitAdvanceComponent";
import { RedirectAdvanceComponent } from "@/components/custom/adyen/advanced/RedirectAdvanceComponent";
import { Skeleton } from "@/components/ui/skeleton";
import useAdyenScript from "@/hooks/useAdyenScript";
import { adyenVariantActions, formulaActions } from "@/store/reducers";
import type { RootState } from "@/store/store";
import { useParams, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useApi } from "@/hooks/useApi";
import { specsActions } from "@/store/reducers";
import { useEffect } from "react";

const { updateIsRedirect, updateRedirectResult } = formulaActions;
const { updateVariantState } = adyenVariantActions;
const { updateSpecs } = specsActions;

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
  } = useSelector((state: RootState) => state.formula);

  const { error: adyenScriptError, loading: loadingAdyenScript } =
    useAdyenScript(adyenWebVersion);

  const { data: apiSpecsData, error: apiSpecsError } = useApi(
    `api/specs/checkout/CheckoutService-v${checkoutAPIVersion}`,
    "GET"
  );

  const { data: sdkSpecsData, error: sdkSpecsError } = useApi(
    `api/specs/adyen-web/WebComponents-v${adyenWebVersion.replaceAll(".", "_")}`,
    "GET"
  );

  const dispatch = useDispatch();
  const { variant } = useParams<{
    variant: string;
  }>();
  const searchParams = useSearchParams();
  const redirectResultQueryParameter = searchParams.get("redirectResult");

  useEffect(() => {
    if (redirectResultQueryParameter && !isRedirect) {
      dispatch(updateIsRedirect(true));
      dispatch(updateRedirectResult(redirectResultQueryParameter));
    }

    if (sdkSpecsData) {
      dispatch(
        updateSpecs({
          adyenWeb: sdkSpecsData,
        })
      );
    }
    if (apiSpecsData) {
      dispatch(
        updateSpecs({
          checkoutApi: apiSpecsData,
        })
      );
    }
  }, [redirectResultQueryParameter, isRedirect, sdkSpecsData, apiSpecsData]);

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

  if (adyenScriptError || apiSpecsError || sdkSpecsError) {
    return <div>Error</div>;
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
        <RedirectAdvanceComponent
          variant={variant}
          redirectResult={redirectResult}
          checkoutAPIVersion={checkoutAPIVersion}
          paymentsDetailsRequest={paymentsDetailsRequest}
        />
      )}
    </div>
  );
};
