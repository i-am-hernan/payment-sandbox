import Loading from "@/components/custom/utils/Loading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RootState } from "@/store/store";
import { refineFormula } from "@/utils/utils";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/Share";
import Tooltip from "@mui/material/Tooltip";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";

const ShareableButton = () => {
  const { variant } = useParams<{
    variant: string;
  }>();
  const state = useSelector((state: RootState) => state.formula);
  const containerRef = useRef(null);
  const [formula, setFormula] = useState<any>({
    data: null,
    loading: false,
    error: null,
  });
  const { data, loading, error } = formula;
  const handleShare = (request: any) => {
    const processedRequest = refineFormula(request);
    setFormula({ ...formula, loading: true });
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/formula`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        configuration: { ...processedRequest },
        txVariant: variant,
        integrationType: "advance",
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        const { data } = response;
        setFormula({ data, loading: false, error: null });
      })
      .catch((error) => {
        console.error("Error:", error);
        setFormula({ data: null, loading: false, error });
      });
  };

  return (
    <div ref={containerRef}>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            key="clear"
            variant="outline"
            size="sm"
            className="px-2 pt-0 pb-0"
            onClick={() => {
              handleShare(state);
            }}
          >
            <ShareIcon className="!text-foreground !text-[16px]" />
          </Button>
        </DialogTrigger>
        <DialogPortal container={containerRef.current}>
          <DialogOverlay />
          <DialogContent className="sm:max-w-[425px] flex flex-col text-foreground">
            <DialogHeader>
              <DialogTitle className="text-[16px] text-foreground">
                Share your build
              </DialogTitle>
              <DialogDescription className="text-[13px]">
                You can share your build by copying the link below
              </DialogDescription>
            </DialogHeader>
            {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
            {loading && <Loading />}
            {data && !loading && !error && (
              <div className="flex items-stretch">
                <div className="border border-r-none rounded rounded-r-none border-foreground">
                  <p className="!h-[100%] max-w-[350px] flex items-center justify-center flex-1 text-xs px-1 py-0 text-foreground whitespace-nowrap overflow-scroll">
                    {`${process.env.NEXT_PUBLIC_API_URL}/advance/${variant}?id=${data._id}`}
                  </p>
                </div>
                <div className="justify-start">
                  <Button
                    className="p-2 rounded-l-none text-xs  text-background"
                    key="reset"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${process.env.NEXT_PUBLIC_API_URL}/advance/${variant}?id=${data._id}`
                      );
                    }}
                  >
                    {
                      <ContentCopyIcon className="!text-foreground !text-[16px] pt-0 rounded-l-none" />
                    }
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
};

export default ShareableButton;
