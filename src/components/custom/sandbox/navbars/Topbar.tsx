import UpdateMerchantCookie from "@/components/custom/adyen/account/UpdateMerchantCookie";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { formulaActions } from "@/store/reducers";
import { RootState } from "@/store/store";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import RestoreIcon from "@mui/icons-material/Restore";
import Tooltip from "@mui/material/Tooltip";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const {
  updateRun,
  updateReset,
  resetFormula,
  updateIsRedirect,
  clearOnDeckInfo,
  resetUnsavedChanges,
} = formulaActions;

const Topbar = (props: any) => {
  const { unsavedChanges } = useSelector((state: RootState) => state.formula);
  const dispatch = useDispatch();
  const totalUnsavedChanges = Object.values(unsavedChanges).filter(
    (value) => value
  ).length;

  const resetButtonRef = useRef<HTMLButtonElement>(null);
  const clearButtonRef = useRef<HTMLButtonElement>(null);
  const runButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "b") {
        event.preventDefault();
        if (clearButtonRef.current) {
          clearButtonRef.current.click();
        }
      } else if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        if (runButtonRef.current) {
          runButtonRef.current.click();
        }
      } else if (
        ((event.ctrlKey || event.metaKey) && event.key === "Backspace") ||
        event.key === "Delete"
      ) {
        event.preventDefault();
        if (resetButtonRef.current) {
          resetButtonRef.current.click();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <span
      className="absolute top-0 left-[var(--sidebar-width)] h-[var(--topbar-width)] border-b-2 flex items-center justify-end pr-2"
      style={{ width: `calc(100vw - var(--sidebar-width))` }}
    >
      <div className="flex-1 text-center">
        <UpdateMerchantCookie />
      </div>
      <div className="mr-2 relative">
        <AlertDialog>
          <Tooltip title="Reset (⌘ + delete)">
            <AlertDialogTrigger asChild>
              <Button
                key="reset"
                variant="outline"
                size="sm"
                className="px-2 pt-0 pb-0"
                ref={resetButtonRef}
              >
                <RestartAltIcon sx={{ fontSize: "16px" }} />
              </Button>
            </AlertDialogTrigger>
          </Tooltip>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-xs">
                This action will permanently delete your configuration and reset
                back to the component's base configuration. This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  dispatch(resetFormula());
                  dispatch(updateReset(true));
                }}
              >
                Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="mr-2 relative">
        <span className="absolute top-0 right-0 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black text-xs rounded-full">
          {totalUnsavedChanges !== 0 && totalUnsavedChanges}
        </span>
        <Tooltip title="Last Build (⌘ + b)">
          <Button
            key="clear"
            variant="outline"
            size="sm"
            className="px-2 pt-0 pb-0"
            onClick={() => {
              dispatch(clearOnDeckInfo());
              dispatch(updateReset(true));
            }}
            ref={clearButtonRef}
          >
            <RestoreIcon sx={{ fontSize: "16px" }} />
          </Button>
        </Tooltip>
      </div>
      <Tooltip title="Build (⌘ + enter)">
        <Button
          key="run"
          variant="default"
          size="sm"
          className="px-4"
          onClick={() => {
            const clearRedirectInfo = () => {
              window.history.replaceState(
                {},
                document.title,
                window.location.pathname
              );
            };
            clearRedirectInfo();
            dispatch(updateIsRedirect(false));
            dispatch(updateRun());
            dispatch(resetUnsavedChanges());
          }}
          ref={runButtonRef}
        >
          Build
        </Button>
      </Tooltip>
    </span>
  );
};

export default Topbar;
