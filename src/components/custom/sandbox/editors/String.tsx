import { Input } from "@/components/ui/input";

export const String = (props: any) => {
  const { value, onChange, schema } = props;

  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
