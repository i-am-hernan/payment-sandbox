
import HomeTopBar from "@/components/custom/sandbox/navbars/HomeTopBar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, FlaskConical, PlayCircle, Rocket } from "lucide-react";
import Link from "next/link";

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

const Page = () => {
  return (
    <div className="min-h-screen">
      <HomeTopBar />
      <div className="max-w-[1400px] mx-auto px-8 pt-32 lg:pt-8 lg:h-[100vh] lg:flex lg:flex-col">
        {/* Hero Section with Stripe-like styling */}
        <div className="text-center mb-32 lg:mb-0 lg:h-[25vh] lg:flex lg:flex-col lg:justify-center">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-adyen bg-clip-text bg-gradient-to-r from-foreground">
            Checkout
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--custom-accent)] text-primary">Lab</span>
            <p className="pt-1 text-[1rem] font-medium text-muted-foreground max-w-[900px] mx-auto">
              Integrate seamlessly with Adyen using our integration tools! Developer-focused solutions in one place.
            </p>
          </h1>
        </div>
        {/* Cards with Stripe-like design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 max-w-[1200px] mx-auto mb-16 lg:mb-0 lg:h-[45vh]">
          {/* Demo Experience Card */}
          <Card className="group flex flex-col bg-card border-0 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300">
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
              <Link href="/demo/dropin" className="w-full bg-background">
                <Button
                  className="w-full bg-primary hover:border-primary  hover:border-2 text-card hover:text-primary font-medium py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Try demo
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          {/* Custom Integration Card */}
          <Card className="group flex flex-col bg-card border-0 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300">
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
                  className="w-full bg-primary hover:border-primary  hover:border-2 text-card hover:text-primary font-medium py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Start building
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          {/* Pre-built Formulas Card */}
          <Card className="group flex flex-col bg-card border-0 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#0abf53]/10 to-[#08a344]/10 flex items-center justify-center text-[#0abf53] group-hover:scale-110 transition-transform duration-300">
                  <FlaskConical className="h-7 w-7" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-semibold text-foreground">Example Builds</CardTitle>
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
                  className="w-full bg-primary hover:border-primary  hover:border-2 text-card hover:text-primary font-medium py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
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
    </div>
  );
};

export default Page;
