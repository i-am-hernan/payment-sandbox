import Loading from "@/components/custom/utils/Loading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userActions } from "@/store/reducers";
import { RootState } from "@/store/store";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const { updateMerchantAccount } = userActions;

const SetMerchantCookie = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New state variable
  const [merchantAccountLocal, setMerchantAccountLocal] = useState("");
  const dispatch = useDispatch();
  const { defaultMerchantAccount } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    const merchantAccountCookie = Cookies.get("merchantAccount");
    if (!merchantAccountCookie) {
      setOpen(true);
    } else {
      dispatch(updateMerchantAccount(merchantAccountCookie));
    }
    console.log("merchantAccountCookie", merchantAccountCookie);
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
      // Here we can set the merchant account in the state of the api requests as well
      setOpen(false);
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        console.log("onOpenChange", open);
        if (!open && !Cookies.get("merchantAccount")) {
          Cookies.set("merchantAccount", defaultMerchantAccount, {
            expires: 365,
          });
          setOpen(false);
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[16px]">
            Choose Your Merchant Account
          </DialogTitle>
          <DialogDescription className="text-[12px]">
            Select the merchant account you want to submit the payment with.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSave}>
          {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
          <div className="flex items-center">
            <div className="flex-1">
              <Label htmlFor="name" className="text-right sr-only">
                Account
              </Label>
              <Input
                id="name"
                value={merchantAccountLocal}
                onChange={(e) => setMerchantAccountLocal(e.target.value)}
                className="rounded-r-none"
              />
            </div>
            <Button className="w-24 rounded-l-none text-xs" type="submit">
              {isLoading && <Loading />}
              {!isLoading && <p>Save</p>}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SetMerchantCookie;
