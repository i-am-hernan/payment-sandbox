"use client";

import { InitAdvanceComponent } from "@/components/custom/adyen/advanced/InitAdvanceComponent";
import { RedirectAdvanceComponent } from "@/components/custom/adyen/advanced/RedirectAdvanceComponent";
import { Skeleton } from "@/components/ui/skeleton";
import useAdyenScript from "@/hooks/useAdyenScript";
import {
  componentActions,
  formulaActions,
  specsActions,
} from "@/store/reducers";
import type { RootState } from "@/store/store";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const { updateIsRedirect, updateRedirectResult } = formulaActions;
const { updateComponentState } = componentActions;

export const ManageAdvanceComponent = () => {
  const { build, isRedirect, redirectResult } = useSelector(
    (state: RootState) => state.formula
  );

  const {
    checkoutConfiguration,
    checkoutAPIVersion,
    adyenWebVersion,
    txVariantConfiguration,
    request,
  } = build;
  const { paymentMethods, payments, paymentsDetails } = request;

  const { error: adyenScriptError, loading: loadingAdyenScript } =
    useAdyenScript(adyenWebVersion);

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
  }, [redirectResultQueryParameter, isRedirect]);

  if (loadingAdyenScript || !variant) {
    return (
      <div className="flex flex-col h-[100%] space-y-3 items-center p-2">
        <Skeleton className="h-[100%] w-[100%] rounded-xl bg-border" />
        <Skeleton className="h-7 w-[100%] bg-border" />
        <Skeleton className="h-7 w-[100%] bg-border" />
      </div>
    );
  }

  if (adyenScriptError) {
    // Need to add an error that we are not able to download adyen script or the specs
    return <div>Error</div>;
  }

  return (
    <div className="p-2">
      {!isRedirect && (
        <InitAdvanceComponent
          checkoutAPIVersion={checkoutAPIVersion}
          checkoutConfiguration={{
            ...checkoutConfiguration,
            onChange: (state: any) => {
              dispatch(updateComponentState(state));
            },
          }}
          variant={variant}
          txVariantConfiguration={txVariantConfiguration}
          paymentMethodsRequest={paymentMethods}
          paymentsRequest={payments}
          paymentsDetailsRequest={paymentsDetails}
        />
      )}

      {isRedirect && redirectResult && (
        <RedirectAdvanceComponent
          variant={variant}
          redirectResult={redirectResult}
          checkoutAPIVersion={checkoutAPIVersion}
          paymentsDetailsRequest={paymentsDetails}
        />
      )}
    </div>
  );
};
