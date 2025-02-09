import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import ScienceIcon from "@mui/icons-material/Science";
import TitleIcon from "@mui/icons-material/Title";
import BuildIcon from "@mui/icons-material/Build";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AccountBoxIcon from '@mui/icons-material/AccountBox';

const FooterBar = (props: any) => {
  const { integration } = props;
  const company = process.env.NEXT_PUBLIC_COMPANY_NAME;
  const merchant = process.env.NEXT_PUBLIC_LIVE_MERCHANT_ACCOUNT;
  const { variantName, title } = useSelector(
    (state: RootState) => state.sandbox
  );
  const footerButtons = [
    {
      name: "Company",
      icon: <StorefrontIcon className="!text-foreground !text-[1rem]" />,
      message: `Company: ${company ? company : "default"}`,
    },
    {
      name: "Merchant",
      icon: <AccountBoxIcon className="!text-foreground !text-[1rem]" />,
      message: `Account: ${merchant ? merchant : "default"}`,
    },
    {
      name: "Integration",
      icon: <BuildIcon className="!text-foreground !text-[1rem]" />,
      message: `Integration: ${integration ? integration : "default"}`,
    },
    {
      name: "Variant",
      icon: <ScienceIcon className="!text-foreground !text-[1rem]" />,
      message: `Variant: ${variantName ? variantName : "default"}`,
    },
    {
      name: "Formula",
      icon: <TitleIcon className="!text-foreground !text-[1rem]" />,
      message: `Formula: ${title ? title : "default"}`,
    },
  ];
  return (
    <span
      className="absolute bottom-0 border-y-2 left-[var(--sidebar-width)] h-[var(--footerbar-width)] flex justify-end px-2"
      style={{ width: `calc(100vw - var(--sidebar-width))` }}
    >
      {footerButtons.map((button, index) => (
        <div
          key={index}
          className="flex h-[100%] items-end max-w-[20rem] py-[0.2rem] pr-7"
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
