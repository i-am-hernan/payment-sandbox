import AutorenewIcon from "@mui/icons-material/Autorenew";

const Loading = (props: any) => {
  // need to combine className with the props
  return (
    <div className={`flex justify-center space-x-2 items-center text-center h-[100%] ${props.className}`}>
      <div className="animate-spin text-xs">
        <AutorenewIcon className="!w-3 !h-3" />
      </div>
      <div className="text-xs">loading...</div>
    </div>
  );
};

export default Loading;