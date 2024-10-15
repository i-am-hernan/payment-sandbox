"use client";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { componentActions, formulaActions } from "@/store/reducers";
import useAdyenScript from "@/hooks/useAdyenScript";
import { useParams, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { InitSessionsComponent } from "./InitSessionsComponent";
import { RedirectSessionsComponent } from "./RedirectSessionsComponent";
import { useEffect } from "react";

const { updateIsRedirect, updateRedirectResult, updateSessionId } =
  formulaActions;
const { updateComponentState } = componentActions;

export const ManageAdyenSessions = (props: any) => {
  const { build, isRedirect, redirectResult, sessionId } = useSelector(
    (state: RootState) => state.formula
  );

  const {
    checkoutConfiguration,
    checkoutAPIVersion,
    adyenWebVersion,
    txVariantConfiguration,
    request,
  } = build;

  const { sessions } = request;

  const { error: adyenScriptError, loading: loadingAdyenScript } =
    useAdyenScript(adyenWebVersion);

  const dispatch = useDispatch();
  const { variant } = useParams<{
    variant: string;
  }>();
  const searchParams = useSearchParams();
  const redirectResultQueryParameter = searchParams.get("redirectResult");
  const sessionIdQueryParameter = searchParams.get("sessionId");

  useEffect(() => {
    if (redirectResultQueryParameter && !isRedirect) {
      dispatch(updateIsRedirect(true));
      //need to remove query path parameters without refreshing
      dispatch(updateRedirectResult(redirectResultQueryParameter));
      dispatch(updateSessionId(sessionIdQueryParameter));
    }
  }, [redirectResultQueryParameter, isRedirect]);

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
      {/* Non Redirect Handler */}
      {!isRedirect && (
        <InitSessionsComponent
          checkoutAPIVersion={checkoutAPIVersion}
          checkoutConfiguration={{
            ...checkoutConfiguration,
            onChange: (state: any) => {
              dispatch(updateComponentState(state));
            },
          }}
          variant={variant}
          txVariantConfiguration={txVariantConfiguration}
          sessionsRequest={sessions}
        />
      )}

      {/*  Redirect Handler */}
      {isRedirect && redirectResult && sessionId && (
        <RedirectSessionsComponent
          checkoutAPIVersion={checkoutAPIVersion}
          checkoutConfiguration={{
            ...checkoutConfiguration,
            onChange: (state: any) => {
              dispatch(updateComponentState(state));
            },
          }}
          variant={variant}
          redirectResult={redirectResult}
          sessionId={sessionId}
        />
      )}
    </div>
  );
};
