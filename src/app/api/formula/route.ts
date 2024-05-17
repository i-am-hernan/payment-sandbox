import { NextRequest, NextResponse } from "next/server";

import Formula from "../../schema/Formula";
import mongoose from "mongoose";

export async function GET(request: Request) {
  console.log("Getting a Formuala");
  return NextResponse.json(
    {
      configuration: {
        environment: "test", // Change to 'live' for the live environment.
        clientKey: "test_M6TZBF6HYRAZHMFBGXMILDLMAEOYAERI", // Public key used for client-side authentication: https://docs.adyen.com/development-resources/client-side-authentication
        analytics: {
          enabled: false, // Set to false to not send analytics data to Adyen.
        },
        session: {
          id: "",
          sessionData: "",
        },
        onPaymentCompleted: (result: any, component: any) => {
          console.info(result, component);
        },
        onError: (error: any, component: any) => {
          console.error(error.name, error.message, error.stack, component);
        },
        onChange: (state: any, component: any) => {
          console.log(state);
        },
        // Any payment method specific configuration. Find the configuration specific to each payment method:  https://docs.adyen.com/payment-methods
        // For example, this is 3D Secure configuration for cards:
        paymentMethodsConfiguration: {
          card: {
            hasHolderName: true,
            holderNameRequired: true,
            billingAddressRequired: true,
          },
        },
      },
      date: new Date().toISOString(),
      createdBy: "admin",
      _id: "60f3b3b3c9f3b0001f1f3b3b",
    },
    { status: 200 }
  );
}

export async function POST(request: NextRequest) {
  console.log("Formula POST request received");

  try {
    const body = await request.json();
    // Connect the DB
    // TODO: Move this to a shared function
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING as string);

    // Insert the formula into the database
    let result = await Formula.create(body);
    console.log(`Formula inserted ${result._id}`);

    return NextResponse.json({ message: "formula inserted", data: result }, { status: 201 });
  } catch (error) {
    console.error("Error creating formula");
    return NextResponse.json({ message: "error inserting formula", error: error }, { status: 500 });
  }
}
