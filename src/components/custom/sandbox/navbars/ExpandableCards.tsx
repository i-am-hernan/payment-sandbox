"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Clock, CreditCard, SquareTerminal } from "lucide-react";
import { useState } from "react";

interface ExpandableCardsProps {
  paymentMethodName: string;
  paymentMethodType: string;
}

export function ExpandableCards(props: ExpandableCardsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className="w-full px-5">
      <Button
        variant="default"
        size="sm"
        className="bg-background flex flex-auto w-full justify-start text-xs text-foreground !py-none hover:bg-background mb-2"
        onClick={toggleExpand}
      >
        {isExpanded ? <ChevronDown className="h-4 w-4 pr-1" /> : <ChevronRight className="h-4 w-4 pr-1" />}
        <span className="flex items-center">{props.paymentMethodName}</span>
      </Button>
      {isExpanded && (
        <div className="flex md:flex-col justify-start pl-2">
          <Button
            variant="ghost"
            className="h-auto py-2 bg-background text-xs text-foreground hover:bg-background justify-start"
            asChild
          >
            <Link href={`/sessions/${props.paymentMethodType}`} className="flex items-center">
              <Clock className="h-4 w-4 mb-1" />
              <span className="pl-2 text-xs">Sessions</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="h-auto py-2 bg-background text-xs text-foreground hover:bg-background justify-start"
            asChild
          >
            <Link href={`/advance/${props.paymentMethodType}`} className="flex items-center">
              <SquareTerminal className="h-4 w-4 mb-1" />
              <span className="pl-2 text-xs">Advanced</span>
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
