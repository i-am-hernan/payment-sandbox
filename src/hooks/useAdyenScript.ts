import { useEffect } from 'react';

const useAdyenScript = (version: string) => {
  useEffect(() => {
    const scriptId = `adyen-script-${version}`;
    const cssId = `adyen-css-${version}`;

    // Remove existing script and CSS if version has changed
    document.querySelectorAll('script[id^="adyen-script-"], link[id^="adyen-css-"]').forEach(el => {
      el.remove();
    });

    // Add the new script
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/${version}/adyen.js`;
    script.async = true;
    document.body.appendChild(script);

    // Add the new CSS
    const link = document.createElement('link');
    link.id = cssId;
    link.href = `https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/${version}/adyen.css`;
    link.type = 'text/css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Cleanup function to remove the script and CSS when the component unmounts
    return () => {
      script.remove();
      link.remove();
    };
  }, [version]); // This effect depends on the version, it will re-run if the version changes
};

export default useAdyenScript;