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
import { Input } from "@/components/ui/input";
import { bookmarkletCode } from "@/utils/bookmarklet";

const ShareableButton = (props: any) => {
  const [copied, setCopied] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [buildInfo, setBuildInfo] = useState<any>({
    title: null,
    description: null,
  });
  const [share, setShare] = useState(false);
  const [view, setView] = useState("preview");
  const { disabled } = props;
  const { variant, integration } = useParams<{
    variant: string;
    integration: string;
  }>();
  const state = useSelector((state: RootState) => state.formula);
  const containerRef = useRef(null);
  const [formula, setFormula] = useState<any>({
    data: null,
    loading: false,
    error: null,
  });
  const { data, loading, error } = formula;
  const { title, description } = buildInfo;
  const handleShare = (request: any) => {
    const processedRequest = refineFormula(request);
    const requestBody = JSON.stringify({
      configuration: processedRequest,
      txVariant: variant,
      integrationType: integration,
      title,
      description,
    });

    setFormula({ ...formula, loading: true });
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/formula/${integration}`, {
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
    setShare(false);
    setBuildInfo({ title: "", description: "" });
  };

  const handleCopy = async () => {
    try {
      const url =
        view === "embed"
          ? `${process.env.NEXT_PUBLIC_API_URL}/${integration}/${variant}/embed?id=${data._id}`
          : `${process.env.NEXT_PUBLIC_API_URL}/${integration}/${variant}?id=${data._id}&view=${view}`;
      await navigator.clipboard.writeText(url);
      setShowCheck(true);
      setTimeout(() => {
        setShowCheck(false);
      }, 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Create bookmarklet URL
  const createBookmarkletUrl = () => {
    const encodedCode = encodeURIComponent(bookmarkletCode);
    return `javascript:${encodedCode}`;
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
            variant="ghost"
            disabled={disabled}
            size="sm"
            className="border-[1px] border-transparent bg-background px-2 hover:border-[1px] hover:border-adyen hover:border-dotted rounded-none"
            onClick={() => {
              // handleShare(state);
            }}
          >
            <ShareIcon className="!text-foreground !text-[16px]" />
          </Button>
        </DialogTrigger>
        <DialogPortal container={containerRef.current}>
          <DialogOverlay />
          {!share && (
            <DialogContent className="p-5 sm:max-w-[425px] flex flex-col text-foreground">
              <DialogHeader>
                <DialogTitle className="text-[16px] text-foreground">
                  Create a shareable link
                </DialogTitle>
                <DialogDescription className="text-[13px]">
                  You can create a shareable link by providing a title and
                  description
                </DialogDescription>
                <form
                  className="flex flex-col"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setShare(true);
                    handleShare(state);
                  }}
                >
                  <label className="text-[13px] pt-2 pb-1">Title</label>
                  <Input
                    value={title ? title : ""}
                    required
                    onChange={(e) =>
                      setBuildInfo({ ...buildInfo, title: e.target.value })
                    }
                  />
                  <label className="text-[13px] pt-2 pb-1">Description</label>
                  <Input
                    value={description ? description : ""}
                    required
                    onChange={(e) =>
                      setBuildInfo({
                        ...buildInfo,
                        description: e.target.value,
                      })
                    }
                  />
                  <Button
                    type="submit"
                    className="mt-3 w-[30%] self-end"
                    disabled={!title || !description}
                  >
                    Create
                  </Button>
                </form>
              </DialogHeader>
            </DialogContent>
          )}
          {share && (
            <DialogContent className="p-5 sm:max-w-[425px] flex flex-col text-foreground">
              <DialogHeader>
                <DialogTitle className="text-[16px] text-foreground">
                  {view === "preview"
                    ? "Share "
                    : view === "demo"
                      ? "Demo "
                      : "Embed "}
                  your build
                </DialogTitle>
                <DialogDescription className="text-[13px]">
                  You can share your build by copying the link below
                </DialogDescription>
              </DialogHeader>
              {error && (
                <div className="text-red-500 text-xs mb-2">{error}</div>
              )}
              {loading && <Loading />}
              {data && !loading && !error && (
                <div className="flex items-center justify-start border-b border-border">
                  <Button
                    className={`h-[1.5rem] shadow-none border-l-0 border-r-0 border-t-0 ${view === "preview" ? "border-b-2" : "border-b-0"} border-adyen rounded-tl-none rounded-tr-none rounded-br-none rounded-bl-none overflow-hidden`}
                    onClick={() => setView("preview")}
                    key="reset"
                    variant="outline"
                    size="sm"
                  >
                    <span className="text-foreground text-xs">share</span>
                  </Button>
                  <Button
                    className={`h-[1.5rem] shadow-none border-l-0 border-r-0 border-t-0 ${view === "demo" ? "border-b-2" : "border-b-0"} border-adyen rounded-tl-none rounded-tr-none rounded-br-none rounded-bl-none overflow-hidden`}
                    onClick={() => setView("demo")}
                    key="reset"
                    variant="outline"
                    size="sm"
                  >
                    <span className="text-foreground text-xs">demo</span>
                  </Button>
                  <Button
                    className={`h-[1.5rem] shadow-none border-l-0 border-r-0 border-t-0 ${view === "embed" ? "border-b-2" : "border-b-0"} border-adyen rounded-tl-none rounded-tr-none rounded-br-none rounded-bl-none overflow-hidden`}
                    onClick={() => setView("embed")}
                    key="reset"
                    variant="outline"
                    size="sm"
                  >
                    <span className="text-foreground text-xs">embed</span>
                  </Button>
                </div>
              )}
              {data && !loading && !error && (
                <div className="flex items-stretch">
                  <div className="border-border border border-r-none rounded rounded-r-none">
                    <p className="!h-[100%] max-w-[350px] flex items-center justify-center flex-1 text-xs px-1 py-0 text-foreground whitespace-nowrap overflow-scroll">
                      {view !== "embed"
                        ? `${process.env.NEXT_PUBLIC_API_URL}/${integration}/${variant}?id=${data._id}&view=${view}`
                        : `${process.env.NEXT_PUBLIC_API_URL}/${integration}/${variant}/embed?id=${data._id}`}
                    </p>
                  </div>
                  <div className="justify-start">
                    <Button
                      className="h-[100%] py-4 text-xs text-background w-10 rounded-tl-none rounded-bl-none rounded-br-2 rounded-tr-2 relative overflow-hidden border-border"
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
              {view === "embed" && (
                <DialogDescription className="text-[13px]">
                  <div className="pb-1">
                    <p className="inline-block text-foreground">Step 1: </p>{" "}
                    <p className="inline-block">
                      {` Save our `}
                      <a
                        href={createBookmarkletUrl()}
                        className="text-blue-500"
                        onClick={(e) => {
                          e.preventDefault();
                          // Optional: Show instructions to drag to bookmarks
                          alert("Drag this link to your bookmarks bar");
                        }}
                      >
                        checkoutLab
                      </a>{" "}
                      bookmarklet to your browser.
                    </p>
                  </div>
                  <div className="pb-1">
                    <p className="inline-block text-foreground">Step 2:</p>{" "}
                    <p className="inline-block">
                      Navigate to the merchants checkout page
                    </p>
                  </div>
                  <div className="pb-1">
                    <p className="inline-block text-foreground">Step 3:</p>{" "}
                    <p className="inline-block">Click the bookmarklet</p>
                  </div>
                  <div className="pb-1">
                    <p className="inline-block text-foreground">Step 4:</p>{" "}
                    <p className="inline-block">
                      Enter the above url to embed your build
                    </p>
                  </div>
                </DialogDescription>
              )}
            </DialogContent>
          )}
        </DialogPortal>
      </Dialog>
    </div>
  );
};

export default ShareableButton;
