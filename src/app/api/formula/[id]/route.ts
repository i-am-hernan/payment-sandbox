import dbConnect from "@/lib/db";
import Formula from "@/schema/Formula";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = params;

  try {
    console.log(`Getting a Formula with id: ${id}`);
    await dbConnect();
    console.log("DB Connected");

    let result = await Formula.findById(id);

    console.log(`Successfully retrieved formula with id: ${result.id}`);

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.error(`An error occurred when retrieving formula with id ${id}`);
    return NextResponse.json({ message: `An error occurred when retrieving formula with id ${id}` });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = params;
  console.log(`Proceeding to delete formula with id ${id}`);

  try {
    await dbConnect();
    console.log("DB Connected");
    let result = await Formula.findByIdAndDelete(id);

    console.log(result);

    console.log(`Successfully deleted Formula with id: ${result.id}`);
    return NextResponse.json({ message: "formula deleted", id: result.id }, { status: 200 });
  } catch (error) {
    console.error(`An error occurred when deleting the formula with id ${id}`, error);
    return NextResponse.json(
      {
        message: "An error occurred when deleting the formula",
        error,
      },
      { status: 500 }
    );
  }
}
