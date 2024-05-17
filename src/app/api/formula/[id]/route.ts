import { NextRequest } from "next/server";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = params;
  console.log("test");

  console.log(`Getting a Formula with id: ${id}`);
  return Response.json({ id: id });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = params;
  console.log(`Creating a new Formula with id: ${id}`);
  return Response.json({ id: id });
}
