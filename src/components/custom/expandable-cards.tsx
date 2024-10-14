"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, CreditCard, Clock, BarChart2, SquareTerminal } from "lucide-react";

interface ExpandableCardsProps {
  paymentMethodName: string;
  paymentMethodType: string;
}

export function ExpandableCards(props: ExpandableCardsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className="w-full px-5">
      <Button variant="default" className="flex flex-auto w-full justify-between" onClick={toggleExpand}>
        <span className="flex items-center">
          <CreditCard className="mr-2 h-4 w-4" />
          {props.paymentMethodName}
        </span>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>

      {isExpanded && (
        <div className="mt-4 flex sm:flex-col md:flex-row justify-center">
          <Button variant="ghost" className="h-auto py-2" asChild>
            <a href={`/sessions/${props.paymentMethodType}`} className="flex flex-col items-center">
              <Clock className="h-4 w-4 mb-1" />
              <span className="text-xs">Sessions</span>
            </a>
          </Button>
          <Button variant="ghost" className=" h-auto py-2" asChild>
            <a href={`/advanced/${props.paymentMethodType}`} className="flex flex-col items-center">
              <SquareTerminal className="h-4 w-4 mb-1" />
              <span className="text-xs">Advanced</span>
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
