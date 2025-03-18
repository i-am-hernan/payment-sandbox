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
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

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
    <div className="min-h-screen bg-grid bg-card">
      <div className="max-w-[1400px] mx-auto pt-32 pb-16 px-6">
        {/* Hero Section with enhanced styling */}
        <div className="space-y-6 text-center mb-24">
          <h1 className="text-5xl font-semibold tracking-tight text-foreground bg-clip-text">
            Build your custom{" "}
            <span className="text-adyen">payment experience</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-[600px] mx-auto leading-relaxed">
            Explore our pre-built integrations or create your own custom solution with our powerful APIs
          </p>
        </div>

        {/* Cards with enhanced design */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1200px] mx-auto">
          {/* Pre-built Formulas Card */}
          <Card className="group flex flex-col bg-card/50 backdrop-blur-sm border-border/40 hover:border-adyen/40 transition-all duration-300 animate-slide-in shadow-lg hover:shadow-adyen/5">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-adyen group-hover:scale-110 transition-transform duration-300">
                  <FlaskConical className="h-7 w-7" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-medium">Pre-built formulas</CardTitle>
                  <CardDescription className="text-base mt-1">
                    Ready-to-use payment integrations
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Get started quickly with our pre-built solutions that cover common payment scenarios. Perfect for rapid deployment and standardized implementations.
              </p>
            </CardContent>
            <CardFooter className="pt-6">
              <Link href="/formulas" className="w-full">
                <Button
                  className={cn(
                    "w-full group/button relative overflow-hidden bg-adyen hover:bg-adyen/90 text-[#fff]",
                    "transition-all duration-300"
                  )}
                  onClick={() => setShowSandboxButton(true)}
                >
                  <span className="flex items-center justify-center gap-2">
                    Browse formulas
                    <ArrowRight className="h-4 w-4 group-hover/button:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Custom Integration Card */}
          <Card className="group flex flex-col bg-card/50 backdrop-blur-sm border-border/40 hover:border-adyen/40 transition-all duration-300 animate-slide-in-right shadow-lg hover:shadow-adyen/5">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-adyen group-hover:scale-110 transition-transform duration-300">
                  <Rocket className="h-7 w-7" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-medium">Custom integration</CardTitle>
                  <CardDescription className="text-base mt-1">
                    Build from scratch
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-6">
              <div className="space-y-4">
                <Select onValueChange={(value) => setSelectedIntegration(value)}>
                  <SelectTrigger className="w-full h-12 bg-background/50 hover:bg-background/80 transition-colors">
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
                  <SelectTrigger className="w-full h-12 bg-background/50 hover:bg-background/80 transition-colors">
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
              </div>
            </CardContent>
            <CardFooter className="pt-6">
              <Link
                href={selectedVariant ? `/${selectedIntegration}/${selectedVariant}` : '#'}
                className="w-full"
              >
                <Button
                  className={cn(
                    "w-full group/button relative overflow-hidden bg-adyen hover:bg-adyen/90 text-[#fff]",
                    "transition-all duration-300",
                    (!selectedVariant || !selectedIntegration) && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={!selectedVariant || !selectedIntegration}
                >
                  <span className="flex items-center justify-center gap-2">
                    Start building
                    <ArrowRight className="h-4 w-4 group-hover/button:translate-x-1 transition-transform" />
                  </span>
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
