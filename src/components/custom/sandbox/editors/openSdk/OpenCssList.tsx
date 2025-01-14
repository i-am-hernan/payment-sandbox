import Color from "@/components/custom/sandbox/editors/Color";
import Enum from "@/components/custom/sandbox/editors/Enum";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Slider from "../Slider";

// For CSS
// I want to recursively call this component if the property is a selector
// I want to call a specific component for four properties: background, color, font-family, font-size

export const OpenCssList = (props: any) => {
  const { selectedProperties, properties, values, setValues, onChange } = props;
  const propertyKeys = properties ? Object.keys(properties) : [];
  console.log("values", values);
  return (
    <Accordion
      type="multiple"
      className="w-full"
      value={selectedProperties}
      onValueChange={onChange}
    >
      {propertyKeys.length === 0 && (
        <div className="pl-6 pr-4 py-3">
          <p className="text-sm text-foreground">{`0 matching results`}</p>
        </div>
      )}
      {propertyKeys.length > 0 &&
        propertyKeys.map((property: any) => (
          <AccordionItem
            key={property}
            value={property}
            className="hover:no-underline"
          >
            <AccordionTrigger className="pl-6 pr-4 py-3">
              <p className="text-[0.85rem] text-foreground">{property}</p>
              <p className="font-mono text-xs flex-grow text-left">
                {properties[property].type && (
                  <span className="pl-2 text-grey">
                    {properties[property].type}
                  </span>
                )}
              </p>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-6 pr-4">
                <p className="text-xs pb-2 text-foreground">
                  {properties[property].description}
                </p>
                {/* {properties[property].type === "color" && (
                  <Color
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
                )} */}
                {properties[property].type === "font-family" && values && (
                  <Enum
                    value={
                      values[property] !== undefined
                        ? values[property].replace(/;/g, "")
                        : "Arial"
                    }
                    onChange={(value: any) => {
                      let tidyValue =
                        value !== undefined ? value + ";" : "Arial;";
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
                {/* {properties[property].type === "font-size" && (
                  <Slider
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
                )} */}
                {properties[property].type === "selector" && (
                  <div className="border-l-[1px]">
                    <OpenCssList
                      selectedProperties={
                        values &&
                        values[property] &&
                        Object.keys(values[property])
                          ? Object.keys(values[property])
                          : []
                      }
                      properties={properties[property].additionalProperties}
                      values={values[property]}
                      setValues={(value: any) => {
                        setValues({ ...values, [property]: value });
                      }}
                      onChange={(value: any) => {
                        const configParameters =
                          values &&
                          values[property] &&
                          Object.keys(values[property]);
                        const isNewProperty =
                          configParameters.length < value.length;
                        if (isNewProperty) {
                          const latestKey = value[value.length - 1];
                          const latestValue =
                            properties[property].additionalProperties[
                              latestKey
                            ];
                          let newProperty = null;
                          if (latestValue.type === "selector") {
                            newProperty = { [latestKey]: {} };
                          } else if (latestValue.type === "font-family") {
                            newProperty = { [latestKey]: "Arial;" };
                          } else if (latestValue.type === "font-size") {
                            newProperty = { [latestKey]: "14px;" };
                          } else if (latestValue.type === "color") {
                            newProperty = { [latestKey]: "" };
                          }
                          let mergedProperties = {
                            ...values[property],
                            ...newProperty,
                          };
                          setValues({
                            ...values,
                            [property]: mergedProperties,
                          }, property, mergedProperties, "object");
                        } else {
                          const removedProperties: any =
                            configParameters.filter((i: any) => {
                              return value.indexOf(i) < 0;
                            });
                          if (removedProperties.length > 0) {
                            let updatedRequest = { ...values[property] };
                            let removedProperty = removedProperties.pop();
                            delete updatedRequest[removedProperty];
                            setValues({
                              ...values,
                              [property]: updatedRequest,
                            });
                          }
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  );
};
