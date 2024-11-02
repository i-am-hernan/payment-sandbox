import Array from "@/components/custom/sandbox/editors/Array";
import Enum from "@/components/custom/sandbox/editors/Enum";
import { String } from "@/components/custom/sandbox/editors/String";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const OpenSdkList = (props: any) => {
  const {
    openSdk,
    selectedProperties,
    properties,
    values,
    setValues,
    onChange,
  } = props;

  return (
    <Accordion
      type="multiple"
      className="w-full"
      value={selectedProperties}
      onValueChange={onChange}
    >
      {properties &&
        Object.keys(properties).map((property: any) => (
          <AccordionItem
            key={property}
            value={property}
            className="hover:no-underline"
          >
            <AccordionTrigger className="px-4 py-3">
              <p className="text-sm text-foreground">{property}</p>
              <p className="font-mono text-xs flex-grow text-left">
                {properties[property].type && (
                  <span className="pl-2 text-grey">
                    {properties[property].type}
                  </span>
                )}
                {properties[property]?.required && (
                  <span className="pl-2 text-warning">Required</span>
                )}
              </p>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-4">
                <p className="text-xs pb-2 text-foreground">
                  {properties[property].description}
                </p>
                {properties[property].type === "string" && (
                  <String
                    value={values[property] ? values[property] : ""}
                    onChange={(value: any) => {
                      let tidyValue = value !== undefined ? value : "";
                      setValues(
                        { ...values, [property]: tidyValue },
                        property,
                        tidyValue,
                        "string"
                      );
                    }}
                  />
                )}
                {properties[property].type === "enum" && (
                  <Enum
                    value={
                      values[property] !== undefined ? values[property] : ""
                    }
                    onChange={(value: any) => {
                      let tidyValue = value !== undefined ? value : "";
                      setValues(
                        { ...values, [property]: tidyValue },
                        property,
                        tidyValue,
                        "string"
                      );
                    }}
                    set={properties[property].values.map(
                      (value: any, i: any) => {
                        return value.replace(/'/g, "");
                      }
                    )}
                  />
                )}
                {properties[property].type === "integer" && (
                  <String
                    value={values[property] ? values[property] : 0}
                    onChange={(value: any) => {
                      let tidyValue = value !== undefined ? parseInt(value) : 0;
                      setValues(
                        { ...values, [property]: tidyValue },
                        property,
                        tidyValue,
                        "integer"
                      );
                    }}
                  />
                )}
                {properties[property].type === "boolean" && (
                  <Enum
                    value={
                      values[property] !== undefined
                        ? values[property].toString()
                        : ""
                    }
                    onChange={(value: any) => {
                      let tidyValue = value === true ? true : false;
                      setValues(
                        { ...values, [property]: tidyValue },
                        property,
                        tidyValue,
                        "boolean"
                      );
                    }}
                    set={["true", "false"]}
                  />
                )}
                {properties[property].type === "array" && (
                  <Array
                    value={values[property] ? values[property] : []}
                    onChange={(value: any) => {
                      let tidyValue = value !== undefined ? value : [];
                      setValues(
                        { ...values, [property]: tidyValue },
                        property,
                        tidyValue,
                        "array"
                      );
                    }}
                  />
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  );
};
