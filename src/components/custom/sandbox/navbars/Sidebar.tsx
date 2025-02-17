import { ExpandableCards } from "@/components/custom/sandbox/navbars/ExpandableCards";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
import { RequestOptions } from "@/hooks/useApi";
import { formulaActions, sandboxActions, userActions } from "@/store/reducers";
import { clearUrlParams } from "@/utils/utils";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import LanguageIcon from "@mui/icons-material/Language";
import SettingsIcon from "@mui/icons-material/Settings";
import WidgetsIcon from "@mui/icons-material/Widgets";
import Tooltip from "@mui/material/Tooltip";
import { ChevronDown, FlaskConical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Loading from "../../utils/Loading";

interface SideTab {
  name: string;
  icon: JSX.Element;
  unsavedChanges: any;
  hotKey: string;
  ref: any;
}

const { updateTheme, updateView } = userActions;
const { updateVariantName } = sandboxActions;
const { clearOnDeckInfo } = formulaActions;

const Sidebar = (props: any) => {
  const {
    section,
    setSection,
    unsavedChanges,
    merchantAccount,
    variant,
    view,
    integration,
  } = props;
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
  const dispatch = useDispatch();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [paymentMethods, setPaymentMethods] = useState<{
    data: any;
    loading: boolean;
    error: any;
  }>({
    data: null,
    loading: true,
    error: null,
  });

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
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    merchantAccount && fetchPaymentMethods(merchantAccount);
  }, [merchantAccount]);

  useEffect(() => {
    paymentMethods.data?.forEach((paymentMethod: any) => {
      if (paymentMethod.type === variant) {
        dispatch(updateVariantName(paymentMethod.name));
      } else if (variant === "dropin") {
        dispatch(updateVariantName("Dropin"));
      }
    });
  }, [paymentMethods.data, variant]);

  const sideTabs: Array<SideTab> = [
    {
      name: "Server",
      hotKey: "⌘ + i",
      icon: (
        <div className="relative flex flex-col items-center justify-center">
          <CloudQueueIcon className="!text-foreground !text-[20px]" />
          <p className="font-mono text-[0.6rem] text-foreground bg-background flex leading-none mt-[3px]">
            API
          </p>
        </div>
      ),
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
      icon: (
        <div className="relative flex flex-col items-center justify-center">
          <LanguageIcon className="!text-foreground !text-[20px]" />
          <p className="font-mono text-[0.6rem] text-foreground bg-background flex leading-none mt-[3px]">
            SDK
          </p>
        </div>
      ),
      unsavedChanges: {
        htmlUnsavedChanges,
        styleUnsavedChanges,
        jsUnsavedChanges,
      },
      ref: clientButtonRef,
    },
  ];

  const fetchPaymentMethods = async (merchantAccount: string) => {
    try {
      const requestOptions: RequestOptions = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ merchantAccount: merchantAccount }),
      };
      const domain = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(
        `${domain}/api/checkout/v71/paymentMethods`,
        {
          method: requestOptions.method,
          headers: requestOptions.headers,
          body: requestOptions.body,
        }
      );
      const data = await response.json();
      if (data.status >= 400) {
        throw new Error(data.message);
      } else {
        setPaymentMethods({
          data: data.paymentMethods,
          loading: false,
          error: null,
        });
      }
    } catch (error: any) {
      setPaymentMethods({
        data: null,
        loading: false,
        error: error.message,
      });
    }
  };

  const totalUnsavedChanges = (unsavedChanges: any) => {
    return Object.values(unsavedChanges).filter((value) => value).length;
  };
  return (
    <div ref={sidebarRef}>
      <span className="absolute top-0 left-0 w-[var(--sidebar-width)] h-[100%] border-2 text-center">
        <div className="flex flex-col justify-between h-full">
          <div>
            <div>
              <Drawer direction="left">
                <DrawerTrigger className="mt-[0.7rem] p-1 rounded-none border-[1px] border-transparent hover:border-[1px] hover:border-foreground hover:border-dotted hover:bg-accent hover:text-accent-foreground">
                  <div className="flex flex-col items-center justify-center">
                    <FlaskConical className="!text-[20px] text-foreground" />
                    <p className="font-mono text-[0.6rem] text-foreground bg-background flex leading-none mt-[3px]">
                      CREATE
                    </p>
                  </div>
                </DrawerTrigger>
                <DrawerPortal container={sidebarRef.current}>
                  <DrawerOverlay />
                  <DrawerContent className="h-full w-[20vw] rounded-none border-r-2 border-t-2 border-b-2">
                    <DrawerHeader className="pb-2">
                      <DrawerTitle className="text-foreground text-sm py-0">
                        {paymentMethods && paymentMethods.data && (
                          <span className="flex items-center">
                            <ChevronDown className="h-4 w-4 pr-1 text-grey" />
                            <span className="display-inline">
                              Online Payments
                            </span>
                          </span>
                        )}
                      </DrawerTitle>
                    </DrawerHeader>
                    {paymentMethods.loading && (
                      <div className="h-[100%] w-[100%]">
                        <Loading />
                      </div>
                    )}
                    {paymentMethods.error && (
                      <div className="h-[100%] w-[100%]">
                        <Alert variant="destructive">
                          <AlertTitle>
                            {"Error: Unable to save Payment methods"}
                          </AlertTitle>
                          <AlertDescription>
                            {paymentMethods.error}
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}
                    <div>
                      {paymentMethods?.data && (
                        <ExpandableCards
                          paymentMethodName={"Dropin"}
                          paymentMethodType={"dropin"}
                          defaultExpanded={variant === "dropin"}
                          defaultIntegration={integration}
                          onItemClick={() => {
                            dispatch(clearOnDeckInfo());
                          }}
                        />
                      )}
                      {paymentMethods?.data?.map((paymentMethod: any) => (
                        <ExpandableCards
                          key={paymentMethod.type}
                          paymentMethodName={paymentMethod.name}
                          paymentMethodType={paymentMethod.type}
                          defaultExpanded={variant === paymentMethod.type}
                          defaultIntegration={integration}
                          onItemClick={() => {
                            dispatch(clearOnDeckInfo());
                          }}
                        />
                      ))}
                    </div>
                  </DrawerContent>
                </DrawerPortal>
              </Drawer>
            </div>
            {sideTabs.map(
              (tab, index): any =>
                view !== "demo" && (
                  <span className="relative" key={index}>
                    <Tooltip
                      title={`${tab.name} (${tab.hotKey})`}
                      placement="right-start"
                    >
                      <Button
                        key={tab.name}
                        variant="ghost"
                        size="icon"
                        ref={tab.ref}
                        className={`mt-5 rounded-none ${
                          section === tab.name
                            ? "border-[1px] border-foreground"
                            : "hover:border-[1px] hover:border-foreground hover:border-dotted"
                        }`}
                        onClick={() => setSection(tab.name)}
                      >
                        {tab.icon}
                      </Button>
                    </Tooltip>
                    {totalUnsavedChanges(tab.unsavedChanges) !== 0 && (
                      <div className="w-4 h-4 border border-foreground rounded-full absolute -top-2 -right-2 transform bg-background text-foreground text-xxs flex items-center justify-center">
                        {totalUnsavedChanges(tab.unsavedChanges)}
                      </div>
                    )}
                  </span>
                )
            )}
          </div>
          <div className="pb-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 pt-1 rounded-none border-none hover:border-[1px] hover:border-foreground hover:border-dotted">
                <SettingsIcon className="!text-foreground !text-[20px]" />
              </DropdownMenuTrigger>
              <DropdownMenuPortal container={sidebarRef.current}>
                <DropdownMenuContent side="top" className="ml-1 rounded-none">
                  <DropdownMenuLabel className="text-xs">
                    Settings
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="text-xs rounded-none border-transparent border-[1px] hover:border-foreground hover:border-dotted">
                      <p className="px-2">Shortcuts</p>
                      <DropdownMenuShortcut>⇧⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuGroup>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="text-xs rounded-none border-transparent border-[1px] hover:border-foreground hover:border-dotted">
                        <p className="px-2">Theme</p>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="ml-1 rounded-none">
                        <DropdownMenuItem
                          className="text-xs rounded-none border-transparent border-[1px] hover:border-foreground hover:border-dotted"
                          onClick={() => {
                            dispatch(updateTheme("dark"));
                          }}
                        >
                          <span>Dark</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-xs rounded-none border-transparent border-[1px] hover:border-foreground hover:border-dotted"
                          onClick={() => {
                            dispatch(updateTheme("light"));
                          }}
                        >
                          <span>Light</span>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="text-xs rounded-none border-transparent border-[1px] hover:border-foreground hover:border-dotted">
                        <p className="px-2">View</p>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="ml-1 rounded-none">
                        <DropdownMenuItem
                          className="text-xs rounded-none border-transparent border-[1px] hover:border-foreground hover:border-dotted"
                          onClick={() => {
                            dispatch(updateView("developer"));
                            clearUrlParams(["view"]);
                          }}
                        >
                          <span>Developer</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-xs rounded-none border-transparent border-[1px] hover:border-foreground hover:border-dotted"
                          onClick={() => {
                            dispatch(updateView("preview"));
                            clearUrlParams(["view"]);
                          }}
                        >
                          <span>Preview</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-xs rounded-none border-transparent border-[1px] hover:border-foreground hover:border-dotted"
                          onClick={() => {
                            dispatch(updateView("demo"));
                            clearUrlParams(["view"]);
                          }}
                        >
                          <span>Demo</span>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenu>
          </div>
        </div>
      </span>
    </div>
  );
};

export default Sidebar;
