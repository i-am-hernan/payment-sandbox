"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, CreditCard, Clock, BarChart2 } from "lucide-react";

interface ExpandableCardsProps {
  paymentMethod: string;
}

export function ExpandableCards(props: ExpandableCardsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className="w-full px-5">
      <Button variant="default" className="w-full justify-between" onClick={toggleExpand}>
        <span className="flex items-center">
          <CreditCard className="mr-2 h-4 w-4" />
          {props.paymentMethod}
        </span>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>

      {isExpanded && (
        <div className="mt-4 flex justify-between space-x-2">
          <Button variant="ghost" className="flex-1 h-auto py-2" asChild>
            <a href="/sessions" className="flex flex-col items-center">
              <Clock className="h-4 w-4 mb-1" />
              <span className="text-xs">Sessions</span>
            </a>
          </Button>
          <Button variant="ghost" className="flex-1 h-auto py-2" asChild>
            <a href="/advanced" className="flex flex-col items-center">
              <BarChart2 className="h-4 w-4 mb-1" />
              <span className="text-xs">Advanced</span>
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
