// app/api/data/[file]/route.ts
import { strict } from "assert";
import { NextRequest } from "next/server";
import * as ts from "typescript";
import { descriptionMap } from "@/lib/descriptionMap";

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

export async function GET(
  request: NextRequest,
  { params }: { params: { version: string } }
) {
  const { version } = params;
  const parsedVersion = version.replaceAll("_", ".");
  const interfaceName = /^v6./.test(parsedVersion)
    ? "CoreConfiguration"
    : "CoreOptions";
  const mainPath = "packages/lib/src/core/types.ts";
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
      if (depth > 2) return;

      for (const statement of sourceFile.statements) {
        if (ts.isImportDeclaration(statement)) {
          const importPath = (statement.moduleSpecifier as ts.StringLiteral)
            .text;
          if (importPath.startsWith(".")) {
            const currentDir = basePath.substring(0, basePath.lastIndexOf("/"));
            // Split path into segments and resolve ../ properly
            const pathSegments = `${currentDir}/${importPath}`.split("/");
            const normalizedSegments = [];

            for (const segment of pathSegments) {
              if (segment === "..") {
                normalizedSegments.pop();
              } else if (segment !== "." && segment !== "") {
                normalizedSegments.push(segment);
              }
            }

            // Try direct path first
            let resolvedPath = `${normalizedSegments.join("/")}`;
            let importUrl = `https://raw.githubusercontent.com/Adyen/adyen-web/refs/tags/${parsedVersion}/${resolvedPath}.ts`;

            let response = await fetch(importUrl, {
              headers: {
                "Cache-Control":
                  "public, s-maxage=86400, stale-while-revalidate=43200",
              },
            });

            // If not found, try with /index.ts
            if (!response.ok && response.status === 404) {
              importUrl = `https://raw.githubusercontent.com/Adyen/adyen-web/refs/tags/${parsedVersion}/${resolvedPath}/index.ts`;
              response = await fetch(importUrl, {
                headers: {
                  "Cache-Control":
                    "public, s-maxage=86400, stale-while-revalidate=43200",
                },
              });
            }

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
            }
          }
        }
      }
    };

    // Start with depth 0
    await processImports(sourceFile, mainPath, 0);

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

              if (child?.type?.kind === ts.SyntaxKind.TypeLiteral) {
                property.type = "object";
                property.strictType = "object";
                property.additionalProperties = setAdditionalProperties(child);
              } else if (child?.type?.kind === ts.SyntaxKind.StringKeyword) {
                property.type = "string";
              } else if (child?.type?.kind === ts.SyntaxKind.NumberKeyword) {
                property.type = "number";
              } else if (child?.type?.kind === ts.SyntaxKind.BooleanKeyword) {
                property.type = "boolean";
              } else if (child?.type?.kind === ts.SyntaxKind.TypeReference) {
                const typeRef = child.type as ts.TypeReferenceNode;
                const typeName = typeRef.typeName.getText();
                strictType = typeName;
                type = "object";

                // Handle extended interfaces
                for (const [_, importInfo] of Object.entries(imports)) {
                  importInfo.sourceFile.forEachChild((node) => {
                    if (ts.isInterfaceDeclaration(node) && node.name.text === typeName) {
                      // Get properties from this interface
                      node.members.forEach((member) => {
                        if (ts.isPropertySignature(member)) {
                          const prop: ParsedProperty = {
                            name: member.name.getText(),
                            type: getTypeString(member.type),
                            strictType: member.type?.getText() || "string",
                            required: !member.questionToken,
                            description: map[member.name.getText()] ? map[member.name.getText()] : "",
                          };
                          additionalProperties[prop.name] = prop;
                        }
                      });

                      // Handle extends clause if it exists
                      if (node.heritageClauses) {
                        node.heritageClauses.forEach((clause) => {
                          if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
                            clause.types.forEach((baseType) => {
                              const baseTypeName = baseType.expression.getText();
                              // Look for base interface in all imported files
                              for (const [_, baseImportInfo] of Object.entries(imports)) {
                                baseImportInfo.sourceFile.forEachChild((baseNode) => {
                                  if (ts.isInterfaceDeclaration(baseNode) && baseNode.name.text === baseTypeName) {
                                    baseNode.members.forEach((member) => {
                                      if (ts.isPropertySignature(member)) {
                                        const baseProp: ParsedProperty = {
                                          name: member.name.getText(),
                                          type: getTypeString(member.type),
                                          strictType: member.type?.getText() || "string",
                                          required: !member.questionToken,
                                          description: map[member.name.getText()] ? map[member.name.getText()] : "",
                                        };
                                        additionalProperties[baseProp.name] = baseProp;
                                      }
                                    });
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
                    }
                  });
                }
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

                if (/^on/.test(name) || /^before/.test(name)) {
                  typeString = "function";
                  strictType = "function";
                } else if (member.type) {
                  const type = checker.getTypeAtLocation(member);
                  if (!type) return;

                  strictType = member.type.getText();

                  if (member.type.kind === ts.SyntaxKind.TypeLiteral) {
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
                        if (ts.isInterfaceDeclaration(node) && node.name.text === typeName) {
                          // Get properties from this interface
                          node.members.forEach((member) => {
                            if (ts.isPropertySignature(member)) {
                              const prop: ParsedProperty = {
                                name: member.name.getText(),
                                type: getTypeString(member.type),
                                strictType: member.type?.getText() || "string",
                                required: !member.questionToken,
                                description: map[member.name.getText()] ? map[member.name.getText()] : "",
                              };
                              additionalProperties[prop.name] = prop;
                            }
                          });

                          // Handle extends clause if it exists
                          if (node.heritageClauses) {
                            node.heritageClauses.forEach((clause) => {
                              if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
                                clause.types.forEach((baseType) => {
                                  const baseTypeName = baseType.expression.getText();
                                  // Look for base interface in all imported files
                                  for (const [_, baseImportInfo] of Object.entries(imports)) {
                                    baseImportInfo.sourceFile.forEachChild((baseNode) => {
                                      if (ts.isInterfaceDeclaration(baseNode) && baseNode.name.text === baseTypeName) {
                                        baseNode.members.forEach((member) => {
                                          if (ts.isPropertySignature(member)) {
                                            const baseProp: ParsedProperty = {
                                              name: member.name.getText(),
                                              type: getTypeString(member.type),
                                              strictType: member.type?.getText() || "string",
                                              required: !member.questionToken,
                                              description: map[member.name.getText()] ? map[member.name.getText()] : "",
                                            };
                                            additionalProperties[baseProp.name] = baseProp;
                                          }
                                        });
                                      }
                                    });
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
                  } else if (member.type.kind === ts.SyntaxKind.VoidKeyword) {
                    typeString = "function";
                  } // ... rest of the type checks

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
    console.log("imports:", Object.keys(imports));
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
