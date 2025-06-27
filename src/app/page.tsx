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
import { FlaskConical, Rocket, PlayCircle, Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import HomeTopBar from "@/components/custom/sandbox/navbars/HomeTopBar";

interface Language {
  name: string;
  url: string;
  icon: string;
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
      { name: "Java", url: "https://github.com/adyen-examples/adyen-java-spring-online-payments/tree/main/checkout-example", icon: "/icons/languages/java-original.svg" },
      { name: "Node.js", url: "https://github.com/adyen-examples/adyen-node-online-payments/tree/main/checkout-example", icon: "/icons/languages/nodejs-original-wordmark.svg" },
      { name: ".NET", url: "https://github.com/adyen-examples/adyen-dotnet-online-payments/tree/main/checkout-example", icon: "/icons/languages/dot-net-original.svg" },
      { name: "Python", url: "https://github.com/adyen-examples/adyen-python-online-payments", icon: "/icons/languages/python-original.svg" },
      { name: "PHP", url: "https://github.com/adyen-examples/adyen-php-online-payments", icon: "/icons/languages/laravel-original.svg" },
      { name: "Ruby", url: "https://github.com/adyen-examples/adyen-rails-online-payments", icon: "/icons/languages/rails-plain.svg" }
    ]
  },
  {
    title: "Advanced Online Payments",
    description: "Perform a complex online payment in three steps",
    languages: [
      { name: "Java", url: "https://github.com/adyen-examples/adyen-java-spring-online-payments/tree/main/checkout-example-advanced", icon: "/icons/languages/java-original.svg" },
      { name: "Node.js", url: "https://github.com/adyen-examples/adyen-node-online-payments/tree/main/checkout-example-advanced", icon: "/icons/languages/nodejs-original-wordmark.svg" },
      { name: ".NET", url: "https://github.com/adyen-examples/adyen-dotnet-online-payments/tree/main/checkout-example-advanced", icon: "/icons/languages/dot-net-original.svg" }
    ]
  },
  {
    title: "Plugins",
    description: "Connect your existing E-commerce system to our payments platform",
    languages: [
      { name: "Magento", url: "https://github.com/adyen-examples/adyen-magento-plugin-demo", icon: "/icons/languages/magento-original.svg" },
      { name: "Shopware", url: "https://github.com/adyen-examples/adyen-shopware-plugin-demo", icon: "/icons/languages/shopware-original.svg" },
      { name: "Salesforce", url: "https://github.com/adyen-examples/adyen-salesforce-pwa-headless-demo", icon: "/icons/languages/salesforce-plain.svg" }
    ]
  }
];

