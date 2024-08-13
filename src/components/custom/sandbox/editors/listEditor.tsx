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
      <div className="px-2 py-3">
        <p className="text-sm pb-1 pl-1">{versionTitle}</p>
        <p className="text-sm pb-3 pl-1">
          Find the release notes for the version you are using here.
        </p>
        <Select
          value={version}
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
