"use client";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { adyenVariantActions } from "@/store/reducers";
import useAdyenScript from "@/hooks/useAdyenScript";
import { useParams, useSearchParams } from "next/navigation";
import { currentFormulaActions } from "@/store/reducers";
import { Skeleton } from "@/components/ui/skeleton";
import { InitSessionsComponent } from "./InitSessionsComponent";

const { updateIsRedirect, updateRedirectResult } = currentFormulaActions;
const { updateVariantState } = adyenVariantActions;

export const ManageAdyenSessions = (props: any) => {
  const {
    checkoutConfiguration,
    checkoutAPIVersion,
    adyenWebVersion,
    txVariantConfiguration,
    sessionsRequest,
    isRedirect,
    redirectResult,
  } = useSelector((state: RootState) => state.currentFormula);

  const { error: adyenScriptError, loading: loadingAdyenScript } = useAdyenScript(adyenWebVersion);
  const dispatch = useDispatch();
  const { variant } = useParams<{
    variant: string;
  }>();
  const searchParams = useSearchParams();
  const redirectResultQueryParameter = searchParams.get("redirectResult");

  if (redirectResultQueryParameter && !isRedirect) {
    dispatch(updateIsRedirect(true));
    //need to remove query path parameters without refreshing
    dispatch(updateRedirectResult(redirectResultQueryParameter));
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
    //TODO: Create Error Component
    return <div>Error...</div>;
  }

  return (
    <div>
      {!isRedirect && (
        <InitSessionsComponent
          checkoutAPIVersion={checkoutAPIVersion}
          checkoutConfiguration={{
            ...checkoutConfiguration,
            onChange: (state: any) => {
              dispatch(updateVariantState(state));
            },
          }}
          variant={variant}
          txVariantConfiguration={txVariantConfiguration}
          sessionsRequest={sessionsRequest}
          //   paymentMethodsRequest={paymentMethodsRequest}
          //   paymentsRequest={paymentsRequest}
          //   paymentsDetailsRequest={paymentsDetailsRequest}
        />
      )}

      {/* {isRedirect && redirectResult && (
        // <RedirectSessionsComponent
        //   variant={variant}
        //   redirectResult={redirectResult}
        //   checkoutAPIVersion={checkoutAPIVersion}
        // //   paymentsDetailsRequest={paymentsDetailsRequest}
        // />
      )} */}
    </div>
  );
};
