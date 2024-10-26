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
        properties.map((property: any) => (
          <AccordionItem
            key={property}
            value={property}
            className="hover:no-underline"
          >
            <AccordionTrigger className="px-4 py-3">
              <p className="text-sm text-foreground">{property.name}</p>
              <p className="font-mono text-xs flex-grow text-left">
                {property.type && (
                  <span className="pl-2 text-grey">{property.type}</span>
                )}
                {property.required && (
                  <span className="pl-2 text-warning">Required</span>
                )}
              </p>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-4">
                <p className="text-xs pb-2 text-foreground">
                  {property.description}
                </p>
                {/* {properties[property].type === "string" &&
                  !properties[property].enum && (
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
                {properties[property].type === "string" &&
                  properties[property].enum && (
                    <Enum
                      value={
                        values[property] !== undefined ? values[property] : ""
                      }
                      onChange={(value: any) => {
                        console.log("value", value);
                        if (value) {
                          setValues({ ...values, [property]: value });
                        } else {
                          setValues({ ...values, [property]: "" });
                        }
                      }}
                      set={properties[property].enum}
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
                {properties[property].type === "boolean" && (
                  <Enum
                    value={
                      values[property] !== undefined
                        ? values[property].toString()
                        : ""
                    }
                    onChange={(value: any) => {
                      setValues({
                        ...values,
                        [property]: value === "true" ? true : false,
                      });
                    }}
                    set={["true", "false"]}
                  />
                )}
                {properties[property].type === "array" && (
                  <Array
                    value={values[property] ? values[property] : []}
                    onChange={(value: any) => {
                      if (value) {
                        setValues({ ...values, [property]: value });
                      } else {
                        setValues({ ...values, [property]: [] });
                      }
                    }}
                  />
                )}
                {properties[property]["$ref"] && openApi && (
                  <div className="border-l-[1px]">
                    <OpenApiList
                      schema={openApi}
                      properties={
                        resolveRef(openApi, properties[property]["$ref"]) &&
                        resolveRef(openApi, properties[property]["$ref"])
                          .properties
                          ? resolveRef(openApi, properties[property]["$ref"])
                              .properties
                          : []
                      }
                      required={
                        resolveRef(openApi, properties[property]["$ref"]) &&
                        resolveRef(openApi, properties[property]["$ref"])
                          .required
                          ? resolveRef(openApi, properties[property]["$ref"])
                              .required
                          : []
                      }
                      selectedProperties={
                        values &&
                        values[property] &&
                        Object.keys(values[property])
                          ? Object.keys(values[property])
                          : []
                      }
                      values={values[property] ? values[property] : {}}
                      setValues={(value: any) => {
                        setValues({ ...values, [property]: value });
                      }}
                      onChange={(value: any) => {
                        const requestParameters =
                          values &&
                          values[property] &&
                          Object.keys(values[property]);
                        const isNewProperty =
                          requestParameters.length < value.length;
                        if (isNewProperty) {
                          const latestKey = value[value.length - 1];
                          const latestValue = resolveRef(
                            openApi,
                            properties[property]["$ref"]
                          ).properties[latestKey];
                          let newProperty = null;
                          let mergedProperties = null;
                          if (latestValue.type === "string") {
                            newProperty = { [latestKey]: "" };
                          } else if (latestValue.type === "boolean") {
                            newProperty = { [latestKey]: true };
                          } else if (latestValue.type === "integer") {
                            newProperty = { [latestKey]: 0 };
                          } else if (latestValue.type === "array") {
                            newProperty = { [latestKey]: [] };
                          } else if (!latestValue.type) {
                            newProperty = { [latestKey]: {} };
                          } else if (latestValue.type === "object") {
                            newProperty = { [latestKey]: {} };
                          }
                          mergedProperties = {
                            ...values[property],
                            ...newProperty,
                          };
                          setValues({
                            ...values,
                            [property]: mergedProperties,
                          });
                        } else {
                          const removedProperties: any =
                            requestParameters.filter((i: any) => {
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
                )} */}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  );
};
