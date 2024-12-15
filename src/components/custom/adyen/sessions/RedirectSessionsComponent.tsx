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
        <Alert variant="destructive">
          <AlertTitle>{`Error: ${error.errorCode} ${error.errorType}`}</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      {result && (
        <Alert variant="default" className="border-primary">
          <AlertTitle>{result.resultCode}</AlertTitle>
        </Alert>
      )}
      {loading && <Loading className="text-foreground" />}
    </div>
  );
};
