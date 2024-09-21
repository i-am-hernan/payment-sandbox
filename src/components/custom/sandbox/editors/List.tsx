import { parseStringWithLinks } from "@/components/custom/utils/Utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { String } from "@/components/custom/sandbox/editors/String";

const List = (props: any) => {
  const { properties, selectedProperties, values, setValues, onChange } = props;
  return (
    <Accordion
      type="multiple"
      className="w-full"
      value={selectedProperties}
      onValueChange={onChange}
    >
      <p className="border-b-2 flex text-sm sticky top-0 bg-white z-10">
        <span className="border-r-2 px-2 py-[1px]">parameters</span>
      </p>
      {properties &&
        Object.keys(properties).map((property: any) => (
          <AccordionItem
            key={property}
            value={property}
            className="hover:no-underline px-3"
          >
            <AccordionTrigger className="px-1 py-3">
              <p className="text-sm">{property}</p>
              <p className="font-mono text-xs flex-grow text-left pl-2">
                {properties[property].type}
              </p>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-xs pb-2 px-1">
                {parseStringWithLinks(properties[property].description)}
              </p>
              {properties[property].type === "string" && (
                <String
                  value={values[property] ? values[property] : ""}
                  onChange={(value: any) => {
                    if (value) {
                      setValues({ ...values, [property]: value });
                    } else {
                      setValues({ ...values, [property]: "" });
                    }
                  }}
                />
              )}
              {properties[property].type === "integer" && (
                <String
                  value={values[property] ? values[property] : 0}
                  onChange={(value: any) => {
                    if (value) {
                      setValues({ ...values, [property]: parseInt(value) });
                    } else {
                      setValues({ ...values, [property]: 0 });
                    }
                  }}
                />
              )}
              {/* {properties[property].type === "array" && (
                <String
                  value={values[property]}
                  onChange={(value: any) => {
                    setValues({ ...values, [property]: value });
                  }}
                />
              )} */}
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  );
};

export default List;
