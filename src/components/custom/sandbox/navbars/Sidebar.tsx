import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
import SettingsIcon from "@mui/icons-material/Settings";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import ShortcutIcon from "@mui/icons-material/Shortcut";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { userActions } from "@/store/reducers";

interface SideTab {
  name: string;
  icon: JSX.Element;
  unsavedChanges: any;
  hotKey: string;
  ref: any;
}

const { updateTheme } = userActions;

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
  const dispatch = useDispatch();

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
      icon: <StorageIcon className="!text-foreground !text-[20px]" />,
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
      icon: <LanguageIcon className="!text-foreground !text-[20px]" />,
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
      icon: <WebhookIcon className="!text-foreground !text-[20px]" />,
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
    <div>
      <span className="absolute top-0 left-0 w-[var(--sidebar-width)] h-[100%] border-2 text-center">
        <div className="flex flex-col justify-between h-full">
          <div>
            <div>
              <Drawer direction="left">
                <DrawerTrigger className="pt-3">
                  <WidgetsIcon className="!text-foreground !text-[20px]" />
                </DrawerTrigger>
                <DrawerContent className="h-full w-[20vw]">
                  <DrawerHeader>
                    <DrawerTitle>Online Payments</DrawerTitle>
                    <DrawerDescription>Components</DrawerDescription>
                  </DrawerHeader>
                  <DrawerFooter>Theme switch</DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
            {sideTabs.map((tab, index): any => (
              <span className="relative" key={index}>
                <Tooltip title={`${tab.name} (${tab.hotKey})`} placement="right-start">
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
                  <div className="w-4 h-4 border border-foreground rounded-full absolute bottom-1 right-1 transform translate-x-1/2 translate-y-1/2 bg-background text-foreground text-xxs">
                    {totalUnsavedChanges(tab.unsavedChanges)}
                  </div>
                )}
              </span>
            ))}
          </div>
          <div className="pb-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 pt-1 rounded-none border-none hover:border-[1px] hover:border-adyen hover:border-dotted">
                <SettingsIcon className="!text-foreground !text-[20px]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="">
                <DropdownMenuLabel>Setting</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="text-xs">
                    <ShortcutIcon className="text-sm" />
                    <p className="px-2">Shortcuts</p>
                    <DropdownMenuShortcut>⇧⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="text-xs">
                      <DarkModeIcon className="text-sm" />
                      <p className="px-2">Theme</p>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="">
                        <DropdownMenuItem
                          className="text-xs"
                          onClick={() => {
                            dispatch(updateTheme("dark"));
                          }}
                        >
                          <span>Dark</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-xs"
                          onClick={() => {
                            dispatch(updateTheme("light"));
                          }}
                        >
                          <span>Light</span>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </span>
    </div>
  );
};

export default Sidebar;
