import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Enum = (props: any) => {
  const { title, value, set, onChange, disabled } = props;
  return (
    <div className="p-1 bg-background text-foreground">
      <Select
        value={value}
        onValueChange={(value) => {
          onChange(value);
        }}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder={title} />
        </SelectTrigger>
        <SelectContent className="!dark">
          <SelectGroup>
            {set.map((value: any) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Enum;
