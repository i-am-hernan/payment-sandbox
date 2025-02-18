// app/api/data/[file]/route.ts
import { descriptionMap } from "@/lib/descriptionMap";
import { variantToInterfaceName, VariantToInterfaceName } from "@/lib/variantToInterfaceName";
import { NextRequest } from "next/server";
import * as ts from "typescript";

// First, create a custom error class at the top of the file
class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface ParsedProperty {
  name: string;
  type: string;
  strictType: string;
  required: boolean;
  additionalProperties?: { [name: string]: ParsedProperty };
  values?: string[];
  description?: string;
}

interface ImportInfo {
  sourceFile: ts.SourceFile;
  importClause?: ts.ImportClause;
}

const map = variantToInterfaceName as Record<
  string,
  Record<string, VariantToInterfaceName>
>;

const getCheckoutInterfaceName = (version: string) => {
  return /^v6./.test(version) ? "CoreConfiguration" : "CoreOptions";
};

const getCheckoutMainPath = (version: string) => {
  return "packages/lib/src/core/types.ts";
};

const getVariantInterfaceName = (configuration: string, version: string) => {
  return map[configuration][version].interfaceName;
};

const getVariantMainPath = (configuration: string, version: string) => {
  return map[configuration][version].path;
};

export async function GET(
  request: NextRequest,
  { params }: { params: { version: string; configuration: string } }
) {
  const { version, configuration } = params;
  const parsedVersion = version.replaceAll("_", ".");
  const majorVersion = parsedVersion.split(".")[0];

  const interfaceName =
    configuration === "checkout"
      ? getCheckoutInterfaceName(parsedVersion)
      : getVariantInterfaceName(configuration, majorVersion);
  const mainPath =
    configuration === "checkout"
      ? getCheckoutMainPath(parsedVersion)
      : getVariantMainPath(configuration, majorVersion);
  const url = `https://raw.githubusercontent.com/Adyen/adyen-web/refs/tags/${parsedVersion}/${mainPath}`;

  const map = descriptionMap as Record<string, string>;
  let imports: Record<string, ImportInfo> = {};

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw response;
    }

    const fileContent = await response.text();
    const sourceFile = ts.createSourceFile(
      mainPath,
      fileContent,
      ts.ScriptTarget.ES2015,
      true
    );

    // Process imports recursively
    const processImports = async (
      sourceFile: ts.SourceFile,
      basePath: string,
      depth = 0
    ) => {
      if (depth > 3) {
        return;
      }

      for (const statement of sourceFile.statements) {
        if (ts.isImportDeclaration(statement)) {
          const importPath = (statement.moduleSpecifier as ts.StringLiteral)
            .text;

          if (importPath.startsWith(".")) {
            const currentDir = basePath.substring(0, basePath.lastIndexOf("/"));
            let pathSegments = `${currentDir}/${importPath}`.split("/");
            const normalizedSegments = [];

            for (const segment of pathSegments) {
              if (segment === "..") {
                normalizedSegments.pop();
              } else if (segment !== "." && segment !== "") {
                normalizedSegments.push(segment);
              }
            }

            let resolvedPath = `${normalizedSegments.join("/")}`;
            let importUrls = [
              `https://raw.githubusercontent.com/Adyen/adyen-web/refs/tags/${parsedVersion}/${resolvedPath}.ts`,
              `https://raw.githubusercontent.com/Adyen/adyen-web/refs/tags/${parsedVersion}/${resolvedPath}/types.ts`,
              `https://raw.githubusercontent.com/Adyen/adyen-web/refs/tags/${parsedVersion}/${resolvedPath}/index.ts`,
              `https://raw.githubusercontent.com/Adyen/adyen-web/refs/tags/${parsedVersion}/${resolvedPath}.tsx`,
            ];

            for (const importUrl of importUrls) {
              let response = await fetch(importUrl, {
                headers: {
                  "Cache-Control":
                    "public, s-maxage=86400, stale-while-revalidate=43200",
                },
              });

              if (response.ok) {
                const content = await response.text();
                const importedFile = ts.createSourceFile(
                  resolvedPath,
                  content,
                  ts.ScriptTarget.ES2015,
                  true
                );
                imports[resolvedPath] = {
                  sourceFile: importedFile,
                  importClause: statement.importClause,
                };
                await processImports(importedFile, resolvedPath, depth + 1);
                break;
              }
            }
          }
        }
      }
    };

    // Start with depth 0
    await processImports(sourceFile, mainPath, 0);

    // After processing all imports

    const structureAdyenWebTypes = () => {
      // Create a single program with all files
      const program = ts.createProgram([mainPath], {});
      const checker = program.getTypeChecker();
      const result: { [name: string]: ParsedProperty } = {};

      const setAdditionalProperties = function (
        member: ts.PropertySignature | ts.MethodSignature
      ) {
        let additionalProperties: { [name: string]: ParsedProperty } = {};

        member.forEachChild((child) => {
          let strictType = "string";
          let type = "any";

          child.forEachChild((child) => {
            if (ts.isPropertySignature(child)) {
              const property: ParsedProperty = {
                name: child.name.getText(),
                type: child.type?.getText() || "string",
                strictType: child.type?.getText() || "string",
                required: !child.questionToken,
                description: map[child.name.getText()]
                  ? map[child.name.getText()]
                  : "",
              };
              if (/^_/.test(child.name.getText())) {
                return;
              }
              if (child?.type?.kind === ts.SyntaxKind.TypeLiteral) {
                property.type = "object";
                property.strictType = "object";
                // Recursively process nested type literals
                const typeLiteral = child.type as ts.TypeLiteralNode;
                property.additionalProperties = {};

                typeLiteral.members.forEach((member) => {
                  if (ts.isPropertySignature(member)) {
                    const propName = member.name.getText();
                    const nestedProp: ParsedProperty = {
                      name: propName,
                      type: getTypeString(member.type),
                      strictType:
                        member.type?.kind === ts.SyntaxKind.TypeReference
                          ? (
                              member.type as ts.TypeReferenceNode
                            ).typeName.getText()
                          : member.type?.getText() || "string",
                      required: !member.questionToken,
                      description: map[propName] ? map[propName] : "",
                    };
                    // If this nested property is also a type literal, process it recursively
                    if (member.type?.kind === ts.SyntaxKind.TypeLiteral) {
                      nestedProp.type = "object";
                      nestedProp.strictType = "object";
                      nestedProp.additionalProperties =
                        setAdditionalProperties(member);
                    }

                    if (property.additionalProperties) {
                      property.additionalProperties[propName] = nestedProp;
                    }
                  }
                });
              } else if (child?.type?.kind === ts.SyntaxKind.StringKeyword) {
                property.type = "string";
              } else if (child?.type?.kind === ts.SyntaxKind.NumberKeyword) {
                property.type = "number";
              } else if (child?.type?.kind === ts.SyntaxKind.BooleanKeyword) {
                property.type = "boolean";
              } else if (child?.type?.kind === ts.SyntaxKind.VoidKeyword) {
                property.type = "function";
              } else if (child?.type?.kind === ts.SyntaxKind.TypeReference) {
                property.type = "object";
                property.strictType = (
                  child.type as ts.TypeReferenceNode
                ).typeName.getText();
              }
              additionalProperties[property.name] = property;
            }
          });
        });
        return additionalProperties;
      };

      // Visit all source files to find types
      Object.values(imports).forEach(({ sourceFile }) => {
        const visit = (node: ts.Node) => {
          if (
            ts.isInterfaceDeclaration(node) &&
            node.name.text === interfaceName
          ) {
            node.members.forEach((member) => {
              if (
                ts.isPropertySignature(member) ||
                ts.isMethodSignature(member)
              ) {
                const name = member.name.getText();
                const required = !member.questionToken;
                let typeString = "any";
                let strictType = "any";
                let additionalProperties: { [name: string]: ParsedProperty } =
                  {};
                let values: string[] | undefined = undefined;
                if (member.type && !/^_/.test(name)) {
                  const type = checker.getTypeAtLocation(member);
                  if (!type) return;
                  strictType = member.type.getText();
                  if (
                    member.type.kind === ts.SyntaxKind.VoidKeyword ||
                    member.type.getText().includes("Promise<void>") ||
                    /^on/.test(name) ||
                    /^before/.test(name)
                  ) {
                    typeString = "function";
                    strictType = "function";
                  } else if (member.type.kind === ts.SyntaxKind.TypeLiteral) {
                    typeString = "object";
                    strictType = "object";
                    additionalProperties = setAdditionalProperties(member);
                  } else if (member.type.kind === ts.SyntaxKind.ArrayType) {
                    typeString = "array";
                  } else if (member.type.kind === ts.SyntaxKind.UnionType) {
                    const unionType = member.type as ts.UnionTypeNode;
                    const filteredLiteralTypes = unionType.types.filter(
                      (type) => type.kind === ts.SyntaxKind.LiteralType
                    );
                    const filteredStringTypes = unionType.types.map(
                      (type) => type.kind === ts.SyntaxKind.StringKeyword
                    );
                    if (filteredLiteralTypes.length > 0) {
                      typeString = "enum";
                      values = filteredLiteralTypes.map((type) => {
                        return type.getText();
                      });
                    } else if (filteredStringTypes.length > 0) {
                      typeString = "string";
                    }
                  } else if (member.type.kind === ts.SyntaxKind.TypeReference) {
                    const typeRef = member.type as ts.TypeReferenceNode;
                    const typeName = typeRef.typeName.getText();
                    strictType = typeName;
                    typeString = "object";
                    // Handle extended interfaces
                    for (const [_, importInfo] of Object.entries(imports)) {
                      importInfo.sourceFile.forEachChild((node) => {
                        if (
                          ts.isInterfaceDeclaration(node) &&
                          node.name.text === typeName
                        ) {
                          // Get properties from this interface
                          node.members.forEach((member) => {
                            if (ts.isPropertySignature(member)) {
                              const prop: ParsedProperty = {
                                name: member.name.getText(),
                                type: getTypeString(member.type),
                                strictType: member.type?.getText() || "string",
                                required: !member.questionToken,
                                description: map[member.name.getText()]
                                  ? map[member.name.getText()]
                                  : "",
                              };
                              // Handle nested type literals in interface properties
                              if (
                                member.type?.kind === ts.SyntaxKind.TypeLiteral
                              ) {
                                prop.type = "object";
                                prop.strictType = "object";
                                prop.additionalProperties =
                                  setAdditionalProperties(member);
                              } else if (
                                member.type?.kind ===
                                ts.SyntaxKind.TypeReference
                              ) {
                                // Handle nested type references recursively
                                prop.type = "object";
                                const nestedTypeName = (
                                  member.type as ts.TypeReferenceNode
                                ).typeName.getText();
                                prop.strictType = nestedTypeName;

                                // Recursively process the referenced type
                                for (const [_, importInfo] of Object.entries(
                                  imports
                                )) {
                                  importInfo.sourceFile.forEachChild(
                                    (nestedNode) => {
                                      if (
                                        ts.isInterfaceDeclaration(nestedNode) &&
                                        nestedNode.name.text === nestedTypeName
                                      ) {
                                        prop.additionalProperties = {};
                                        nestedNode.members.forEach(
                                          (nestedMember) => {
                                            if (
                                              ts.isPropertySignature(
                                                nestedMember
                                              )
                                            ) {
                                              const nestedProp: ParsedProperty =
                                                {
                                                  name: nestedMember.name.getText(),
                                                  type: getTypeString(
                                                    nestedMember.type
                                                  ),
                                                  strictType:
                                                    nestedMember.type?.getText() ||
                                                    "string",
                                                  required:
                                                    !nestedMember.questionToken,
                                                  description: map[
                                                    nestedMember.name.getText()
                                                  ]
                                                    ? map[
                                                        nestedMember.name.getText()
                                                      ]
                                                    : "",
                                                };

                                              // Continue recursion for nested properties
                                              if (
                                                nestedMember.type?.kind ===
                                                ts.SyntaxKind.TypeLiteral
                                              ) {
                                                nestedProp.type = "object";
                                                nestedProp.strictType =
                                                  "object";
                                                nestedProp.additionalProperties =
                                                  setAdditionalProperties(
                                                    nestedMember
                                                  );
                                              } else if (
                                                nestedMember.type?.kind ===
                                                ts.SyntaxKind.TypeReference
                                              ) {
                                                // Handle nested type references recursively
                                                nestedProp.type = "object";
                                                const nestedTypeName = (
                                                  nestedMember.type as ts.TypeReferenceNode
                                                ).typeName.getText();
                                                nestedProp.strictType =
                                                  nestedTypeName;

                                                // Recursively process the referenced type
                                                for (const [
                                                  _,
                                                  importInfo,
                                                ] of Object.entries(imports)) {
                                                  importInfo.sourceFile.forEachChild(
                                                    (deepNode) => {
                                                      if (
                                                        ts.isInterfaceDeclaration(
                                                          deepNode
                                                        ) &&
                                                        deepNode.name.text ===
                                                          nestedTypeName
                                                      ) {
                                                        nestedProp.additionalProperties =
                                                          {};
                                                        deepNode.members.forEach(
                                                          (deepMember) => {
                                                            if (
                                                              ts.isPropertySignature(
                                                                deepMember
                                                              )
                                                            ) {
                                                              const deepProp: ParsedProperty =
                                                                {
                                                                  name: deepMember.name.getText(),
                                                                  type: getTypeString(
                                                                    deepMember.type
                                                                  ),
                                                                  strictType:
                                                                    deepMember.type?.getText() ||
                                                                    "string",
                                                                  required:
                                                                    !deepMember.questionToken,
                                                                  description:
                                                                    map[
                                                                      deepMember.name.getText()
                                                                    ]
                                                                      ? map[
                                                                          deepMember.name.getText()
                                                                        ]
                                                                      : "",
                                                                };

                                                              if (
                                                                nestedProp.additionalProperties
                                                              ) {
                                                                nestedProp.additionalProperties[
                                                                  deepProp.name
                                                                ] = deepProp;
                                                              }
                                                            }
                                                          }
                                                        );
                                                      }
                                                    }
                                                  );
                                                }
                                              }
                                              if (prop.additionalProperties) {
                                                prop.additionalProperties[
                                                  nestedProp.name
                                                ] = nestedProp;
                                              }
                                            }
                                          }
                                        );
                                      }
                                    }
                                  );
                                }
                              }
                              additionalProperties[prop.name] = prop;
                            }
                          });

                          // Handle extends clause if it exists
                          if (node.heritageClauses) {
                            node.heritageClauses.forEach((clause) => {
                              if (
                                clause.token === ts.SyntaxKind.ExtendsKeyword
                              ) {
                                clause.types.forEach((baseType) => {
                                  const baseTypeName =
                                    baseType.expression.getText();
                                  // Look for base interface in all imported files
                                  for (const [
                                    _,
                                    baseImportInfo,
                                  ] of Object.entries(imports)) {
                                    baseImportInfo.sourceFile.forEachChild(
                                      (baseNode) => {
                                        if (
                                          ts.isInterfaceDeclaration(baseNode) &&
                                          baseNode.name.text === baseTypeName
                                        ) {
                                          baseNode.members.forEach((member) => {
                                            if (
                                              ts.isPropertySignature(member)
                                            ) {
                                              const baseProp: ParsedProperty = {
                                                name: member.name.getText(),
                                                type: getTypeString(
                                                  member.type
                                                ),
                                                strictType:
                                                  member.type?.getText() ||
                                                  "string",
                                                required: !member.questionToken,
                                                description: map[
                                                  member.name.getText()
                                                ]
                                                  ? map[member.name.getText()]
                                                  : "",
                                              };
                                              // Handle nested types in base interface properties
                                              if (
                                                member.type?.kind ===
                                                ts.SyntaxKind.TypeLiteral
                                              ) {
                                                baseProp.type = "object";
                                                baseProp.strictType = "object";
                                                baseProp.additionalProperties =
                                                  setAdditionalProperties(
                                                    member
                                                  );
                                              } else if (
                                                member.type?.kind ===
                                                ts.SyntaxKind.TypeReference
                                              ) {
                                                // Handle nested type references recursively
                                                baseProp.type = "object";
                                                const nestedTypeName = (
                                                  member.type as ts.TypeReferenceNode
                                                ).typeName.getText();
                                                baseProp.strictType =
                                                  nestedTypeName;

                                                // Recursively process the referenced type
                                                for (const [
                                                  _,
                                                  importInfo,
                                                ] of Object.entries(imports)) {
                                                  importInfo.sourceFile.forEachChild(
                                                    (nestedNode) => {
                                                      if (
                                                        ts.isInterfaceDeclaration(
                                                          nestedNode
                                                        ) &&
                                                        nestedNode.name.text ===
                                                          nestedTypeName
                                                      ) {
                                                        baseProp.additionalProperties =
                                                          {};
                                                        nestedNode.members.forEach(
                                                          (nestedMember) => {
                                                            if (
                                                              ts.isPropertySignature(
                                                                nestedMember
                                                              )
                                                            ) {
                                                              const nestedProp: ParsedProperty =
                                                                {
                                                                  name: nestedMember.name.getText(),
                                                                  type: getTypeString(
                                                                    nestedMember.type
                                                                  ),
                                                                  strictType:
                                                                    nestedMember.type?.getText() ||
                                                                    "string",
                                                                  required:
                                                                    !nestedMember.questionToken,
                                                                  description:
                                                                    map[
                                                                      nestedMember.name.getText()
                                                                    ]
                                                                      ? map[
                                                                          nestedMember.name.getText()
                                                                        ]
                                                                      : "",
                                                                };

                                                              // Continue recursion for nested properties
                                                              if (
                                                                nestedMember
                                                                  .type
                                                                  ?.kind ===
                                                                ts.SyntaxKind
                                                                  .TypeLiteral
                                                              ) {
                                                                nestedProp.type =
                                                                  "object";
                                                                nestedProp.strictType =
                                                                  "object";
                                                                nestedProp.additionalProperties =
                                                                  setAdditionalProperties(
                                                                    nestedMember
                                                                  );
                                                              } else if (
                                                                nestedMember
                                                                  .type
                                                                  ?.kind ===
                                                                ts.SyntaxKind
                                                                  .TypeReference
                                                              ) {
                                                                // Handle nested type references recursively
                                                                nestedProp.type =
                                                                  "object";
                                                                const nestedTypeName =
                                                                  (
                                                                    nestedMember.type as ts.TypeReferenceNode
                                                                  ).typeName.getText();
                                                                nestedProp.strictType =
                                                                  nestedTypeName;

                                                                // Recursively process the referenced type
                                                                for (const [
                                                                  _,
                                                                  importInfo,
                                                                ] of Object.entries(
                                                                  imports
                                                                )) {
                                                                  importInfo.sourceFile.forEachChild(
                                                                    (
                                                                      deepNode
                                                                    ) => {
                                                                      if (
                                                                        ts.isInterfaceDeclaration(
                                                                          deepNode
                                                                        ) &&
                                                                        deepNode
                                                                          .name
                                                                          .text ===
                                                                          nestedTypeName
                                                                      ) {
                                                                        nestedProp.additionalProperties =
                                                                          {};
                                                                        deepNode.members.forEach(
                                                                          (
                                                                            deepMember
                                                                          ) => {
                                                                            if (
                                                                              ts.isPropertySignature(
                                                                                deepMember
                                                                              )
                                                                            ) {
                                                                              const deepProp: ParsedProperty =
                                                                                {
                                                                                  name: deepMember.name.getText(),
                                                                                  type: getTypeString(
                                                                                    deepMember.type
                                                                                  ),
                                                                                  strictType:
                                                                                    deepMember.type?.getText() ||
                                                                                    "string",
                                                                                  required:
                                                                                    !deepMember.questionToken,
                                                                                  description:
                                                                                    map[
                                                                                      deepMember.name.getText()
                                                                                    ]
                                                                                      ? map[
                                                                                          deepMember.name.getText()
                                                                                        ]
                                                                                      : "",
                                                                                };

                                                                              if (
                                                                                nestedProp.additionalProperties
                                                                              ) {
                                                                                nestedProp.additionalProperties[
                                                                                  deepProp.name
                                                                                ] =
                                                                                  deepProp;
                                                                              }
                                                                            }
                                                                          }
                                                                        );
                                                                      }
                                                                    }
                                                                  );
                                                                }
                                                              }
                                                              additionalProperties[
                                                                nestedProp.name
                                                              ] = nestedProp;
                                                            }
                                                          }
                                                        );
                                                      }
                                                    }
                                                  );
                                                }
                                              }
                                              additionalProperties[
                                                baseProp.name
                                              ] = baseProp;
                                            }
                                          });
                                        }
                                      }
                                    );
                                  }
                                });
                              }
                            });
                          }
                        }
                      });
                    }
                  } else if (member.type.kind === ts.SyntaxKind.StringKeyword) {
                    typeString = "string";
                    strictType = member.type.getText();
                  } else if (member.type.kind === ts.SyntaxKind.NumberKeyword) {
                    typeString = "number";
                  } else if (
                    member.type.kind === ts.SyntaxKind.BooleanKeyword
                  ) {
                    typeString = "boolean";
                  } else if (member.type.kind === ts.SyntaxKind.AnyKeyword) {
                    typeString = "any";
                  }

                  result[name] = {
                    name,
                    type: typeString,
                    strictType,
                    required,
                    values,
                    description: map[name] ? map[name] : "",
                    additionalProperties,
                  };
                }
              } else {
                console.log(
                  "Error: member.name.getText()",
                  member?.name?.getText()
                );
              }
            });
          }
          ts.forEachChild(node, visit);
        };
        ts.forEachChild(sourceFile, visit);
      });

      return result;
    };

    const result = structureAdyenWebTypes();

    // Clean up
    imports = {};

    return Response.json(result);
  } catch (error: any) {
    if (error instanceof Response) {
      const data = await error.json();
      return new Response(JSON.stringify(data), { status: error.status });
    }
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

// Helper function to get type string
function getTypeString(type: ts.TypeNode | undefined): string {
  if (!type) return "string";
  if (type.kind === ts.SyntaxKind.StringKeyword) return "string";
  if (type.kind === ts.SyntaxKind.NumberKeyword) return "number";
  if (type.kind === ts.SyntaxKind.BooleanKeyword) return "boolean";
  if (type.kind === ts.SyntaxKind.TypeLiteral) return "object";
  return "string";
}
