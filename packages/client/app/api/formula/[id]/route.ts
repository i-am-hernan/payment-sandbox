import { NextRequest } from "next/server";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = params;

  console.log(`Getting a Formula with id: ${id}`);
  return Response.json({ id: id });
}
