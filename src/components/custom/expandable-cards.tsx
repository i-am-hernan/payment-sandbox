"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Clock, CreditCard, SquareTerminal } from "lucide-react";
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
            <Link href={`/sessions/${props.paymentMethodType}`} className="flex flex-col items-center">
              <Clock className="h-4 w-4 mb-1" />
              <span className="text-xs">Sessions</span>
            </Link>
          </Button>
          <Button variant="ghost" className=" h-auto py-2" asChild>
            <Link href={`/advanced/${props.paymentMethodType}`} className="flex flex-col items-center">
              <SquareTerminal className="h-4 w-4 mb-1" />
              <span className="text-xs">Advanced</span>
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
