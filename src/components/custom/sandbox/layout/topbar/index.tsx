import { Button } from "@/components/ui/button";
import { currentFormulaActions } from "@/store/reducers";
import { useDispatch } from "react-redux";

const { updateRunBuild, updateIsRedirect } = currentFormulaActions;

const Topbar = (props: any) => {
  const dispatch = useDispatch();

  return (
    <span
      className="absolute top-0 left-[var(--sidebar-width)] h-[var(--topbar-width)] border-b-2 flex items-center justify-end pr-2"
      style={{ width: `calc(100vw - var(--sidebar-width))` }}
    >
      <Button
        key="run"
        variant="default"
        size="sm"
        className="px-4"
        onClick={() => {
          window.history.replaceState({}, document.title, window.location.pathname);
          dispatch(updateIsRedirect(false));
          dispatch(updateRunBuild());
        }}
      >
        Run
      </Button>
    </span>
  );
};

export default Topbar;
