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
import MenuIcon from "@mui/icons-material/Menu";
import StorageIcon from "@mui/icons-material/Storage";
import WebhookIcon from "@mui/icons-material/Webhook";

interface SideTab {
  name: string;
  icon: JSX.Element;
  unsavedChanges: any;
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

  const sideTabs: Array<SideTab> = [
    {
      name: "server",
      icon: <StorageIcon />,
      unsavedChanges: {
        paymentMethodsUnsavedChanges,
        paymentsUnsavedChanges,
        paymentsDetailsUnsavedChanges,
      },
    },
    {
      name: "client",
      icon: <LanguageIcon />,
      unsavedChanges: {
        htmlUnsavedChanges,
        styleUnsavedChanges,
        jsUnsavedChanges,
      },
    },
    {
      name: "webhooks",
      icon: <WebhookIcon />,
      unsavedChanges: {
        eventsUnsavedChanges,
      },
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
            <MenuIcon />
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
            <Button
              key={tab.name}
              variant="ghost"
              size="icon"
              className={`mt-2 rounded-none ${
                section === tab.name
                  ? "border-[1px] border-adyen "
                  : "hover:border-[1px] hover:border-adyen hover:border-dotted"
              }`}
              onClick={() => setSection(tab.name)}
            >
              {tab.icon}
            </Button>
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
