import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createOpenSdkStyles() {
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
}
