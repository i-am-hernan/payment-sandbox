import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import ScienceIcon from "@mui/icons-material/Science";
import TitleIcon from "@mui/icons-material/Title";
import BuildIcon from "@mui/icons-material/Build";
import StorefrontIcon from "@mui/icons-material/Storefront";

const FooterBar = (props: any) => {
  const { integration } = props;
  const company = process.env.NEXT_PUBLIC_COMPANY_NAME;
  const { variantName, title } = useSelector(
    (state: RootState) => state.sandbox
  );
  const footerButtons = [
    {
      name: "Company",
      icon: <StorefrontIcon className="!text-foreground !text-[1rem]" />,
      message: `${company ? company : "default"}`,
    },
    {
      name: "Integration",
      icon: <BuildIcon className="!text-foreground !text-[1rem]" />,
      message: `${integration ? integration : "default"}`,
    },
    {
      name: "Variant",
      icon: <ScienceIcon className="!text-foreground !text-[1rem]" />,
      message: `${variantName ? variantName : "default"}`,
    },
    {
      name: "Formula",
      icon: <TitleIcon className="!text-foreground !text-[1rem]" />,
      message: `${title ? title : "default"}`,
    },
  ];
  return (
    <span
      className="absolute bottom-0 border-t-2 left-[var(--sidebar-width)] h-[var(--footerbar-width)] flex justify-end px-2"
      style={{ width: `calc(100vw - var(--sidebar-width))` }}
    >
      {footerButtons.map((button, index) => (
        <div
          key={index}
          className="flex h-[100%] items-end max-w-[15rem] py-[0.2rem] pr-5"
        >
          {button.icon}
          <p className="text-[0.6rem] text-foreground pl-[0.1rem] ">
            {button.message.toUpperCase()}
          </p>
        </div>
      ))}
    </span>
  );
};

export default FooterBar;
