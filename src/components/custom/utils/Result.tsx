"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PendingIcon from "@mui/icons-material/Pending";

interface AdyenResult {
  resultCode: string;
  pspReference: string;
  refusalReason?: string;
}

const Result = ({ adyenResult }: { adyenResult: AdyenResult }) => {
  return (
    <div className="h-[100%] w-[100%] max-w-[40vw] p-2">
      <Alert variant="default" className="border-primary px-3 flex">
        <div className="flex items-center">
          {adyenResult.resultCode === "Authorised" ? (
            <CheckCircleOutlineIcon className="text-adyen" />
          ) : adyenResult.resultCode === "Refused" ? (
            <ErrorOutlineIcon className="text-warning" />
          ) : (
            <PendingIcon className="text-adyen" />
          )}
        </div>
        <div className="flex-1 flex flex-col pl-1">
          <AlertTitle>{adyenResult.resultCode}</AlertTitle>
          <AlertDescription className="text-xs">{`PSP Reference: ${adyenResult.pspReference}`}</AlertDescription>
          {adyenResult.resultCode === "Refused" &&
            adyenResult.refusalReason && (
              <AlertDescription className="text-xs">{`Reason: ${adyenResult.refusalReason}`}</AlertDescription>
            )}
        </div>
      </Alert>
    </div>
  );
};

export default Result;
