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
import { FlaskConical, Rocket, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import HomeTopBar from "@/components/custom/sandbox/navbars/HomeTopBar";

interface Language {
  name: string;
  url: string;
}

interface Example {
  title: string;
  description: string;
  languages: Language[];
}

const IMPLEMENTATION_EXAMPLES: Example[] = [
  {
    title: "Online Payments",
    description: "Perform an online payment using sessions",
    languages: [
      { name: "Java", url: "https://github.com/adyen-examples/adyen-java-spring-online-payments/tree/main/checkout-example" },
      { name: "Node.js", url: "https://github.com/adyen-examples/adyen-node-online-payments/tree/main/checkout-example" },
      { name: ".NET", url: "https://github.com/adyen-examples/adyen-dotnet-online-payments/tree/main/checkout-example" },
      { name: "Python", url: "https://github.com/adyen-examples/adyen-python-online-payments" },
      { name: "PHP", url: "https://github.com/adyen-examples/adyen-php-online-payments" },
      { name: "Ruby", url: "https://github.com/adyen-examples/adyen-rails-online-payments" }
    ]
  },
  {
    title: "Advanced Online Payments",
    description: "Perform a complex online payment in three steps",
    languages: [
      { name: "Java", url: "https://github.com/adyen-examples/adyen-java-spring-online-payments/tree/main/checkout-example-advanced" },
      { name: "Node.js", url: "https://github.com/adyen-examples/adyen-node-online-payments/tree/main/checkout-example-advanced" },
      { name: ".NET", url: "https://github.com/adyen-examples/adyen-dotnet-online-payments/tree/main/checkout-example-advanced" }
    ]
  },
  {
    title: "Plugins",
    description: "Connect your existing E-commerce system to our payments platform",
    languages: [
      { name: "Magento", url: "https://github.com/adyen-examples/adyen-magento-plugin-demo" },
      { name: "Shopware", url: "https://github.com/adyen-examples/adyen-shopware-plugin-demo" },
      { name: "Salesforce", url: "https://github.com/adyen-examples/adyen-salesforce-pwa-headless-demo" }
    ]
  }
];

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
      <HomeTopBar />
      <div className="max-w-[1400px] mx-auto pt-32 pb-8 px-6">
        {/* Hero Section with enhanced styling */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-semibold tracking-tight text-foreground bg-clip-text">
            Build your custom{" "}
            <span className="text-adyen">payment experience</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-[80%] mx-auto leading-relaxed">
            Developer-focused solutions in one place: Integrate seamlessly with Adyen using our integration examples, tools, blogs, and more! Stay updated with our API, libraries, and upcoming events...
          </p>
        </div>
        {/* Cards with enhanced design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1200px] mx-auto mb-6">
          {/* Demo Experience Card */}
          <Card className="group flex flex-col bg-card/50 backdrop-blur-sm border-border/40 hover:border-adyen/40 transition-all duration-300 animate-slide-in-right shadow-lg hover:shadow-adyen/5">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-adyen group-hover:scale-110 transition-transform duration-300">
                  <PlayCircle className="h-7 w-7" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-medium">Demo Experience</CardTitle>
                  <div className="flex flex-col items-start gap-2">
                    <CardDescription className="text-base mt-1">
                      Try our interactive demo
                    </CardDescription>
                    <span className="text-xxs px-1.5 py-0.5 rounded bg-background border border-border/40 text-muted-foreground font-medium uppercase tracking-wide">No code</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Experience our payment solutions in action with our interactive demo environment. Test features, explore configurations, and see real-time updates.
              </p>
            </CardContent>
            <CardFooter className="pt-6">
              <Link href="/demo" className="w-full">
                <Button
                  className={cn(
                    "w-full group/button relative overflow-hidden bg-adyen hover:bg-adyen/90 text-[#fff]",
                    "transition-all duration-300"
                  )}
                >
                  <span className="flex items-center justify-center gap-2">
                    Try demo
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
                  <div className="flex flex-col items-start gap-2">
                    <CardDescription className="text-base mt-1">
                      Build from scratch
                    </CardDescription>
                    <div className="flex gap-2">
                      <span className="text-xxs px-1.5 py-0.5 rounded bg-background border border-border/40 text-muted-foreground font-medium uppercase tracking-wide">Low code</span>
                      <span className="text-xxs px-1.5 py-0.5 rounded bg-background border border-border/40 text-muted-foreground font-medium uppercase tracking-wide">More code</span>
                    </div>
                  </div>
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
                href={selectedVariant ? `sandbox/${selectedIntegration}/${selectedVariant}` : '#'}
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
        </div>
        {/* Developer Image Section */}
        <div className="flex justify-center items-center">
          <img
            src="/img/dev-illustration2.svg"
            alt="Developer illustration"
            className="w-full max-w-[800px] h-auto"
          />
        </div>
      </div>

      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl font-semibold mb-2 text-[#00112c]">Implementation Examples</h3>
          <p className="text-gray-600 mb-8">Explore our implementation examples for different integration types.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {IMPLEMENTATION_EXAMPLES.map((example) => (
              <div key={example.title} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-4">
                  <img src="/icons/github.svg" alt="" className="w-6 h-6 mr-3 mt-1" />
                  <div>
                    <h5 className="text-lg font-semibold mb-2 text-[#00112c]">{example.title}</h5>
                    <p className="text-sm text-gray-600 mb-4">{example.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {example.languages.map((lang) => (
                    <a
                      key={lang.name}
                      href={lang.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-[#00112c] rounded-full border border-gray-200 hover:border-[#0abf53] hover:bg-[#0abf53]/5 transition-all"
                    >
                      <img
                        src={`/icons/languages/${lang.name.toLowerCase().replace('.', '-dot-')}.svg`}
                        alt=""
                        className="w-4 h-4 mr-2 opacity-80"
                      />
                      {lang.name}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl font-semibold mb-2 text-[#00112c]">Developer Tools</h3>
          <p className="text-gray-600 mb-8">All the tools and locations to help you start integration fast.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a
              href="https://docs.adyen.com/"
              target="_blank"
              rel="noopener"
              className="group bg-gray-50 rounded-lg p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start">
                <img src="/icons/library.svg" alt="" className="w-6 h-6 mr-3 mt-1 opacity-80" />
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-[#00112c] group-hover:text-[#0abf53] transition-colors">Documentation</h4>
                  <p className="text-sm text-gray-600">Our exhaustive documentation</p>
                </div>
              </div>
            </a>

            <a
              href="https://docs.adyen.com/api-explorer/"
              target="_blank"
              rel="noopener"
              className="group bg-gray-50 rounded-lg p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start">
                <img src="/icons/api-explorer.svg" alt="" className="w-6 h-6 mr-3 mt-1 opacity-80" />
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-[#00112c] group-hover:text-[#0abf53] transition-colors">API Explorer</h4>
                  <p className="text-sm text-gray-600">Our official API reference</p>
                </div>
              </div>
            </a>

            <a
              href="https://github.com/adyen-examples/"
              target="_blank"
              rel="noopener"
              className="group bg-gray-50 rounded-lg p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start">
                <img src="/icons/github.svg" alt="" className="w-6 h-6 mr-3 mt-1 opacity-80" />
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-[#00112c] group-hover:text-[#0abf53] transition-colors">GitHub Samples</h4>
                  <p className="text-sm text-gray-600">Implementation examples in multiple languages</p>
                </div>
              </div>
            </a>

            <a
              href="https://postman.com/adyendev/"
              target="_blank"
              rel="noopener"
              className="group bg-gray-50 rounded-lg p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start">
                <img src="/icons/postman.svg" alt="" className="w-6 h-6 mr-3 mt-1 opacity-80" />
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-[#00112c] group-hover:text-[#0abf53] transition-colors">Postman workspace</h4>
                  <p className="text-sm text-gray-600">All of our APIs available as Postman collections</p>
                </div>
              </div>
            </a>

            <a
              href="https://docs.adyen.com/development-resources/testing/test-card-numbers"
              target="_blank"
              rel="noopener"
              className="group bg-gray-50 rounded-lg p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start">
                <img src="/icons/credit-card.svg" alt="" className="w-6 h-6 mr-3 mt-1 opacity-80" />
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-[#00112c] group-hover:text-[#0abf53] transition-colors">Test Cards</h4>
                  <p className="text-sm text-gray-600">Test your integration with our test card numbers and payment method details</p>
                </div>
              </div>
            </a>

            <a
              href="https://github.com/adyen"
              target="_blank"
              rel="noopener"
              className="group bg-gray-50 rounded-lg p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start">
                <img src="/icons/plugins.svg" alt="" className="w-6 h-6 mr-3 mt-1 opacity-80" />
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-[#00112c] group-hover:text-[#0abf53] transition-colors">Adyen SDKs</h4>
                  <p className="text-sm text-gray-600">The source for all of our SDKs and more</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl font-semibold mb-2 text-[#00112c]">Diving Further</h3>
          <p className="text-gray-600 mb-8">Diving into our additional resources.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a
              href="https://github.com/adyen/adyen-openapi"
              target="_blank"
              rel="noopener"
              className="group bg-white rounded-lg p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start">
                <img src="/icons/api.svg" alt="" className="w-6 h-6 mr-3 mt-1 opacity-80" />
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-[#00112c] group-hover:text-[#0abf53] transition-colors">OpenAPI Specifications</h4>
                  <p className="text-sm text-gray-600">Our latest API specifications, in OpenAPI format</p>
                </div>
              </div>
            </a>

            <a
              href="https://www.adyen.com/blog/category/tech"
              target="_blank"
              rel="noopener"
              className="group bg-white rounded-lg p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start">
                <img src="/icons/news.svg" alt="" className="w-6 h-6 mr-3 mt-1 opacity-80" />
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-[#00112c] group-hover:text-[#0abf53] transition-colors">Tech Blog</h4>
                  <p className="text-sm text-gray-600">Deep dives into our Tech Stack</p>
                </div>
              </div>
            </a>

            <a
              href="newsletter-archive"
              className="group bg-white rounded-lg p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start">
                <img src="/icons/news.svg" alt="" className="w-6 h-6 mr-3 mt-1 opacity-80" />
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-[#00112c] group-hover:text-[#0abf53] transition-colors">Tech Newsletter</h4>
                  <p className="text-sm text-gray-600">Monthly updates on new developer resources, new/existing products and events</p>
                </div>
              </div>
            </a>

            <a
              href="https://www.adyen.com/payment-methods"
              target="_blank"
              rel="noopener"
              className="group bg-white rounded-lg p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start">
                <img src="/icons/library.svg" alt="" className="w-6 h-6 mr-3 mt-1 opacity-80" />
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-[#00112c] group-hover:text-[#0abf53] transition-colors">Supported Payment Methods</h4>
                  <p className="text-sm text-gray-600">An exhaustive list of our supported payment methods</p>
                </div>
              </div>
            </a>

            <a
              href="https://adyencheckout.com"
              target="_blank"
              rel="noopener"
              className="group bg-white rounded-lg p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start">
                <img src="/icons/api.svg" alt="" className="w-6 h-6 mr-3 mt-1 opacity-80" />
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-[#00112c] group-hover:text-[#0abf53] transition-colors">Adyen Checkout Create</h4>
                  <p className="text-sm text-gray-600">Interactive Drop-in creation and styling tool</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl font-semibold mb-2 text-[#00112c]">Knowledge Base</h3>
          <p className="text-gray-600 mb-8">You ask, we answer.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a
              href="https://stackoverflow.com/questions/tagged/adyen"
              target="_blank"
              rel="noopener"
              className="group bg-gray-50 rounded-lg p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start">
                <img src="/icons/stackoverflow.svg" alt="" className="w-6 h-6 mr-3 mt-1 opacity-80" />
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-[#00112c] group-hover:text-[#0abf53] transition-colors">Stack Overflow</h4>
                  <p className="text-sm text-gray-600">Asking technical questions and getting community answers</p>
                </div>
              </div>
            </a>

            <a
              href="https://twitter.com/adyendevs"
              target="_blank"
              rel="noopener"
              className="group bg-gray-50 rounded-lg p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start">
                <img src="/icons/twitter.svg" alt="" className="w-6 h-6 mr-3 mt-1 opacity-80" />
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-[#00112c] group-hover:text-[#0abf53] transition-colors">AdyenDevs on Twitter</h4>
                  <p className="text-sm text-gray-600">Our Developer Account on Twitter</p>
                </div>
              </div>
            </a>

            <a
              href="https://www.youtube.com/@adyendevs"
              target="_blank"
              rel="noopener"
              className="group bg-gray-50 rounded-lg p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start">
                <img src="/icons/youtube.svg" alt="" className="w-6 h-6 mr-3 mt-1 opacity-80" />
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-[#00112c] group-hover:text-[#0abf53] transition-colors">AdyenDevs on Youtube</h4>
                  <p className="text-sm text-gray-600">Our Tech Youtube channel with tutorials on various topics</p>
                </div>
              </div>
            </a>

            <a
              href="https://help.adyen.com"
              target="_blank"
              rel="noopener"
              className="group bg-gray-50 rounded-lg p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start">
                <img src="/icons/help.svg" alt="" className="w-6 h-6 mr-3 mt-1 opacity-80" />
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-[#00112c] group-hover:text-[#0abf53] transition-colors">Adyen Help</h4>
                  <p className="text-sm text-gray-600">The one location to get questions about our products answered</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl font-semibold mb-2 text-[#00112c]" id="customerAreaLogin">Logging In the Customer Area</h3>
          <p className="text-gray-600 mb-8">Direct links to your various environments.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              href="https://ca-live.adyen.com/ca/ca/login.shtml"
              target="_blank"
              rel="noopener"
              className="group bg-white rounded-lg p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start">
                <img src="/icons/person-circle.svg" alt="" className="w-6 h-6 mr-3 mt-1 opacity-80" />
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-[#00112c] group-hover:text-[#0abf53] transition-colors">LIVE Customer Area</h4>
                  <p className="text-sm text-gray-600">Logging in your LIVE environment</p>
                </div>
              </div>
            </a>

            <a
              href="https://ca-test.adyen.com/ca/ca/login.shtml"
              target="_blank"
              rel="noopener"
              className="group bg-white rounded-lg p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start">
                <img src="/icons/person-circle.svg" alt="" className="w-6 h-6 mr-3 mt-1 opacity-80" />
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-[#00112c] group-hover:text-[#0abf53] transition-colors">TEST Customer Area</h4>
                  <p className="text-sm text-gray-600">Logging in your TEST environment</p>
                </div>
              </div>
            </a>

            <a
              href="https://balanceplatform-live.adyen.com/balanceplatform"
              target="_blank"
              rel="noopener"
              className="group bg-white rounded-lg p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start">
                <img src="/icons/platforms.svg" alt="" className="w-6 h-6 mr-3 mt-1 opacity-80" />
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-[#00112c] group-hover:text-[#0abf53] transition-colors">LIVE Balance Platform</h4>
                  <p className="text-sm text-gray-600">Logging in your LIVE environment for Issuing, Embedded Financial Products and Adyen for Platforms</p>
                </div>
              </div>
            </a>

            <a
              href="https://balanceplatform-test.adyen.com/balanceplatform"
              target="_blank"
              rel="noopener"
              className="group bg-white rounded-lg p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start">
                <img src="/icons/platforms.svg" alt="" className="w-6 h-6 mr-3 mt-1 opacity-80" />
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-[#00112c] group-hover:text-[#0abf53] transition-colors">TEST Balance Platform</h4>
                  <p className="text-sm text-gray-600">Logging in your TEST environment for Issuing, Embedded Financial Products and Adyen for Platforms</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
