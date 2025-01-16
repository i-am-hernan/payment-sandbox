import { Slider } from "@/components/ui/slider";

const FomulaSlider = (props: any) => {
  const { value, onChange, max } = props;
  return (
    <Slider
      max={max}
      step={1}
      value={[value]}
      onValueChange={(value) => {
        onChange(value.pop());
      }}
    />
  );
};

export default FomulaSlider;
