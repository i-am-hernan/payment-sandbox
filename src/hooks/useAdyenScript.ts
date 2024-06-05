import { useEffect, useState } from "react";

interface AdyenScriptHook {
  error: string | null;
  adyenCheckout: any | null;
}

const useAdyenScript = (version: string): AdyenScriptHook => {
  const [error, setError] = useState<string | null>(null);
  const [adyenCheckout, setAdyenCheckout] = useState<any | null>(null);

  useEffect(() => {
    const scriptId = `adyen-script-${version}`;
    const cssId = `adyen-css-${version}`;

    // Remove existing script and CSS if version has changed
    document
      .querySelectorAll('script[id^="adyen-script-"], link[id^="adyen-css-"]')
      .forEach((el: Element) => {
        el.remove();
      });

    // Add the new script
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/${version}/adyen.js`;
    script.async = true;
    script.onload = () => {
      setAdyenCheckout((window as any).adyenCheckout); // Set adyenCheckout to the global object from the window
    };
    script.onerror = () => setError("Error loading Adyen script"); // Set error if there's an error loading the script
    document.body.appendChild(script);

    // Add the new CSS
    const link = document.createElement("link");
    link.id = cssId;
    link.href = `https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/${version}/adyen.css`;
    link.type = "text/css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Cleanup function to remove the script and CSS when the component unmounts
    return () => {
      script.remove();
      link.remove();
    };
  }, [version]); // This effect depends on the version, it will re-run if the version changes

  return { error, adyenCheckout };
};

export default useAdyenScript;
