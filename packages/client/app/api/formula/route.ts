import { NextResponse } from "next/server";

export async function GET(request: Request) {
  console.log("Getting a Formuala");
  return NextResponse.json(
    {
      stringifiedConfiguration: `const configuration = {
    environment: 'test', // Change to 'live' for the live environment.
    clientKey: 'test_870be2...', // Public key used for client-side authentication: https://docs.adyen.com/development-resources/client-side-authentication
    analytics: {
      enabled: true // Set to false to not send analytics data to Adyen.
    },
    session: {
      id: 'CSD9CAC3...', // Unique identifier for the payment session.
      sessionData: 'Ab02b4c...' // The payment session data.
    },
    onPaymentCompleted: (result, component) => {
        console.info(result, component);
    },
    onError: (error, component) => {
        console.error(error.name, error.message, error.stack, component);
    },
    // Any payment method specific configuration. Find the configuration specific to each payment method:  https://docs.adyen.com/payment-methods
    // For example, this is 3D Secure configuration for cards:
    paymentMethodsConfiguration: {
      card: {
        hasHolderName: true,
        holderNameRequired: true,
        billingAddressRequired: true
      }
    }
  };`,
      date: new Date().toISOString(),
      createdBy: "mustafa.hoda",
      _id: "60f3b3b3c9f3b0001f1f3b3b",
    },
    { status: 200 }
  );
}

export async function POST(request: Request) {
  console.log("Creating a Formula");
  //   return new Response({ test: "test" }, { status: 201 });
  return NextResponse.json({ message: "formula inserted" }, { status: 201 });
}
