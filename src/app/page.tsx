"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RequestOptions } from "@/hooks/useApi";
import { FlaskConical, Rocket } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const Page = () => {
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedIntegration, setSelectedIntegration] = useState("");
  const [showSandboxButton, setShowSandboxButton] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<{
    data: any;
    loading: boolean;
    error: any;
  }>({
    data: null,
    loading: true,
    error: null,
  });

  // Example variants - replace with your API call
  const variants = [
    "card",
    "ideal",
    "klarna",
    "paypal",
  ];

  const integrationTypes = [
    { value: "advance", label: "Advanced" },
    { value: "sessions", label: "Sessions" },
  ];

  const fetchPaymentMethods = async (merchantAccount: string) => {
    try {
      const requestOptions: RequestOptions = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ merchantAccount: merchantAccount }),
      };
      const domain = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(
        `${domain}/api/checkout/v71/paymentMethods`,
        {
          method: requestOptions.method,
          headers: requestOptions.headers,
          body: requestOptions.body,
        }
      );
      const data = await response.json();
      if (data.status >= 400) {
        throw new Error(data.message);
      } else {
        setPaymentMethods({
          data: data.paymentMethods,
          loading: false,
          error: null,
        });
      }
    } catch (error: any) {
      setPaymentMethods({
        data: null,
        loading: false,
        error: error.message,
      });
    }
  };

  useEffect(() => {
    fetchPaymentMethods(process.env.NEXT_PUBLIC_MERCHANT_ACCOUNT || "");
  }, []);

  return (
    <div className="dark min-h-screen bg-dotted-grid bg-grid bg-background">
      <div className="max-w-[1200px] mx-auto pt-24 pb-16 px-4">
        <div className="space-y-5 text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Build your custom payment experience
          </h1>
          <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">
            Explore our pre-built integrations or create your own custom solution
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[900px] mx-auto">
          <Card className="flex flex-col bg-card border-border hover:border-adyen transition-colors duration-200 animate-slide-in shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-adyen">
                  <FlaskConical className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Pre-built formulas</CardTitle>
              </div>
              <CardDescription>
                Browse our collection of ready-to-use payment integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">
                Get started quickly with our pre-built solutions that cover common payment scenarios
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/formulas" className="w-full">
                <Button
                  className="w-full bg-adyen hover:bg-primary/90 text-white"
                  onClick={() => setShowSandboxButton(true)}
                >
                  Browse formulas
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Custom Integration Card */}
          <Card className="flex flex-col bg-card border-border hover:border-adyen transition-colors duration-200 animate-slide-in-right shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-adyen">
                  <Rocket className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Custom integration</CardTitle>
              </div>
              <CardDescription>
                Build your own integration from scratch
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <Select onValueChange={(value) => setSelectedIntegration(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select integration type" />
                </SelectTrigger>
                <SelectContent>
                  {integrationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                onValueChange={(value) => {
                  setSelectedVariant(value);
                  setShowSandboxButton(true);
                }}
                disabled={!selectedIntegration}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key={"dropin"} value={"dropin"}>
                    Dropin
                  </SelectItem>
                  {paymentMethods.data?.map((variant: any, index: number) => (
                    <SelectItem key={index} value={variant.type}>
                      {variant.name.charAt(0).toUpperCase() + variant.name.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
            <CardFooter>
              <Link
                href={selectedVariant ? `/${selectedIntegration}/${selectedVariant}` : '#'}
                className="w-full"
              >
                <Button
                  className="w-full bg-adyen hover:bg-primary/90 text-white"
                  disabled={!selectedVariant || !selectedIntegration}
                >
                  Start building
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
