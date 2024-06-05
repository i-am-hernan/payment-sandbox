import { useApi } from "@/hooks/useApi";
import { useEffect } from "react";
import useAdyenScript from "@/hooks/useAdyenScript";
// import { ReactComponent as AdyenIdkIcon } from "@/assets/adyen-idk-icon.svg"

export const AdvanceComponent = (props: any) => {
  const {
    checkoutConfiguration,
    checkoutAPIVersion,
    adyenWebVersion,
    variant,
    txVariantConfiguration,
    paymentMethodsRequest,
    paymentsRequest,
    paymentsDetailsRequest,
  } = props;

  // const { data, loading, error: paymentMethodsError } = useApi(
  //   `merchant/api/${checkoutAPIVersion}/paymentMethods`,
  //   "GET",
  //   paymentMethodsRequest
  // );

  // const { adyenCheckout, error: adyenError } = useAdyenScript(adyenWebVersion);
  console.log(
    checkoutConfiguration,
    checkoutAPIVersion,
    adyenWebVersion,
    variant,
    txVariantConfiguration,
    paymentMethodsRequest,
    paymentsRequest,
    paymentsDetailsRequest
  );
  return <h1>hello world</h1>;

  // useEffect(() => {
  //   if (checkout) {
  //     try {
  //       checkout
  //         .create(product, {
  //           ...local,
  //         })
  //         .mount("#checkout");
  //     } catch (error: any) {
  //       console.error(error);
  //       setCreateError(error.message);
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [checkout, local]);

  // return (
  //   <Box sx={configuration?.style}>
  //     {!checkout && !error && !result && <LinearProgress />}
  //     {showMessages()}
  //     {!error && !result && checkout && (
  //       <Box
  //         mx={7}
  //         my={2}
  //         px={1}
  //         py={1}
  //         sx={{
  //           borderRadius: 3,
  //           bgcolor: "secondary.light",
  //           border: 1,
  //           borderColor: "primary.light",
  //         }}
  //       >
  //         <CssBaseline />
  //         <div id="checkout"></div>
  //       </Box>
  //     )}
  //   </Box>
  // );
};
