"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronRight,
  Clock,
  CreditCard,
  SquareTerminal,
} from "lucide-react";
import { useState } from "react";

interface ExpandableCardsProps {
  paymentMethodName: string;
  paymentMethodType: string;
  defaultExpanded: boolean;
  defaultIntegration: string;
}

export function ExpandableCards(props: ExpandableCardsProps) {
  const { defaultExpanded, defaultIntegration } = props;
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className="w-full px-5">
      <div className="border-l-2 px-1">
        <Button
          variant="outline"
          size="sm"
          className="px-0 py-[3px] h-auto bg-background flex flex-auto w-full justify-start text-xs text-foreground !py-none border-transparent shadow-none rounded-none hover:bg-background hover:border-[1px] hover:border-adyen hover:border-dotted font-thin"
          onClick={toggleExpand}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 pr-1 text-grey" />
          ) : (
            <ChevronRight className="h-4 w-4 pr-1 text-grey" />
          )}
          <span className="flex items-center">{props.paymentMethodName}</span>
        </Button>
        {isExpanded && (
          <div className="flex md:flex-col justify-start pl-2 border-l-2 ml-1">
            <Button
              variant="outline"
              className="pl-1 h-auto py-1 bg-background text-xs text-foreground border-transparent shadow-none rounded-none hover:bg-background hover:border-[1px] hover:border-adyen hover:border-dotted justify-start"
              asChild
            >
              <Link
                href={`/sessions/${props.paymentMethodType}`}
                className="flex items-center"
              >
                <Clock className="h-3 w-3 mb-1 text-adyen" />
                <span
                  className={`pl-1 text-xs ${
                    defaultIntegration === "sessions" && defaultExpanded
                      ? ""
                      : "font-thin"
                  }`}
                >
                  sessions
                </span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="pl-1 h-auto py-1 bg-background text-xs text-foreground border-transparent shadow-none rounded-none hover:bg-background hover:border-[1px] hover:border-adyen hover:border-dotted justify-start"
              asChild
            >
              <Link
                href={`/advance/${props.paymentMethodType}`}
                className="flex items-center"
              >
                <SquareTerminal className="h-3 w-3 mb-1 text-preview" />
                <span
                  className={`pl-1 text-xs ${
                    defaultIntegration === "advance" && defaultExpanded
                      ? ""
                      : "font-thin"
                  }`}
                >
                  advance
                </span>
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
