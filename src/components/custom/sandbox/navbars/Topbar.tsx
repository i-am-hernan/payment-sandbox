"use client";

import UpdateMerchantCookie from "@/components/custom/adyen/account/UpdateMerchantCookie";
import ShareableButton from "@/components/custom/sandbox/share/ShareableButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { formulaActions, specsActions, userActions } from "@/store/reducers";
import { RootState } from "@/store/store";
import { clearUrlParams, refineFormula } from "@/utils/utils";
import CodeIcon from "@mui/icons-material/Code";
import ErrorIcon from "@mui/icons-material/Error";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import RestoreIcon from "@mui/icons-material/Restore";
import Tooltip from "@mui/material/Tooltip";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const {
  updateRun,
  updateReset,
  resetFormula,
  updateIsRedirect,
  clearOnDeckInfo,
  resetUnsavedChanges,
  updateApiRequestMerchantAccount,
  updateBuildMerchantAccount,
} = formulaActions;
const { updateSpecs } = specsActions;
const { updateView } = userActions;

const Topbar = (props: any) => {
  const storeFormula = useSelector((state: RootState) => state.formula);
  const { variantName } = useSelector((state: RootState) => state.sandbox);
  const { view, merchantAccount, integration } = props;
  const { unsavedChanges, errors } = storeFormula;
  const dispatch = useDispatch();
  const totalUnsavedChanges = Object.values(unsavedChanges).filter(
    (value) => value
  ).length;

  const containerRef = useRef<HTMLSpanElement>(null);
  const tabErrors = Object.keys(errors).filter((key) => errors[key]);

  const storeToLocalStorage = (data: any) => {
    sessionStorage.setItem("formula", JSON.stringify(data));
  };
  console.log("tabErrors", tabErrors);
  return (
    <span
      className="bg-card absolute top-0 left-[var(--sidebar-width)] h-[var(--topbar-width)] border-y-[1px] border-r-[1px] border-border stretch flex items-center justify-end px-2"
      style={{ width: `calc(100vw - var(--sidebar-width))` }}
      ref={containerRef}
    >
      <div className="flex justify-end">
        {view !== "demo" && (
          <div className="mr-2">
            <AlertDialog>
              <Tooltip title="Reset (⌘ + delete)">
                <AlertDialogTrigger asChild>
                  <span>
                    <Button
                      key="reset"
                      disabled={view === "user"}
                      variant="ghost"
                      size="sm"
                      className="rounded-md"
                    >
                      <RestartAltIcon className="!text-foreground !text-[16px]" />
                    </Button>
                  </span>
                </AlertDialogTrigger>
              </Tooltip>
              <AlertDialogPortal container={containerRef.current}>
                <AlertDialogOverlay />
                <AlertDialogContent className="text-foreground">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-xs">
                      This action will permanently delete your configuration and
                      reset back to the components base configuration. This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        dispatch(resetFormula());
                        dispatch(
                          updateApiRequestMerchantAccount(merchantAccount)
                        );
                        dispatch(updateBuildMerchantAccount(merchantAccount));
                        dispatch(updateReset());
                        clearUrlParams([
                          "redirectResult",
                          "paRes",
                          "MD",
                          "sessionId",
                          "sessionData",
                        ]);
                        dispatch(
                          updateSpecs({
                            style: null,
                          })
                        );
                      }}
                    >
                      Reset
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogPortal>
            </AlertDialog>
          </div>
        )}
        {view !== "demo" && (
          <div className="mr-2 relative">
            <span className="absolute top-0 right-0 transform -translate-x-1/2 -translate-y-1/2 bg-background text-foreground text-xs rounded-full">
              {totalUnsavedChanges !== 0 && totalUnsavedChanges}
            </span>
            <Tooltip title="Last Build (⌘ + b)">
              <span>
                <Button
                  key="clear"
                  variant="ghost"
                  size="sm"
                  className="rounded-md"
                  disabled={totalUnsavedChanges === 0}
                  onClick={() => {
                    dispatch(clearOnDeckInfo());
                    dispatch(updateReset());
                  }}
                >
                  <RestoreIcon className="!text-foreground !text-[16px]" />
                </Button>
              </span>
            </Tooltip>
          </div>
        )}
        {view !== "demo" && (
          <div className="mr-2">
            <ShareableButton
              disabled={totalUnsavedChanges !== 0 || tabErrors.length > 0}
            />
          </div>
        )}
        <span className="absolute top-0 right-0 z-10 transform -translate-x-1/4 -translate-y-1/4 bg-background text-xs rounded-full">
          {Object.values(errors).filter((value) => value).length > 0 && (
            <ErrorIcon className="text-warning !text-[16px]" />
          )}
        </span>
        <Tooltip
          title={`${tabErrors.length > 0 ? `Resolve ${tabErrors.join(", ")} error` : "Build (⌘ + enter)"}`}
        >
          <span>
            <Button
              key="run"
              variant="outline"
              disabled={tabErrors.length > 0}
              size="sm"
              className="px-4 border-adyen bg-adyen text-[#fff] hover:text-adyen hover:bg-background hover:border-adyen hover:border-1"
              onClick={() => {
                storeToLocalStorage(refineFormula(storeFormula));
                clearUrlParams([
                  "redirectResult",
                  "paRes",
                  "MD",
                  "sessionId",
                  "sessionData",
                ]);
                dispatch(updateIsRedirect(false));
                dispatch(updateRun());
                dispatch(resetUnsavedChanges());
              }}
            >
              Build
            </Button>
          </span>
        </Tooltip>
      </div>
    </span>
  );
};

export default Topbar;
