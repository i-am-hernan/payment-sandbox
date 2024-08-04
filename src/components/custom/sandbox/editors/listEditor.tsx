import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ListEditor = (props: any) => {
  const { versionTitle, version, versions, onChange } = props;

  return (
    <div>
      <p className="border-b-2 flex text-sm">
        <span className="border-r-2 px-2 py-[1px]">version</span>
      </p>
      <div className="px-2 py-3">
        <p className="text-sm pb-1 pl-1">{versionTitle}</p>
        <p className="text-sm pb-3 pl-1">
          Find the release notes for the version you are usin here.
        </p>
        <Select
          defaultValue={version}
          onValueChange={(value) => {
            onChange({
              adyenWebVersion: value,
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={versionTitle} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {versions.map((item: string) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ListEditor;
