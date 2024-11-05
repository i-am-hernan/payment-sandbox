import Enum from "@/components/custom/sandbox/editors/Enum";

const Version = (props: any) => {
  const { label, value, options, onChange } = props;
  return (
    <div>
      <p className="border-b-2 flex text-sm">
        <span className="border-r-2 px-2 py-[1px] text-foreground">version</span>
      </p>
      <div className="border-b-2 px-1 py-3">
        <p className="text-xs pb-2 px-1 text-foreground">
          {`Change the version of ${label} to test different scenarios.`}
        </p>
        <Enum
          value={value}
          set={options}
          title="Checkout API Version"
          onChange={(value: any) => {
            onChange(value);
          }}
        />
      </div>
    </div>
  );
};

export default Version;
