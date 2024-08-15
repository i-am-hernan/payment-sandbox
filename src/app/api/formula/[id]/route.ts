import dbConnect from "@/lib/db";
import Formula from "@/schema/Formula";
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

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = params;

  console.log(`Proceeding to delete formula with id ${id}`);

  await dbConnect();

  let result = await Formula.findByIdAndDelete(id);
  console.log(result);
  return Response.json({ id: id });
}
