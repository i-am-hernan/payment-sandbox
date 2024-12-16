"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAdyenSessionsRedirect } from "@/hooks/useAdyenSessionsRedirect";
import Loading from "../../utils/Loading";

export const RedirectSessionsComponent = (props: any) => {
  const { redirectResult, sessionId, checkoutConfiguration } = props;
  const { result, error, loading }: any = useAdyenSessionsRedirect(
    checkoutConfiguration,
    sessionId,
    redirectResult
  );

  return (
    <div className="flex justify-center items-center h-[100%]">
      {error && (
        <div className="h-[100%] w-[100%] max-w-[40vw] p-2">
          <Alert variant="destructive">
            <AlertTitle>{`Error: ${error?.errorCode ? error.errorCode : ""} ${error?.errorType ? error.errorType : ""} ${error?.status ? error.status : ""}`}</AlertTitle>
            <AlertDescription className="text-xs">
              {error.message}
            </AlertDescription>
          </Alert>
        </div>
      )}
      {result && (
        <div className="h-[100%] w-[100%] max-w-[40vw] p-2">
          <Alert variant="default" className="border-primary">
            <AlertTitle>{result.resultCode}</AlertTitle>
          </Alert>
        </div>
      )}
      {loading && <Loading className="text-foreground" />}
    </div>
  );
};
