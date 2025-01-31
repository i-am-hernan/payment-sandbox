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

  const storeToLocalStorage = (data: any) => {
    sessionStorage.setItem("formula", JSON.stringify(data));
  };

  return (
    <span
      className="absolute top-0 left-[var(--sidebar-width)] h-[var(--topbar-width)] border-y-2 stretch flex items-center justify-center px-2"
      style={{ width: `calc(100vw - var(--sidebar-width))` }}
      ref={containerRef}
    >
      <div className="flex items-baseline">
        <div className="flex text-center text-preview pl-[8px] pr-1 text-[0.73rem] rounded-xs">{`${integration.toUpperCase()}`}</div>
        <div className="flex text-center text-[0.9rem] relative w-[max-content]">
          {variantName && (
            <h3 className="flex text-center text-[0.9rem] relative w-[max-content] text-foreground">{`${variantName}`}</h3>
          )}
        </div>
      </div>
      <div className="flex-1 text-center">
        <UpdateMerchantCookie />
      </div>
      <div className="flex justify-end">
        {view !== "demo" && (
          <div className="mr-2">
            <Tooltip title="Developer Tools">
              <span>
                <Button
                  key="developer"
                  variant="ghost"
                  size="sm"
                  className="border-[1px] border-transparent bg-background px-2 hover:border-[1px] hover:border-adyen hover:border-dotted rounded-none"
                  onClick={() => {
                    if (view === "developer") {
                      dispatch(updateView("preview"));
                    } else if (view === "preview") {
                      dispatch(updateView("developer"));
                    }
                    clearUrlParams(["view"]);
                  }}
                >
                  <CodeIcon
                    className={`!text-[16px] ${view === "developer" ? "text-adyen" : "text-foreground"}`}
                  />
                </Button>
              </span>
            </Tooltip>
          </div>
        )}
        {view !== "demo" && (
          <div className="mr-2">
            <ShareableButton
              disabled={totalUnsavedChanges !== 0 || view == "user"}
            />
          </div>
        )}
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
                      className="border-[1px] border-transparent bg-background px-2 hover:border-[1px] hover:border-adyen hover:border-dotted rounded-none"
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
                  className="border-[1px] border-transparent bg-background px-2 hover:border-[1px] hover:border-adyen hover:border-dotted rounded-none"
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
        <span className="absolute top-0 right-0 transform -translate-x-1/4 -translate-y-1/4 bg-background text-xs rounded-full !opacity-100">
          {Object.values(errors).filter((value) => value).length > 0 && (
            <ErrorIcon className="text-warning !text-[16px] !opacity-100" />
          )}
        </span>
        <Tooltip title="Build (⌘ + enter)">
          <span>
            <Button
              key="run"
              variant="default"
              disabled={
                Object.values(errors).filter((value) => value).length > 0
              }
              size="sm"
              className="px-4"
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
