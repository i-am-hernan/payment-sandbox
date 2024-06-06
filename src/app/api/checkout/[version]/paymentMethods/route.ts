export async function POST(
  request: Request,
  { params }: { params: { version: string } }
) {
  try {
    const response = await fetch(
      `https://checkout-test.adyen.com/${params.version}/paymentMethods`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": "Your API Key Here",
        },
        body: JSON.stringify({
          ...request.body,
          merchantAccount: "Your Merchant Account Here",
        }),
      }
    );

    if (!response.ok) {
      throw response;
    }

    const data = await response.json();
    return Response.json({ data });
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
