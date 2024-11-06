"use client";

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
import ShareIcon from "@mui/icons-material/Share";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { refineFormula } from "@/utils/utils";
import { useParams } from "next/navigation";

const {
  updateRun,
  updateReset,
  resetFormula,
  updateIsRedirect,
  clearOnDeckInfo,
  resetUnsavedChanges,
} = formulaActions;

const Topbar = (props: any) => {
  const state = useSelector((state: RootState) => state.formula);
  const { unsavedChanges } = state;
  const dispatch = useDispatch();
  const totalUnsavedChanges = Object.values(unsavedChanges).filter(
    (value) => value
  ).length;

  const { variant } = useParams<{
    variant: string;
  }>();

  const handleShare = (exportedConfiguration: any) => {
    fetch("http://localhost:3000/api/formula", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        configuration: { ...exportedConfiguration },
        txVariant: variant,
        integrationType: "advance"

      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <span
      className="absolute top-0 left-[var(--sidebar-width)] h-[var(--topbar-width)] border-y-2 flex items-center justify-end pr-2"
      style={{ width: `calc(100vw - var(--sidebar-width))` }}
    >
      <div className="flex-1 text-center">
        <UpdateMerchantCookie />
      </div>
      <div className="mr-2 relative">
        <span className="pr-2">
          <Tooltip title="Share Build">
            <Button
              key="clear"
              variant="outline"
              size="sm"
              className="px-2 pt-0 pb-0"
              disabled={totalUnsavedChanges !== 0}
              onClick={() => {
                var processedFormula = refineFormula(state);
                handleShare(processedFormula);
              }}
            >
              <ShareIcon className="!text-foreground !text-[16px]" />
            </Button>
          </Tooltip>
        </span>
        <AlertDialog>
          <Tooltip title="Reset (⌘ + delete)">
            <AlertDialogTrigger asChild>
              <Button
                key="reset"
                variant="outline"
                size="sm"
                className="px-2 pt-0 pb-0"
              >
                <RestartAltIcon className="!text-foreground !text-[16px]" />
              </Button>
            </AlertDialogTrigger>
          </Tooltip>
          <AlertDialogContent className="text-foreground">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-xs">
                This action will permanently delete your configuration and reset
                back to the components base configuration. This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  dispatch(resetFormula());
                  dispatch(updateReset());
                }}
              >
                Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="mr-2 relative">
        <span className="absolute top-0 right-0 transform -translate-x-1/2 -translate-y-1/2 bg-background text-foreground text-xs rounded-full">
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
              dispatch(updateReset());
            }}
          >
            <RestoreIcon className="!text-foreground !text-[16px]" />
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
        >
          Build
        </Button>
      </Tooltip>
    </span>
  );
};

export default Topbar;
