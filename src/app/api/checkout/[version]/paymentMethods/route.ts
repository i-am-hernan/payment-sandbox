export async function POST(request: Request, { params }: { params: { version: string } }) {
  try {
    // TODO: Had to change this from request.json() to request.body.
    const requestBody = request.body;
    const response = await fetch(`https://checkout-test.adyen.com/${params.version}/paymentMethods`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": `${process.env.ADYEN_API_KEY}`,
      },
      body: JSON.stringify({
        ...requestBody,
        merchantAccount: `${process.env.ADYEN_MERCHANT_ACCOUNT}`,
      }),
    });

    if (!response.ok) {
      throw response;
    }

    const data = await response.json();
    return Response.json({ ...data });
  } catch (error: any) {
    // TODO: Let's move this into a Error Handler

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
