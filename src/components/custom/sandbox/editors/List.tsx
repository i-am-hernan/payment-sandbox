import { parseStringWithLinks } from "@/components/custom/utils/Utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const List = (props: any) => {
  const { list, values, onChange } = props;
  return (
    <Accordion
      type="multiple"
      className="w-full"
      value={values}
      onValueChange={(updatedValues: any) => {
        const isNewProperty = values.length < updatedValues.length;
        if (isNewProperty) {
          const latestKey = updatedValues.pop();
          const latestValue = list[latestKey];
          let newProperty = null;
          if (latestValue.type === "string") {
            newProperty = { [latestKey]: "" };
          } else if (latestValue.type === "boolean") {
            newProperty = { [latestKey]: true };
          } else if (latestValue.type === "array") {
            newProperty = { [latestKey]: [] };
          }
          onChange(newProperty);
        } else {
          const removedProperty: any = values
            .filter((i: String) => {
              return updatedValues.indexOf(i);
            })
            .pop();

          const tmpValue = { ...values };
          delete tmpValue[removedProperty];
          onChange(tmpValue);
        }
      }}
    >
      <p className="border-t-2 border-b-2 flex text-sm sticky top-0 bg-white z-10">
        <span className="border-r-2 px-2 py-[1px]">parameters</span>
      </p>
      {list &&
        Object.keys(list).map((property: any) => (
          <AccordionItem
            key={property}
            value={property}
            className="hover:no-underline px-3"
          >
            <AccordionTrigger className="px-1 py-3">
              <p className="text-sm">{property}</p>
              <p className="font-mono text-xs flex-grow text-left pl-2">
                {list[property].type}
              </p>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-xs pb-2 px-1">
                {parseStringWithLinks(list[property].description)}
              </p>
              {/* {properties[property].type === "string" && <String />} */}
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  );
};

export default List;
