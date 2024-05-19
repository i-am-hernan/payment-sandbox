import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/drawer";
import CodeIcon from "@mui/icons-material/Code";
import MenuIcon from "@mui/icons-material/Menu";
import StorageIcon from "@mui/icons-material/Storage";
import WebhookIcon from "@mui/icons-material/Webhook";

const Sidebar = (props: any) => {
  const { section, setSection } = props;
  return (
    <span className="absolute top-0 left-0 w-[var(--sidebar-width)] h-full border-r-4 text-center pt-2">
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
      <div className="mt-[52px]">
        <Button
          variant="outline"
          size="icon"
          className={`mt-2 ${
            section === "client"
              ? "text-[var(--custom-accent)] hover:text-[var(--custom-accent)]"
              : "hover:text-current"
          }`}
          onClick={() => setSection("client")}
        >
          <CodeIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={`mt-2 ${
            section === "server"
              ? "text-[var(--custom-accent)] hover:text-[var(--custom-accent)]"
              : "hover:text-current"
          }`}
          onClick={() => setSection("server")}
        >
          <StorageIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={`mt-2 ${
            section === "webhooks"
              ? "text-[var(--custom-accent)] hover:text-[var(--custom-accent)]"
              : "hover:text-current"
          }`}
          onClick={() => setSection("webhooks")}
        >
          <WebhookIcon />
        </Button>
      </div>
    </span>
  );
};

export default Sidebar;