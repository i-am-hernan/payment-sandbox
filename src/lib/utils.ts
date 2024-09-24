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
    <link rel="stylesheet" href="styles.css">
    <link href="https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/${version}/adyen.css" type="text/css" rel="stylesheet">
</head>
<body>
    <div id="${variant}"></div>
</body>
<script src="https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/${version}/adyen.js"></script>
</html>
`;
};

export const deepEqual: any = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) {
    return true;
  }

  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
};

export const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

export const resolveRef = (json: any, ref: string) => {
  // console.log("json, ref ", json, ref);
  const path = ref.split("/").slice(1); // Split and remove the initial '#'
  let result = json;
  for (const segment of path) {
    result = result[segment];
    if (result === undefined) {
      throw new Error(`Reference ${ref} not found in JSON`);
    }
  }
  return result;
};
