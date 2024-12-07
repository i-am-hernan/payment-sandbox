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
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import CheckIcon from "@mui/icons-material/Check";
import { cn } from "@/lib/utils";

const ShareableButton = (props: any) => {
  const [copied, setCopied] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  const { disabled } = props;
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
    const requestBody = JSON.stringify({
      configuration: processedRequest,
      txVariant: variant,
      integrationType: "advance",
    });

    setFormula({ ...formula, loading: true });
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/formula`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
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
  // when you close the dialog box update the copied back to false
  const handleClose = () => {
    setCopied(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowCheck(true);
      setTimeout(() => {
        setShowCheck(false);
      }, 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div ref={containerRef}>
      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            handleClose();
          }
        }}
      >
        <DialogTrigger asChild>
          <Button
            key="clear"
            variant="outline"
            disabled={disabled}
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
                <div className="border-border border border-r-none rounded rounded-r-none border-foreground">
                  <p className="!h-[100%] max-w-[350px] flex items-center justify-center flex-1 text-xs px-1 py-0 text-foreground whitespace-nowrap overflow-scroll">
                    {`${process.env.NEXT_PUBLIC_API_URL}/advance/${variant}?id=${data._id}`}
                  </p>
                </div>
                <div className="justify-start">
                  <Button
                    className="h-[100%] py-4 text-xs text-background w-10 rounded-tl-none rounded-bl-none rounded-br-2 rounded-tr-2 relative overflow-hidden "
                    onClick={handleCopy}
                    key="reset"
                    variant="outline"
                    size="sm"
                  >
                    <div className="absolute inset-0">
                      <div
                        className={cn(
                          "absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-in-out",
                          showCheck
                            ? "transform -translate-y-full"
                            : "transform translate-y-0"
                        )}
                      >
                        <ContentCopyIcon className="!text-foreground !text-[16px]" />
                      </div>
                      <div
                        className={cn(
                          "absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-in-out",
                          showCheck
                            ? "transform translate-y-0"
                            : "transform translate-y-full"
                        )}
                      >
                        <CheckIcon className="!text-foreground !text-[16px]" />
                      </div>
                    </div>
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
