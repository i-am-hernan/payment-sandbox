import { useApi } from "@/hooks/useApi";
import { formulaActions } from "@/store/reducers";
import { sanitizeString } from "@/utils/utils";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const {
  updateFormula,
  updateRun,
  updateBase,
  updateReset,
  updateVariantReturnUrl,
  updateBuildCheckoutReturnUrls,
} = formulaActions;

export const useFormula = (
  variant: string,
  view: string,
  integration: string
) => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const redirectResult = searchParams.get("redirectResult");
  const { data, error: apiError } = useApi(
    `api/formula/${integration}${id ? "/" + id : ""}`,
    "GET"
  );

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
      if (
        typeof formula.txVariantConfiguration === "string" &&
        formula.txVariantConfiguration === ""
      ) {
        formula.txVariantConfiguration = "{}";
      }

      if (typeof formula.style === "object") {
        formula.style = "";
      }

      dispatch(updateFormula({ ...formula }));
    };
    const syncBase = (base: any) => {
      if (base.txVariantConfiguration && base.txVariantConfiguration === "") {
        base.txVariantConfiguration = sanitizeString(`{}`);
      }
      dispatch(updateBase({ ...base }));
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

    if (variant && data) {
      if (data.error || data.success === false || apiError) {
        setFormula({
          loading: false,
          error: data.error
            ? data.error
            : apiError
              ? apiError
              : "Error getting formula",
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
          syncBase(configuration);
          syncFormula(configuration);
          if (configuration.returnUrl) {
            const returnUrl = new URL(configuration.returnUrl);
            returnUrl.searchParams.set("id", id);
            updateReturnUrl(returnUrl.toString());
          } else {
            const returnUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/${integration}/${variant}?id=${id}&view=${view}`;
            updateReturnUrl(returnUrl);
          }
          storeFormulaToLocalStorage(configuration);
        } else if (isDefault) {
          syncFormula(configuration);
          updateReturnUrl(
            `${process.env.NEXT_PUBLIC_CLIENT_URL}/${integration}/${variant}`
          );
          storeFormulaToLocalStorage(configuration);
        }
        syncSandBoxWithFormula();
        rebuildCheckout();
        setFormula({
          loading: false,
          error: null,
          success: true,
        });
      }
    }
  }, [variant, data]);

  return { formulaLoading, formulaError, formulaSuccess };
};
