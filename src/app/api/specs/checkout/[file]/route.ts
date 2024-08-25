// app/api/data/[file]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { file: string } }
// ) {
//   const { file } = params;

//   // Construct the file path
//   const filePath = path.join(
//     process.cwd(),
//     "src",
//     "assets",
//     "specs",
//     "openApi",
//     `${file}.json`
//   );

//   try {
//     // Read the JSON file
//     const fileContents = await fs.readFile(filePath, "utf8");
//     const data = JSON.parse(fileContents);

//     // Send the JSON data
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error("Error reading JSON file:", error);
//     return NextResponse.json({ message: "File not found" }, { status: 404 });
//   }
// }

export async function GET(
  request: NextRequest,
  { params }: { params: { file: string } }
) {
  const { file } = params;

  try {
    const response = await fetch(
      `https://raw.githubusercontent.com/Adyen/adyen-openapi/main/json/${file}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": `${process.env.ADYEN_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw response;
    }

    const data = await response.json();
    return Response.json({ ...data });
  } catch (error: any) {
    if (error instanceof Response) {
      const data = await error.json();
      return new Response(JSON.stringify(data), {
        status: error.status,
      });
    } else {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }
  }
}
