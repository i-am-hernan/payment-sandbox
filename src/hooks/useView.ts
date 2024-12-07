import { userActions } from "@/store/reducers";
import { RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const { updateView } = userActions;

export const useView = (viewParam: any) => {
  const dispatch = useDispatch();
  const view = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (viewParam && ["developer", "product", "user"].includes(viewParam)) {
      dispatch(updateView(viewParam as "developer" | "product" | "user"));
    }
  }, [viewParam]);  
  return view;
};


