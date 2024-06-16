import { Button } from "@/components/ui/button";

const Topbar = (props: any) => {
  return (
    <span
      className="absolute top-0 left-[var(--sidebar-width)] h-[var(--topbar-width)] border-b-4 flex items-center justify-end pr-2"
      style={{ width: `calc(100vw - var(--sidebar-width))` }}
    >
      <Button key="run" variant="default" size="sm" className="px-4">
        Run
      </Button>
    </span>
  );
};

export default Topbar;
