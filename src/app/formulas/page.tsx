"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, Search, Calculator, Triangle, FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getFormulas } from "../actions/formula";
import { Formula } from "@/schema/Formula";

export default function FormulasPage() {
  const [allFormulas, setAllFormulas] = useState<Formula[]>([]);
  const [filteredFormulas, setFilteredFormulas] = useState<Formula[]>([]);
  const [search, setSearch] = useState("");
  const [fuse, setFuse] = useState<any | null>(null);

  // Initial load
  useEffect(() => {
    Promise.all([import("fuse.js"), getFormulas()]).then(([Fuse, formulas]: [any, any[]]) => {
      console.log(formulas);
      setAllFormulas(formulas);
      setFilteredFormulas(formulas);

      const fuseInstance = new Fuse.default(formulas, {
        keys: ["title", "description"],
        threshold: 0.3,
        includeScore: true,
      });
      setFuse(fuseInstance);
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Payment Sandbox Formulas</h1>
      <p className="text-xl mb-8">
        Find the formulas for various payment methods, payment flows and integrations that fits your needs. See the code
        and examples for each formula so you can 10X your development.
      </p>
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-10"
          placeholder="Search for formulas..."
          type="search"
          value={search}
          onChange={handleSearch}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4">
        {filteredFormulas.map((formula, index) => {
          const IconComponent = iconMap[formula.icon] || Calculator;

          return (
            <Card key={index} className="flex flex-col h-full">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <IconComponent className="h-8 w-8 text-primary" />
                <CardTitle className="text-base ml-2 flex-grow">{formula.title}</CardTitle>
                <Badge variant={formula.integrationType === "advance" ? "secondary" : "default"} className="ml-2">
                  {formula.integrationType}
                </Badge>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <p className="text-sm text-muted-foreground mb-2">{formula.description}</p>
                <div className="flex items-center mt-auto">
                  <span className="text-xs text-muted-foreground">Built by:</span>
                  <span className="text-xs font-medium ml-1">{formula.builtBy}</span>
                </div>
              </CardContent>
              <CardFooter>
                {/* TODO: Figure out how to determine the txVariant and integrationType and pass it along with the formula id */}
                <Link
                  className="w-full"
                  href={`/formulas/${formula.integrationType}/${formula.txVariant}?id=${formula.id}`}
                >
                  <Button className="w-full bg-[#0abf53] hover:bg-[#0a9f45] text-white" variant="outline">
                    Use Formula
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
