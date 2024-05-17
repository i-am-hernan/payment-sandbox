import { NextResponse } from "next/server";
import AdyenClient from "../../../AdyenClient/client";

// const { Client, CheckoutAPI, Types } = require("@adyen/api-library");
// import { Client, CheckoutAPI, Types } from "@adyen/api-library";
// const client = new Client({ apiKey: process.env.ADYEN_API_KEY as string, environment: "TEST" });

// // Include your idempotency key when you make an API request.
// const requestOptions = { idempotencyKey: "YOUR_IDEMPOTENCY_KEY" };

export async function POST(request: Request) {
  console.log("Creating a new Adyen session");

  try {
    // Create the request object(s)
    const createCheckoutSessionRequest = {
      merchantAccount: "SalespromptECOM",
      amount: {
        value: 1000,
        currency: "USD",
      },
      returnUrl: "https://localhost:3000/api/handleShopperRedirect",
      reference: "YOUR_PAYMENT_REFERENCE",
      countryCode: "US",
    };

    console.log(createCheckoutSessionRequest);

    // Make the API call
    // const checkoutAPI = new CheckoutAPI(client);
    // const response = await checkoutAPI.PaymentsApi.sessions(createCheckoutSessionRequest, { idempotencyKey: "UUID" });

    const adyenClient = new AdyenClient();
    const response: any = await adyenClient.makeApiCall("POST", "/sessions", createCheckoutSessionRequest);
    console.log(`Adyen session created successfully. SessionID: ${response.id}`);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error creating Adyen session");
    console.error(error);
    return NextResponse.json({ message: "error creating session", error: error }, { status: 500 });
  }
}
