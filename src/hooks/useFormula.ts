import { useApi } from "@/hooks/useApi";
import { formulaActions } from "@/store/reducers";
import type { RootState } from "@/store/store";
import { useSearchParams } from "next/navigation";
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
  const redirectResult = searchParams.get("redirectResult");
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
      dispatch(updateFormula({ ...formula }));
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

    const storeFormulaToLocalStorage = (data: any) => {
      sessionStorage.setItem("formula", JSON.stringify(data));
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
        let configuration = data?.data?.configuration;

        if (redirectResult) {
          const sessionStoredFormula = sessionStorage.getItem("formula");
          if (sessionStoredFormula) {
            syncFormula(JSON.parse(sessionStoredFormula));
          }
        } else if (id) {
          syncFormula(configuration);
          storeFormulaToLocalStorage(configuration);
        } else if (isDefault) {
          syncFormula(configuration);
          updateReturnUrl(
            `${process.env.NEXT_PUBLIC_CLIENT_URL}/advance/${variant}`
          );
          storeFormulaToLocalStorage(configuration);
        }
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
  }, [variant, data, merchantAccount]);

  return { formulaLoading, formulaError, formulaSuccess };
};
