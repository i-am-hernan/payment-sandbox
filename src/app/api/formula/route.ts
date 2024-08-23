import dbConnect from "@/lib/db";
import Formula from "@/schema/Formula";
import { NextResponse } from "next/server";

//TODO: Change to NEXT_PUBLIC_API_URL
const BASE_URL = process.env.NEXT_PUBLIC_URL;

//TODO: Move to constants file or configuration file
const STARTER_FORMULA_SLUG = "starter-formula";

export async function GET(request: Request) {
  console.log("Request to GET Starter Formula");

  try {
    await dbConnect();
    console.log("DB Connected");

    let formula = await Formula.findOne({ slug: STARTER_FORMULA_SLUG });

    if (!formula) {
      throw new Error(`Starter Formula not found. Starter Formula Slug attempted: ${STARTER_FORMULA_SLUG}`);
    }

    console.log("Starter Formula retrieved");

    return NextResponse.json({ message: "starter formula retrieved", success: true, data: formula }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred when retrieving the formula", success: false, error: error },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  console.log("Request to POST a Formula");

  try {
    // TODO: Add validation
    const requestBody = await request.json();

    await dbConnect();
    console.log("DB Connected");

    let insertResult = await Formula.create({
      stringifiedConfiguration: requestBody.stringifiedConfiguration,
      description: requestBody.description,
      slug: requestBody.slug,
      link: `${BASE_URL}/${requestBody.slug}`,
      ...requestBody,
      // createdBy: "testUser",
    });

    console.log(`Formula inserted with id: ${insertResult._id}`);
    return NextResponse.json({ message: "formula inserted", success: true, data: insertResult }, { status: 201 });
  } catch (error) {
    console.error("Error inserting formula", error);

    return NextResponse.json(
      { message: "An error occurred when inserting the formula", success: false, error: error },
      { status: 500 }
    );
  }
}
