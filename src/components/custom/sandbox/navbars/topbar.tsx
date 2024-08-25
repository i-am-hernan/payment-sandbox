import { Button } from "@/components/ui/button";
import { formulaActions } from "@/store/reducers";
import { useDispatch, useSelector } from "react-redux";
import LoopIcon from "@mui/icons-material/Loop";
import { RootState } from "@/store/store";

const { updateRun, updateIsRedirect, clearOnDeckInfo, resetUnsavedChanges } =
  formulaActions;

const Topbar = (props: any) => {
  const { unsavedChanges } = useSelector((state: RootState) => state.formula);
  const dispatch = useDispatch();
  const totalUnsavedChanges = Object.values(unsavedChanges).filter(
    (value) => value
  ).length;

  return (
    <span
      className="absolute top-0 left-[var(--sidebar-width)] h-[var(--topbar-width)] border-b-2 flex items-center justify-end pr-2"
      style={{ width: `calc(100vw - var(--sidebar-width))` }}
    >
      <div className="mr-2 relative">
        <span className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black text-xs rounded-full">
          {totalUnsavedChanges !== 0 && totalUnsavedChanges}
        </span>
        <Button
          key="run"
          variant="outline"
          size="sm"
          className="px-2 pt-0 pb-0"
          onClick={() => {
            dispatch(clearOnDeckInfo());
          }}
        >
          <LoopIcon sx={{ fontSize: "16px" }} />
        </Button>
      </div>
      <Button
        key="run"
        variant="default"
        size="sm"
        className="px-4"
        onClick={() => {
          const clearRedirectInfo = () => {
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname
            );
          };
          clearRedirectInfo();
          dispatch(updateIsRedirect(false));
          dispatch(updateRun());
          dispatch(resetUnsavedChanges());
        }}
      >
        Run
      </Button>
    </span>
  );
};

export default Topbar;
