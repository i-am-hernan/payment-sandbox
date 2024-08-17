import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Enum = (props: any) => {
  const { title, value, set, onChange } = props;

  return (
    <div className="p-1">
      <Select
        value={value}
        onValueChange={(value) => {
          onChange({
            adyenWebVersion: value,
          });
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder={title} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {set.map((item: string) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Enum;
