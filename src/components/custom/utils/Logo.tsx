import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center font-bold bg-secondary rounded-lg px-2 py-[0.1rem]">
      <h6 className="text-md font-bold text-adyen px-[0.1rem]">Checkout</h6>
      <span className="text-md text-primary font-bold">Lab</span>
    </Link>
  );
};