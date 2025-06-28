"use client";

import { Button } from "@/components/ui/button";
import { RootState } from "@/store/store";
import ErrorIcon from "@mui/icons-material/Error";
import Tooltip from "@mui/material/Tooltip";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Logo } from "../../utils/Logo";

const DemoTopbar = (props: any) => {
    const storeFormula = useSelector((state: RootState) => state.formula);
    const { errors } = storeFormula;

    const containerRef = useRef<HTMLSpanElement>(null);
    const buildButtonRef = useRef<HTMLButtonElement>(null);
    const tabErrors = Object.keys(errors).filter((key) => errors[key]);

    return (
        <span
            className="bg-card fixed top-0 left-0 right-0 z-50 h-[var(--topbar-width)] border-b-[1px] border-x-[1px] border-border flex items-center justify-end px-2 w-full"
            ref={containerRef}
        >
            <div className="flex justify-between w-full">
                <div className="flex items-center px-4">
                    <Logo />
                </div>
                <div className="flex justify-end">
                    <span className="absolute top-0 right-0 z-10 transform -translate-x-1/4 -translate-y-1/4 bg-background text-xs rounded-full">
                        {Object.values(errors).filter((value) => value).length > 0 && (
                            <ErrorIcon className="text-warning !text-[16px]" />
                        )}
                    </span>
                    <Tooltip
                        title={`${tabErrors.length > 0 ? `Resolve ${tabErrors.join(", ")} error` : "Build (⌘ + enter)"}`}
                    >
                        <a
                            href="https://github.com/i-am-hernan/payment-sandbox/blob/main/readme.md"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button
                                key="run"
                                variant="outline"
                                disabled={tabErrors.length > 0}
                                ref={buildButtonRef}
                                size="sm"
                                className="px-4 border-adyen bg-adyen text-[#fff] hover:text-adyen hover:bg-background hover:border-adyen hover:border-1"
                            >
                                Documentation
                            </Button>
                        </a>
                    </Tooltip></div>
            </div>
        </span>
    );
};

export default DemoTopbar;
