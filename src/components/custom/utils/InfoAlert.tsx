"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import InfoIcon from "@mui/icons-material/Info";


const InfoAlert = ({ message }: { message: string }) => {
  return (
    <div className="h-[100%] w-[100%] max-w-[40vw]">
      <Alert variant="default" className="flex py-[8px] px-[3px] rounded-[4px]">
        <div className="flex items-center pl-2">
          <InfoIcon className="text-info text-[22px]" />
          <AlertDescription className="text-xs pl-1">{message}</AlertDescription>
        </div>
      </Alert>
    </div>
  );
};

export default InfoAlert;
