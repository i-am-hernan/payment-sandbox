"use client";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { componentActions, formulaActions } from "@/store/reducers";
import useAdyenScript from "@/hooks/useAdyenScript";
import { useParams, useSearchParams } from "next/navigation";
import { InitSessionsComponent } from "./InitSessionsComponent";
import { RedirectSessionsComponent } from "./RedirectSessionsComponent";
import { useEffect } from "react";
import Loading from "../../utils/Loading";

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
    return <Loading />;
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
