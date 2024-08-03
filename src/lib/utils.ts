import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const createOpenSdkStyles = () => {
  let lastClass = "";
  let thisClass = "";
  const style: any = {};
  document
    .querySelectorAll("code.language-css table.hljs-ln tbody tr")
    .forEach(function (node: any, i) {
      if (i % 3 === 2 && i > 3) {
        thisClass = node.querySelector(".hljs-selector-class").innerText;
        style[thisClass] = "";
        lastClass = thisClass;
      } else if (i % 3 === 0 && i > 3) {
        thisClass = node.querySelector(".hljs-comment").innerText;
        style[lastClass] = thisClass.slice(3, thisClass.length - 3);
      }
    });
};

export const createHtmlCode: any = (version: string, variant: string) => {
  return `<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Payment Sandbox</title>
    <script src="https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/${version}/adyen.js" async=""></script>
    <link href="https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/${version}/adyen.css" type="text/css" rel="stylesheet">
</head>
<body>
    <div id="${variant}"></div>
</body>
</html>
`;
};
