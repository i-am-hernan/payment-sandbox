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
    <div className="p-1 text-foreground">
      <Select
        value={value}
        onValueChange={(value) => {
          onChange(value);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder={title} />
        </SelectTrigger>
        <SelectContent className="text-background bg-foreground">
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
