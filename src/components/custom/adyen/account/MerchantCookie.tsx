import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { userActions } from "@/store/reducers";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Cookies from "js-cookie";
import SettingsIcon from "@mui/icons-material/Settings";

const { updateMerchantAccount } = userActions;

const MerchantCookie = (props: any) => {
  const [open, setOpen] = useState(false);
  const [merchantAccountLocal, setMerchantAccountLocal] = useState("");
  const dispatch = useDispatch();
  const { merchantAccount } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const merchantAccountCookie = Cookies.get("merchantAccount");
    if (!merchantAccountCookie) {
      setOpen(true);
    } else {
      dispatch(updateMerchantAccount(merchantAccountCookie));
    }
  }, []);
  const handleSave = () => {
    Cookies.set("merchantAccount", merchantAccountLocal, { expires: 365 });
    dispatch(updateMerchantAccount(merchantAccountLocal));
    // Here we can call a function that updates the merchant account in the formula state.
    // We can update the merchant account across all of the APIs so that it is consistent.
    // We need to validate the merchant account before storing it in cookies. We can do this by checking if the merchant account is in the list of merchant accounts that are available.
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Choose Your Merchant Account</DialogTitle>
          <DialogDescription className="text-sm">
            Choose the merchant account you want to submit the payment with.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center">
          <div className="flex-1">
            <Label htmlFor="name" className="text-right sr-only">
              Account
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={merchantAccount}
              onChange={(e) => setMerchantAccountLocal(e.target.value)}
            />
          </div>
          <Button
            key="run"
            variant="default"
            size="icon"
            className="pt-0 rounded-l-none"
            spellCheck={false}
            onClick={(event) => {
              console.log("search button clicked");
            }}
          >
            <SettingsIcon sx={{ fontSize: "12px" }} />
          </Button>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} type="submit">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MerchantCookie;
