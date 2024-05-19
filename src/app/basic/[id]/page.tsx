"use client";

import AdyenComponent from "../../../components/Adyen/AdyenComponent";
import AdyenState from "../../../components/Adyen/AdyenState";
import CSS from "../../../components/Frontend/CSS";
import HTML from "../../../components/Frontend/HTML";
import JS from "../../../components/Frontend/JS";
import SandboxLayout from "../../../components/Sandbox/Layout";
import TabbedMain from "../../../components/Sandbox/TabbedMain";
import CodeIcon from "@mui/icons-material/Code";
import StorageIcon from "@mui/icons-material/Storage";
import WebhookIcon from "@mui/icons-material/Webhook";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface SectionType {
  section: "client" | "server" | "webhooks";
}

const Page: any = () => {
  const [section, setSection] = useState("client");

  return (
    <div>
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
      <span
        className="absolute top-0 left-[var(--sidebar-width)] h-[var(--topbar-width)] border-b-4"
        style={{ width: `calc(100vw - var(--sidebar-width))` }}
      ></span>
      {section === "client" && (
        <SandboxLayout
          main={
            <TabbedMain
              titles={["HTML", "CSS", "JS"]}
              contents={[<HTML key={"HTML"}/>, <CSS key={"CSS"}/>, <JS key={"JS"}/>]}
            />
          }
          topRight={AdyenComponent}
          bottomRight={AdyenState}
        />
      )}
      {section === "server" && (
        <SandboxLayout
          main={
            <TabbedMain
              titles={["/Sessions"]}
              contents={[<HTML key={"Sessions"}/>]}
            />
          }
          topRight={AdyenComponent}
          bottomRight={AdyenState}
        />
      )}
      {section === "webhooks" && (
        <SandboxLayout
          main={
            <TabbedMain
              titles={["Events"]}
              contents={[<HTML key={"HTML"}/>]}
            />
          }
          topRight={AdyenComponent}
          bottomRight={AdyenState}
        />
      )}
    </div>
  );
};

export default Page;
