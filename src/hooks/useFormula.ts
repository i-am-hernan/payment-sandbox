import { useApi } from "@/hooks/useApi";
import { formulaActions } from "@/store/reducers";
import type { RootState } from "@/store/store";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const {
  updateFormula,
  updateApiRequestMerchantAccount,
  updateBuildMerchantAccount,
  updateRun,
  updateReset,
  updateVariantReturnUrl,
  updateBuildCheckoutReturnUrls,
} = formulaActions;

export const useFormula = (variant: string) => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { data, error } = useApi(`api/formula${id ? "/" + id : ""}`, "GET");

  const { merchantAccount } = useSelector((state: RootState) => state.user);

  const [formula, setFormula] = useState({
    loading: true,
    error: null,
    success: false,
  });

  const {
    loading: formulaLoading,
    error: formulaError,
    success: formulaSuccess,
  } = formula;

  useEffect(() => {
    const syncFormula = (formula: any) => {
      let { data } = formula;
      let { configuration } = data;
      dispatch(updateFormula({ ...configuration }));
    };
    const updateMerchantAccount = (merchantAccount: string) => {
      dispatch(updateApiRequestMerchantAccount(merchantAccount));
      dispatch(updateBuildMerchantAccount(merchantAccount));
    };
    const updateReturnUrl = (returnUrl: string) => {
      dispatch(updateBuildCheckoutReturnUrls(returnUrl));
      dispatch(updateVariantReturnUrl(returnUrl));
    };

    const syncSandBoxWithFormula = () => {
      dispatch(updateReset());
    };

    const rebuildCheckout = () => {
      dispatch(updateRun());
    };

    if (variant && data && merchantAccount) {
      if (data.error || data.success === false || error) {
        setFormula({
          loading: false,
          error: data.error
            ? data.error
            : error
              ? error
              : "Error setting formula",
          success: false,
        });
      } else {
        const isDefault = id === null ? true : false;
        if (isDefault) {
          // if we get the default configuration, then we set the return url to the default
          updateReturnUrl(
            `${process.env.NEXT_PUBLIC_CLIENT_URL}/advance/${variant}`
          );
        }
        syncFormula(data);
        updateMerchantAccount(merchantAccount);
        syncSandBoxWithFormula();
        rebuildCheckout();
        setFormula({
          loading: false,
          error: null,
          success: true,
        });
      }
    }
  }, [variant, data, merchantAccount, id]);

  return { formulaLoading, formulaError, formulaSuccess };
};