const Page = () => {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <HomeTopBar />
      <div className="max-w-[1400px] mx-auto px-8 pt-32 lg:pt-8 lg:h-[100vh] lg:flex lg:flex-col">
        {/* Hero Section with Stripe-like styling */}
        <div className="text-center mb-32 lg:mb-0 lg:h-[25vh] lg:flex lg:flex-col lg:justify-center">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-adyen bg-clip-text bg-gradient-to-r from-foreground">
            Checkout
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--custom-accent)] text-primary">Lab</span>
            <p className="text-[1rem] font-medium text-muted-foreground max-w-[900px] mx-auto">
              Developer-focused solutions in one place: Integrate seamlessly with Adyen using our integration examples, tools, blogs, and more!
            </p>
          </h1>
        </div>
        {/* Cards with Stripe-like design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 max-w-[1200px] mx-auto mb-16 lg:mb-0 lg:h-[45vh]">
          {/* Demo Experience Card */}
          <Card className="group flex flex-col bg-white border-0 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#0abf53]/10 to-[#08a344]/10 flex items-center justify-center text-[#0abf53] group-hover:scale-110 transition-transform duration-300">
                  <PlayCircle className="h-7 w-7" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-semibold text-foreground">Demo</CardTitle>
                  <div className="flex flex-col items-start gap-2">
                    <CardDescription className="text-base mt-1 text-muted-foreground">
                      Try our interactive demo
                    </CardDescription>
                    <span className="text-[10px] px-2 py-1 rounded-md bg-[#F6F9FC] text-muted-foreground font-medium uppercase tracking-wide border-border border-[1px]">No code</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground text-base leading-relaxed">
                Experience our payment solutions in action with our interactive demo environment. Test features, explore configurations, and see real-time updates.
              </p>
            </CardContent>
            <CardFooter className="pt-6">
              <Link href="/demo" className="w-full">
                <Button
                  className="w-full bg-primary !hover:bg-primary/90 font-white font-medium py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Try demo
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          {/* Custom Integration Card */}
          <Card className="group flex flex-col bg-white border-0 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#0abf53]/10 to-[#08a344]/10 flex items-center justify-center text-[#0abf53] group-hover:scale-110 transition-transform duration-300">
                  <Rocket className="h-7 w-7" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-semibold text-foreground">Sandbox</CardTitle>
                  <div className="flex flex-col items-start gap-2">
                    <CardDescription className="text-base mt-1 text-muted-foreground">
                      Build from scratch
                    </CardDescription>
                    <div className="flex gap-2">
                      <span className="text-[10px] px-2 py-1 rounded-md bg-[#F6F9FC] text-muted-foreground font-medium uppercase tracking-wide border-border border-[1px]">Low code</span>
                      <span className="text-[10px] px-2 py-1 rounded-md bg-[#F6F9FC] text-muted-foreground font-medium uppercase tracking-wide border-border border-[1px]">More code</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground text-base leading-relaxed">
                Experience our payment solutions in action with our interactive demo environment. Test features, explore configurations, and see real-time updates.
              </p>
            </CardContent>
            <CardFooter className="pt-6">
              <Link
                href={`advance/dropin?view=preview`}
                className="w-full"
              >
                <Button
                  className="w-full !bg-[hsl(222.2 84% 4.9%)] text-card font-medium py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 !hover:bg-[hsl(222.2 84% 4.9%)]"

                >
                  Start building
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          {/* Pre-built Formulas Card */}
          <Card className="group flex flex-col bg-white border-0 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#0abf53]/10 to-[#08a344]/10 flex items-center justify-center text-[#0abf53] group-hover:scale-110 transition-transform duration-300">
                  <FlaskConical className="h-7 w-7" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-semibold text-foreground">Pre-built Use Cases</CardTitle>
                  <CardDescription className="text-base mt-1 text-muted-foreground">
                    Ready-to-use sandbox configurations
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground text-base leading-relaxed">
                Get started quickly with our pre-built sandbox configurations that cover common payment scenarios. Perfect for rapid deployment and standardized implementations
              </p>
            </CardContent>
            <CardFooter className="pt-6">
              <Link href="/formulas" className="w-full">
                <Button
                  className="w-full bg-primary !hover:bg-primary/90 font-white font-medium py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Browse builds
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        {/* Developer Image Section */}
        <div className="flex justify-center items-center mt-8 lg:mt-0 lg:h-[30vh]">
          <img
            src="/img/dev-illustration2.svg"
            alt="Developer illustration"
            className="w-full lg:h-full lg:w-auto max-w-[800px] object-contain opacity-90"
          />
        </div>
      </div>

      <section className="py-12 px-8 bg-gradient-to-b from-white to-[#F6F9FC]">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold mb-3 text-foreground">Implementation Examples</h3>
          <p className="text-muted-foreground text-lg mb-12">A list of integration examples on GitHub for you to quickly get started with the Adyen APIs.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {IMPLEMENTATION_EXAMPLES.map((example) => (
              <div key={example.title} className="bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300">
                <div className="flex items-start mb-6">
                  <img src="/icons/github.svg" alt="" className="w-6 h-6 mr-4 mt-1 opacity-80" />
                  <div>
                    <h5 className="text-xl font-semibold mb-2 text-foreground">{example.title}</h5>
                    <p className="text-muted-foreground text-base mb-6">{example.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {example.languages.map((lang) => (
                    <a
                      key={lang.name}
                      href={lang.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-foreground rounded-lg border border-[#E3E8EE] hover:border-[var(--custom-accent)] hover:bg-[#F6F9FC] transition-all"
                    >
                      <img
                        src={lang.icon}
                        alt=""
                        className="w-5 h-5 mr-2 opacity-80"
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

      <section className="py-12 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold mb-3 text-foreground">Developer Tools</h3>
          <p className="text-muted-foreground text-lg mb-12">All the tools and locations to help you start integration fast.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <a
              href="https://docs.adyen.com/"
              target="_blank"
              rel="noopener"
              className="group bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              <div className="flex items-start">
                <img src="/icons/library.svg" alt="" className="w-8 h-8 mr-4 mt-1 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-foreground group-hover:text-[var(--custom-accent)] transition-colors">Documentation</h4>
                  <p className="text-muted-foreground text-base">Our exhaustive documentation</p>
                </div>
              </div>
            </a>

            <a
              href="https://docs.adyen.com/api-explorer/"
              target="_blank"
              rel="noopener"
              className="group bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              <div className="flex items-start">
                <img src="/icons/api-explorer.svg" alt="" className="w-8 h-8 mr-4 mt-1 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-foreground group-hover:text-[var(--custom-accent)] transition-colors">API Explorer</h4>
                  <p className="text-muted-foreground text-base">Our official API reference</p>
                </div>
              </div>
            </a>

            <a
              href="https://github.com/adyen-examples/"
              target="_blank"
              rel="noopener"
              className="group bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              <div className="flex items-start">
                <img src="/icons/github.svg" alt="" className="w-8 h-8 mr-4 mt-1 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-foreground group-hover:text-[var(--custom-accent)] transition-colors">GitHub Samples</h4>
                  <p className="text-muted-foreground text-base">Implementation examples in multiple languages</p>
                </div>
              </div>
            </a>

            <a
              href="https://postman.com/adyendev/"
              target="_blank"
              rel="noopener"
              className="group bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              <div className="flex items-start">
                <img src="/icons/postman.svg" alt="" className="w-8 h-8 mr-4 mt-1 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-foreground group-hover:text-[var(--custom-accent)] transition-colors">Postman workspace</h4>
                  <p className="text-muted-foreground text-base">All of our APIs available as Postman collections</p>
                </div>
              </div>
            </a>

            <a
              href="https://docs.adyen.com/development-resources/testing/test-card-numbers"
              target="_blank"
              rel="noopener"
              className="group bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              <div className="flex items-start">
                <img src="/icons/credit-card.svg" alt="" className="w-8 h-8 mr-4 mt-1 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-foreground group-hover:text-[var(--custom-accent)] transition-colors">Test Cards</h4>
                  <p className="text-muted-foreground text-base">Test your integration with our test card numbers and payment method details</p>
                </div>
              </div>
            </a>

            <a
              href="https://github.com/adyen"
              target="_blank"
              rel="noopener"
              className="group bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              <div className="flex items-start">
                <img src="/icons/plugins.svg" alt="" className="w-8 h-8 mr-4 mt-1 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-foreground group-hover:text-[var(--custom-accent)] transition-colors">Adyen SDKs</h4>
                  <p className="text-muted-foreground text-base">The source for all of our SDKs and more</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className="py-12 px-8 bg-gradient-to-b from-white to-[#F6F9FC]">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold mb-3 text-foreground">Diving Further</h3>
          <p className="text-muted-foreground text-lg mb-12">Diving into our additional resources.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <a
              href="https://github.com/adyen/adyen-openapi"
              target="_blank"
              rel="noopener"
              className="group bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              <div className="flex items-start">
                <img src="/icons/api.svg" alt="" className="w-8 h-8 mr-4 mt-1 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-foreground group-hover:text-[var(--custom-accent)] transition-colors">OpenAPI Specifications</h4>
                  <p className="text-muted-foreground text-base">Our latest API specifications, in OpenAPI format</p>
                </div>
              </div>
            </a>

            <a
              href="https://www.adyen.com/blog/category/tech"
              target="_blank"
              rel="noopener"
              className="group bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              <div className="flex items-start">
                <img src="/icons/news.svg" alt="" className="w-8 h-8 mr-4 mt-1 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-foreground group-hover:text-[var(--custom-accent)] transition-colors">Tech Blog</h4>
                  <p className="text-muted-foreground text-base">Deep dives into our Tech Stack</p>
                </div>
              </div>
            </a>

            <a
              href="newsletter-archive"
              className="group bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              <div className="flex items-start">
                <img src="/icons/news.svg" alt="" className="w-8 h-8 mr-4 mt-1 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-foreground group-hover:text-[var(--custom-accent)] transition-colors">Tech Newsletter</h4>
                  <p className="text-muted-foreground text-base">Monthly updates on new developer resources, new/existing products and events</p>
                </div>
              </div>
            </a>

            <a
              href="https://www.adyen.com/payment-methods"
              target="_blank"
              rel="noopener"
              className="group bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              <div className="flex items-start">
                <img src="/icons/library.svg" alt="" className="w-8 h-8 mr-4 mt-1 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-foreground group-hover:text-[var(--custom-accent)] transition-colors">Supported Payment Methods</h4>
                  <p className="text-muted-foreground text-base">An exhaustive list of our supported payment methods</p>
                </div>
              </div>
            </a>

            <a
              href="https://adyencheckout.com"
              target="_blank"
              rel="noopener"
              className="group bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              <div className="flex items-start">
                <img src="/icons/api.svg" alt="" className="w-8 h-8 mr-4 mt-1 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-foreground group-hover:text-[var(--custom-accent)] transition-colors">Adyen Checkout Create</h4>
                  <p className="text-muted-foreground text-base">Interactive Drop-in creation and styling tool</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className="py-12 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold mb-3 text-foreground">Knowledge Base</h3>
          <p className="text-muted-foreground text-lg mb-12">You ask, we answer.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <a
              href="https://stackoverflow.com/questions/tagged/adyen"
              target="_blank"
              rel="noopener"
              className="group bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              <div className="flex items-start">
                <img src="/icons/stackoverflow.svg" alt="" className="w-8 h-8 mr-4 mt-1 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-foreground group-hover:text-[var(--custom-accent)] transition-colors">Stack Overflow</h4>
                  <p className="text-muted-foreground text-base">Asking technical questions and getting community answers</p>
                </div>
              </div>
            </a>

            <a
              href="https://twitter.com/adyendevs"
              target="_blank"
              rel="noopener"
              className="group bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              <div className="flex items-start">
                <img src="/icons/twitter.svg" alt="" className="w-8 h-8 mr-4 mt-1 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-foreground group-hover:text-[var(--custom-accent)] transition-colors">AdyenDevs on Twitter</h4>
                  <p className="text-muted-foreground text-base">Our Developer Account on Twitter</p>
                </div>
              </div>
            </a>

            <a
              href="https://www.youtube.com/@adyendevs"
              target="_blank"
              rel="noopener"
              className="group bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              <div className="flex items-start">
                <img src="/icons/youtube.svg" alt="" className="w-8 h-8 mr-4 mt-1 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-foreground group-hover:text-[var(--custom-accent)] transition-colors">AdyenDevs on Youtube</h4>
                  <p className="text-muted-foreground text-base">Our Tech Youtube channel with tutorials on various topics</p>
                </div>
              </div>
            </a>

            <a
              href="https://help.adyen.com"
              target="_blank"
              rel="noopener"
              className="group bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              <div className="flex items-start">
                <img src="/icons/help.svg" alt="" className="w-8 h-8 mr-4 mt-1 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-foreground group-hover:text-[var(--custom-accent)] transition-colors">Adyen Help</h4>
                  <p className="text-muted-foreground text-base">The one location to get questions about our products answered</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className="py-24 px-8 bg-gradient-to-b from-white to-[#F6F9FC]">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold mb-3 text-foreground" id="customerAreaLogin">Logging In the Customer Area</h3>
          <p className="text-muted-foreground text-lg mb-12">Direct links to your various environments.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <a
              href="https://ca-live.adyen.com/ca/ca/login.shtml"
              target="_blank"
              rel="noopener"
              className="group bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              <div className="flex items-start">
                <img src="/icons/person-circle.svg" alt="" className="w-8 h-8 mr-4 mt-1 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-foreground group-hover:text-[var(--custom-accent)] transition-colors">LIVE Customer Area</h4>
                  <p className="text-muted-foreground text-base">Logging in your LIVE environment</p>
                </div>
              </div>
            </a>

            <a
              href="https://ca-test.adyen.com/ca/ca/login.shtml"
              target="_blank"
              rel="noopener"
              className="group bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              <div className="flex items-start">
                <img src="/icons/person-circle.svg" alt="" className="w-8 h-8 mr-4 mt-1 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-foreground group-hover:text-[var(--custom-accent)] transition-colors">TEST Customer Area</h4>
                  <p className="text-muted-foreground text-base">Logging in your TEST environment</p>
                </div>
              </div>
            </a>

            <a
              href="https://balanceplatform-live.adyen.com/balanceplatform"
              target="_blank"
              rel="noopener"
              className="group bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              <div className="flex items-start">
                <img src="/icons/platforms.svg" alt="" className="w-8 h-8 mr-4 mt-1 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-foreground group-hover:text-[var(--custom-accent)] transition-colors">LIVE Balance Platform</h4>
                  <p className="text-muted-foreground text-base">Logging in your LIVE environment for Issuing, Embedded Financial Products and Adyen for Platforms</p>
                </div>
              </div>
            </a>

            <a
              href="https://balanceplatform-test.adyen.com/balanceplatform"
              target="_blank"
              rel="noopener"
              className="group bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              <div className="flex items-start">
                <img src="/icons/platforms.svg" alt="" className="w-8 h-8 mr-4 mt-1 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-foreground group-hover:text-[var(--custom-accent)] transition-colors">TEST Balance Platform</h4>
                  <p className="text-muted-foreground text-base">Logging in your TEST environment for Issuing, Embedded Financial Products and Adyen for Platforms</p>
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
