"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calculator, FlaskConical, Search, Triangle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getFormulas } from "../actions/formula";

export default function FormulasPage() {
  const [allFormulas, setAllFormulas] = useState<any[]>([]);
  const [filteredFormulas, setFilteredFormulas] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [fuse, setFuse] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Initial load
  useEffect(() => {
    setLoading(true);
    Promise.all([import("fuse.js"), getFormulas()]).then(
      ([Fuse, formulas]: [any, any[]]) => {
        console.log(formulas);
        setAllFormulas(formulas);
        setFilteredFormulas(formulas);

        const fuseInstance = new Fuse.default(formulas, {
          keys: ["title", "description"],
          threshold: 0.3,
          includeScore: true,
        });
        setFuse(fuseInstance);
        setLoading(false);
      }
    ).catch(error => {
      console.error("Error loading formulas:", error);
      setLoading(false);
    });
  }, []);

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);

    if (!searchTerm.trim()) {
      setFilteredFormulas(allFormulas);
      return;
    }

    if (fuse) {
      const results = fuse.search(searchTerm);
      setFilteredFormulas(results.map((result: any) => result.item));
    }
  };

  // Map of icon strings to Lucide icon components
  const iconMap: { [key: string]: any } = {
    Calculator,
    Triangle,
    FlaskConical,
  };

  return (
    <div className="bg-dotted-grid bg-grid bg-background min-h-screen min-w-screen">
      <div className="min-h-screen animate-slide-in-from-top">
        (
        <div>
          {/* Hero Section */}
          <div className="max-w-[800px] mx-auto pt-24 pb-16 px-4">
            <div className="space-y-6">
              <div className="flex justify-center mb-2 items-end">
                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                  <FlaskConical className="h-7 w-7 text-adyen" />
                </div>
                <h1 className="ml-1 text-4xl font-light tracking-tight text-foreground">
                  formulas
                </h1>
              </div>
              <div className="space-y-4 text-center">
                <p className="text-muted-foreground text-sm max-w-[600px] mx-auto">
                  Browse our collection of pre-built payment formulas to accelerate your Adyen integration
                </p>
              </div>

              <div className="relative max-w-[500px] mx-auto mt-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    className="pl-10 h-12 bg-background border-border focus:ring-primary/20"
                    placeholder="Search formulas..."
                    value={search}
                    onChange={handleSearch}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {!loading ? `${filteredFormulas.length} formulas available` : "Loading..."}
                </p>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="container mx-auto px-4 pb-16">
            <div className="max-w-[1200px] mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFormulas.map((formula, index) => {
                  const IconComponent = iconMap[formula.icon] || Calculator;

                  return (
                    <Card
                      key={index}
                      className="flex flex-col bg-card border-border/40 hover:border-primary/20 transition-colors duration-200"
                    >
                      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                        <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 ml-4">
                          <CardTitle className="text-base font-medium text-foreground">
                            {formula.title}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formula.integrationType}
                          </p>
                        </div>
                        <Badge
                          variant={formula.integrationType === "advance" ? "secondary" : "default"}
                          className="ml-2 capitalize bg-primary/10 text-primary hover:bg-primary/20"
                        >
                          {formula.txVariant}
                        </Badge>
                      </CardHeader>

                      <CardContent className="flex-grow pt-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {formula.description}
                        </p>
                        <div className="flex items-center mt-4 pt-4 border-t border-border/40">
                          <span className="text-xs text-muted-foreground">Built by</span>
                          <span className="text-xs font-medium ml-1 text-foreground">
                            {formula.builtBy}
                          </span>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-0">
                        <Link
                          className="w-full"
                          href={`/${formula.integrationType}/${formula.txVariant}?id=${formula._id}`}
                        >
                          <Button
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                            variant="default"
                          >
                            Use Formula
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
          <div />

        </div>
      </div>
    </div>
  );
}
