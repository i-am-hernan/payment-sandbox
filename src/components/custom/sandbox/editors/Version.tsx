import Enum from "@/components/custom/sandbox/editors/Enum";

const Version = (props: any) => {
  const { label, value, options, onChange } = props;
  return (
    <div>
      <span className="border-b-2 flex text-sm">
        <span className="border-r-2 p-[3px] text-foreground">
          <p className="inline-block border border-foreground px-2 text-sm">
            version
          </p>
        </span>
      </span>
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
