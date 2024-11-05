import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as parserBabel from "prettier/parser-babel";
import * as parserHtml from "prettier/parser-html";
import * as prettierPluginEstree from "prettier/plugins/estree";
import * as prettier from "prettier/standalone";
import * as jsonc from "jsonc-parser";

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
      return null;
    }
  }
  return result;
};

export const stringifyObject = (obj: any) => {
  const entries = [];
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "function") {
      entries.push(`${key}: ${value.toString()}`);
    } else {
      entries.push(`${key}: ${JSON.stringify(value)}`);
    }
  }
  return `{${entries.join(", ")}}`;
};

export const unstringifyObject = (str: string) => {
  try {
    // Remove the surrounding curly braces
    const objectString = str.slice(1, -1);
    // Create a new function to evaluate the string as JavaScript code
    const obj = new Function(`return {${objectString}}`)();
    return obj;
  } catch (error) {
    console.error("Failed to unstringify object:", error);
    return null;
  }
};

export const sanitizeString = (str: string) => {
  return str.replace(/[\n\t\s]/g, "");
};

export const prettify = async (
  uglyCode: string,
  type: string
): Promise<string> => {
  try {
    const prettierVersion = prettier.format(uglyCode, {
      parser: type,
      plugins: [parserBabel, parserHtml, prettierPluginEstree, jsonc],
      tabWidth: 1,
      useTabs: false,
    });
    return prettierVersion;
  } catch (error) {
    console.error("Prettier formatting error: ", error);
    return JSON.stringify(uglyCode, null, 4); // Fallback to basic formatting
  }
};

export const replaceKeyValue = (
  strObj: string,
  key: string,
  newValue: string,
  type: string
) => {
  const replaceObjectKeyValue = (
    strObj: string,
    key: string,
    newValue: string
  ) => {
    const regex = new RegExp(`(${key}\\s*:\\s*)(\\{[^]*?\\})(,?)`, "g");
    const match = strObj.match(regex);

    if (match) {
      return strObj.replace(regex, `$1${newValue}$3`);
    } else {
      const insertionPoint = strObj.lastIndexOf("}");
      return (
        strObj.slice(0, insertionPoint) +
        `, ${key}: ${newValue}` +
        strObj.slice(insertionPoint)
      );
    }
  };

  let regex = new RegExp(`(${key}\\s*:\\s*)("[^"]*")`, "g");

  if (type === "string") {
    regex = new RegExp(`(${key}\\s*:\\s*)("[^"]*")`, "g");
  } else if (type === "boolean") {
    regex = new RegExp(`(${key}\\s*:\\s*)(true|false)`, "g");
  } else if (type === "integer") {
    regex = new RegExp(`(${key}\\s*:\\s*)(\\d+)`, "g");
  } else if (type === "array") {
    regex = new RegExp(`(${key}\\s*:\\s*)(\\[.*\\])`, "g");
  } else if (type === "object") {
    return replaceObjectKeyValue(strObj, key, newValue);
  }
  // console log if the regex finds a match
  console.log("does the regex match", strObj.match(regex));
  return regex ? strObj.replace(regex, `$1${newValue}`) : strObj;
};

export const replaceKeyValueJSON = (
  strObj: string,
  key: string,
  newValue: string,
  type: string
) => {
  const replaceObjectKeyValue = (
    strObj: string,
    key: string,
    newValue: string
  ) => {
    const regex = new RegExp(`(${key}\\s*:\\s*)(\\{[^]*?\\})(,?)`, "g");
    const match = strObj.match(regex);

    if (match) {
      return strObj.replace(regex, `$1${newValue}$3`);
    } else {
      const insertionPoint = strObj.lastIndexOf("}");
      return (
        strObj.slice(0, insertionPoint) +
        `, ${key}: ${newValue}` +
        strObj.slice(insertionPoint)
      );
    }
  };

  let regex = new RegExp(`(${key}\\s*:\\s*)("[^"]*")`, "g");

  if (type === "string") {
    regex = new RegExp(`("${key}"\\s*:\\s*)("[^"]*")`, "g");
  } else if (type === "boolean") {
    regex = new RegExp(`("${key}"\\s*:\\s*)(true|false)`, "g");
  } else if (type === "integer") {
    regex = new RegExp(`("${key}"\\s*:\\s*)(\\d+)`, "g");
  } else if (type === "array") {
    regex = new RegExp(`("${key}"\\s*:\\s*)(\\[.*\\])`, "g");
  } else if (type === "object") {
    return replaceObjectKeyValue(strObj, key, newValue);
  }
  // console log if the regex finds a match
  console.log("does the regex match", strObj.match(regex));
  return regex ? strObj.replace(regex, `$1${newValue}`) : strObj;
};
