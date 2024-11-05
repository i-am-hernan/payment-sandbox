// app/api/data/[file]/route.ts
import { NextRequest } from "next/server";

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
