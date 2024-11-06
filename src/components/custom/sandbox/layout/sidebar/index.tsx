import { ExpandableCards } from "@/components/custom/sandbox/navbars/ExpandableCards";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useApi } from "@/hooks/useApi";
import CodeIcon from "@mui/icons-material/Code";
import MenuIcon from "@mui/icons-material/Menu";
import StorageIcon from "@mui/icons-material/Storage";
import WebhookIcon from "@mui/icons-material/Webhook";
import { set } from "mongoose";
import { useState } from "react";

const Sidebar = (props: any) => {
  const { section, setSection } = props;
  const buttons = [
    { name: "client", icon: <CodeIcon /> },
    { name: "server", icon: <StorageIcon /> },
    { name: "webhooks", icon: <WebhookIcon /> },
  ];

  const {
    data: paymentMethodsResponse,
    loading: loadingPaymentMethods,
    error: paymentMethodsError,
  } = useApi(`api/checkout/v71/paymentMethods`, "POST");

  return (
    <span className="absolute top-0 left-0 w-[var(--sidebar-width)] h-full border-2 text-center pt-3">
      <span>
        <Drawer direction="left">
          <DrawerTrigger>
            <MenuIcon />
          </DrawerTrigger>
          <DrawerContent className="h-full w-[20vw]">
            <DrawerHeader>
              <DrawerTitle>Online Payments</DrawerTitle>
              <DrawerDescription>Components</DrawerDescription>
            </DrawerHeader>
            <div className="space-y-2">
              {!paymentMethodsResponse ? (
                <h1> no response </h1>
              ) : (
                paymentMethodsResponse &&
                paymentMethodsResponse.paymentMethods.map((paymentMethod: any) => (
                  <ExpandableCards
                    key={paymentMethod.type}
                    paymentMethodName={paymentMethod.name}
                    paymentMethodType={paymentMethod.type}
                  />
                ))
              )}
            </div>
          </DrawerContent>
        </Drawer>
      </span>
      <div className="mt-1">
        {buttons.map((button) => (
          <Button
            key={button.name}
            variant="ghost"
            size="icon"
            className={`mt-2 rounded-none ${
              section === button.name
                ? "border-[1px] border-adyen "
                : "hover:border-[1px] hover:border-adyen hover:border-dotted"
            }`}
            onClick={() => setSection(button.name)}
          >
            {button.icon}
          </Button>
        ))}
      </div>
    </span>
  );
};

export default Sidebar;
