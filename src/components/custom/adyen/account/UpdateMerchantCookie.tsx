import Loading from "@/components/custom/utils/Loading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formulaActions, userActions } from "@/store/reducers";
import TuneIcon from "@mui/icons-material/Tune";
import Cookies from "js-cookie";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import CheckIcon from '@mui/icons-material/Check';

const { updateMerchantAccount } = userActions;
const { updateApiRequestMerchantAccount } = formulaActions;

const UpdateMerchantCookie = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New state variable
  const [merchantAccountLocal, setMerchantAccountLocal] = useState(process.env.NEXT_PUBLIC_MERCHANT_ACCOUNT || "");
  const dispatch = useDispatch();
  const { defaultMerchantAccount, merchantAccount } = useSelector(
    (state: RootState) => state.user
  );
  const containerRef = useRef(null);

  useEffect(() => {
    const merchantAccountCookie = Cookies.get("merchantAccount");
    if (!merchantAccountCookie) {
      setOpen(true);
    } else {
      dispatch(updateMerchantAccount(merchantAccountCookie));
      dispatch(updateApiRequestMerchantAccount(merchantAccountCookie));
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/management/merchant/${merchantAccountLocal}`
      );
      if (response.status !== 200) {
        setError("Invalid merchant account. Please try another one.");
        setIsLoading(false); // Set loading state to false
        return;
      }
      Cookies.set("merchantAccount", merchantAccountLocal, { expires: 365 });
      dispatch(updateMerchantAccount(merchantAccountLocal));
      dispatch(updateApiRequestMerchantAccount(merchantAccountLocal));
      setOpen(false);
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={containerRef}>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          if (!open) {
            if (!Cookies.get("merchantAccount")) {
              Cookies.set("merchantAccount", defaultMerchantAccount, {
                expires: 365,
              });
              dispatch(updateMerchantAccount(defaultMerchantAccount));
            }
            setOpen(false);
          }
        }}
      >
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-[50%]"
            onClick={() => {
              setOpen(true);
              setMerchantAccountLocal(
                process.env.NEXT_PUBLIC_MERCHANT_ACCOUNT || ""
              );
              setError("");
            }}
          >
            {merchantAccount && (
              <div>
                <TuneIcon className="!text-foreground !text-[14px]" />
                <p className="px-1 !text-xs !text-foreground inline-block">
                  {merchantAccount}
                </p>
              </div>
            )}
            {!merchantAccount && <Loading className="text-foreground" />}
          </Button>
        </DialogTrigger>
        <DialogPortal container={containerRef.current}>
          <DialogOverlay />
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-[16px] text-foreground">
                Choose a merchant account
              </DialogTitle>
              <DialogDescription className="text-[13px]">
                Enter a merchant account or use the default account.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSave}>
              {error && (
                <p className="text-red-500 text-xs mb-1 text-left">{error}</p>
              )}
              <div className="flex items-center">
                <div className="flex-1">
                  <Label htmlFor="name" className="text-right sr-only">
                    Account
                  </Label>
                  <Input
                    id="name"
                    value={merchantAccountLocal}
                    onChange={(e) => setMerchantAccountLocal(e.target.value)}
                    className="rounded-r-none text-foreground"
                  />
                </div>
                <Button
                  className="w-20 rounded-l-none text-xs text-background"
                  type="submit"
                >
                  {isLoading && <Loading className="text-background" />}
                  {!isLoading && <p>Save</p>}
                </Button>
              </div>
            </form>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
};

export default UpdateMerchantCookie;
