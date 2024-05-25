const Topbar = (props: any) => {
  return (
    <span
      className="absolute top-0 left-[var(--sidebar-width)] h-[var(--topbar-width)] border-b-4"
      style={{ width: `calc(100vw - var(--sidebar-width))` }}
    ></span>
  );
};

export default Topbar;
