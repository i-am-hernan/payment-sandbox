// app/api/data/[file]/route.ts
import { variantToStyle, VariantToStyle } from "@/lib/variantToStyle";
import { NextRequest } from "next/server";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface StyleResponse {
  [key: string]: {
    selector: string;
    type: string;
    additionalProperties: any;
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { version: string } }
) {
  const { version } = params;
  const searchParams = request.nextUrl.searchParams;
  const txVariant = searchParams.get("txvariant");
  const parsedVersion = version.replaceAll("_", ".");
  const majorVersion = parsedVersion.split(".")[0];

  try {
    if (!txVariant) {
      throw new ApiError("Variant parameter is required", 400);
    }

    const map = variantToStyle as Record<
      string,
      Record<string, VariantToStyle>
    >;
    const path =
      txVariant && map[txVariant] ? map[txVariant][majorVersion].path : null;

    if (!path) {
      throw new ApiError("Could not find style path for variant", 400);
    }

    const url = `https://raw.githubusercontent.com/Adyen/adyen-web/refs/tags/${parsedVersion}/${path}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new ApiError(
        `Failed to fetch SCSS file: ${response.statusText}`,
        response.status
      );
    }

    const scssContent = await response.text();
    const rootClasses = extractRootClasses(scssContent);

    const styleResponse: StyleResponse = {};
    rootClasses.forEach((selector) => {
      styleResponse[selector] = {
        selector: selector,
        type: "selector",
        additionalProperties: {
          "font-family": {
            type: "font-family",
            values: ["Arial", "Helvetica", "sans-serif"],
            description: "The font family to use for the selector",
          },
          "font-size": {
            type: "font-size",
            description: "The font size to use for the selector",
          },
          "background-color": {
            type: "color",
            description: "The background color to use for the selector",
          },
          "color": {
            type: "color",
            description: "The color to use for the selector",
          },
        },
      };
    });

    return Response.json(styleResponse);
  } catch (error: any) {
    if (error instanceof ApiError) {
      return new Response(
        JSON.stringify({
          error: error.message,
          status: error.status,
        }),
        {
          status: error.status,
        }
      );
    }
    return new Response(
      JSON.stringify({
        error: error.message,
        status: 500,
      }),
      {
        status: 500,
      }
    );
  }
}

function extractRootClasses(scss: string): string[] {
  const classes: string[] = [];
  let bracketCount = 0;

  const lines = scss.split("\n");

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (
      trimmedLine.startsWith("@import") ||
      trimmedLine.startsWith("//") ||
      trimmedLine.startsWith("/*") ||
      !trimmedLine
    ) {
      continue;
    }

    bracketCount += (trimmedLine.match(/{/g) || []).length;
    bracketCount -= (trimmedLine.match(/}/g) || []).length;

    // Only process if we're at root level
    if (bracketCount <= 1 && trimmedLine.includes(".")) {
      // Match entire selectors before any { or ,
      const selectorMatch = trimmedLine.match(/([^{,}]+)(?=[{,]|$)/);

      if (selectorMatch) {
        const selector = selectorMatch[1].trim();
        // Only add if it contains a class selector
        if (selector.includes(".")) {
          classes.push(selector);
        }
      }
    }
  }

  return [...new Set(classes)];
}
