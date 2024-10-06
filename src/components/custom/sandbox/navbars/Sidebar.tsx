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
import LanguageIcon from "@mui/icons-material/Language";
import WidgetsIcon from "@mui/icons-material/Widgets";
import StorageIcon from "@mui/icons-material/Storage";
import WebhookIcon from "@mui/icons-material/Webhook";
import Tooltip from "@mui/material/Tooltip";
import { useEffect, useRef } from "react";

interface SideTab {
  name: string;
  icon: JSX.Element;
  unsavedChanges: any;
  hotKey: string;
  ref: any;
}

const Sidebar = (props: any) => {
  const { section, setSection, unsavedChanges } = props;
  const {
    html: htmlUnsavedChanges,
    style: styleUnsavedChanges,
    js: jsUnsavedChanges,
    paymentMethods: paymentMethodsUnsavedChanges,
    payments: paymentsUnsavedChanges,
    paymentsDetails: paymentsDetailsUnsavedChanges,
    events: eventsUnsavedChanges,
  } = unsavedChanges;

  const serverButtonRef = useRef<HTMLButtonElement>(null);
  const clientButtonRef = useRef<HTMLButtonElement>(null);
  const webhookButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "i") {
        event.preventDefault();
        if (serverButtonRef.current) {
          serverButtonRef.current.click();
        }
      } else if ((event.ctrlKey || event.metaKey) && event.key === "j") {
        event.preventDefault();
        if (clientButtonRef.current) {
          clientButtonRef.current.click();
        }
      } else if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        if (webhookButtonRef.current) {
          webhookButtonRef.current.click();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const sideTabs: Array<SideTab> = [
    {
      name: "Server",
      hotKey: "⌘ + i",
      icon: <StorageIcon sx={{ fontSize: "20px" }} />,
      unsavedChanges: {
        paymentMethodsUnsavedChanges,
        paymentsUnsavedChanges,
        paymentsDetailsUnsavedChanges,
      },
      ref: serverButtonRef,
    },
    {
      name: "Client",
      hotKey: "⌘ + j",
      icon: <LanguageIcon sx={{ fontSize: "20px" }} />,
      unsavedChanges: {
        htmlUnsavedChanges,
        styleUnsavedChanges,
        jsUnsavedChanges,
      },
      ref: clientButtonRef,
    },
    {
      name: "Webhooks",
      hotKey: "⌘ + k",
      icon: <WebhookIcon sx={{ fontSize: "20px" }} />,
      unsavedChanges: {
        eventsUnsavedChanges,
      },
      ref: webhookButtonRef,
    },
  ];

  const totalUnsavedChanges = (unsavedChanges: any) => {
    return Object.values(unsavedChanges).filter((value) => value).length;
  };
  return (
    <span className="absolute top-0 left-0 w-[var(--sidebar-width)] h-full border-2 text-center pt-3">
      <span>
        <Drawer direction="left">
          <DrawerTrigger>
            <WidgetsIcon sx={{ fontSize: "20px" }} />
          </DrawerTrigger>
          <DrawerContent className="h-full w-[20vw]">
            <DrawerHeader>
              <DrawerTitle>Online Payments</DrawerTitle>
              <DrawerDescription>Components</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>Theme switch</DrawerFooter>
          </DrawerContent>
        </Drawer>
      </span>
      <div className="mt-1">
        {sideTabs.map((tab, index): any => (
          <span className="relative" key={index}>
            <Tooltip title={`${tab.name} (${tab.hotKey})`}>
              <Button
                key={tab.name}
                variant="ghost"
                size="icon"
                ref={tab.ref}
                className={`mt-2 rounded-none ${
                  section === tab.name
                    ? "border-[1px] border-adyen "
                    : "hover:border-[1px] hover:border-adyen hover:border-dotted"
                }`}
                onClick={() => setSection(tab.name)}
              >
                {tab.icon}
              </Button>
            </Tooltip>
            {totalUnsavedChanges(tab.unsavedChanges) !== 0 && (
              <div className="w-4 h-4 border border-black rounded-full absolute bottom-1 right-1 transform translate-x-1/2 translate-y-1/2 bg-white text-black text-xxs">
                {totalUnsavedChanges(tab.unsavedChanges)}
              </div>
            )}
          </span>
        ))}
      </div>
    </span>
  );
};

export default Sidebar;
