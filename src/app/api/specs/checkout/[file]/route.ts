// app/api/data/[file]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { file: string } }
) {
  const { file } = params;

  // Construct the file path
  const filePath = path.join(
    process.cwd(),
    "src",
    "assets",
    "specs",
    "openApi",
    `${file}.json`
  );

  try {
    // Read the JSON file
    const fileContents = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(fileContents);

    // Send the JSON data
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return NextResponse.json({ message: "File not found" }, { status: 404 });
  }
}
