// app/api/data/[file]/route.ts
import { strict } from "assert";
import { NextRequest } from "next/server";
import * as ts from "typescript";
import { variantToInterfaceName } from "@/lib/variantToInterfaceName";
import { VariantToInterfaceName } from "@/lib/variantToInterfaceName";

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

export async function GET(
  request: NextRequest,
  { params }: { params: { version: string } }
) {
  const { version } = params;
  const searchParams = request.nextUrl.searchParams;
  const txVariant = searchParams.get("txvariant");
  const parsedVersion = version.replaceAll("_", ".");
  const majorVersion = parsedVersion.split(".")[0];
  // Move validation inside try block
  try {
    if (!txVariant) {
      throw new ApiError("Variant parameter is required", 400);
    }

    const map = variantToInterfaceName as Record<
      string,
      Record<string, VariantToInterfaceName>
    >;

    const interfaceName =
      txVariant && map[txVariant]
        ? map[txVariant][majorVersion].interfaceName
        : null;
    const path =
      txVariant && map[txVariant] ? map[txVariant][majorVersion].path : null;

    if (!interfaceName) {
      throw new ApiError("Could not find interface name for variant", 400);
    }

    const url = `https://raw.githubusercontent.com/Adyen/adyen-web/refs/tags/${parsedVersion}/${path}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw response;
    }

    const fileContent = await response.text();
    // Create a TypeScript source file from the fetched content
    const sourceFile = ts.createSourceFile(
      "fetchedFile.ts",
      fileContent,
      ts.ScriptTarget.ES2015,
      true
    );

    const structureAdyenWebTypes = () => {
      // Create a TypeChecker using a dummy program (no need to reference actual files)
      const program = ts.createProgram(["fetchedFile.ts"], {});
      const checker = program.getTypeChecker();
      let result: { [name: string]: ParsedProperty } = {};

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
                description: String(map[child.name.getText()] || ""),
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
              } else if (child?.name?.getText().indexOf("^on") > -1) {
                property.type = "function";
              } else if (child?.type?.kind === ts.SyntaxKind.TypeReference) {
                const typeName = (
                  member.type as ts.TypeReferenceNode
                ).typeName.getText();
                strictType = typeName;
                type = "object";
              }
              // additionalProperties?.push(property);
              additionalProperties[property.name] = property;
            }
          });
        });
        return additionalProperties;
      };

      const visit = (node: ts.Node, interfaceName: string): any => {
        if (ts.isInterfaceDeclaration(node) && node.name.text === interfaceName) {
          let result = {};
          
          node.members.forEach((member) => {
            if (ts.isPropertySignature(member) || ts.isMethodSignature(member)) {
              const name = member.name.getText();
              const required = !member.questionToken;
              let typeString = "any";
              let strictType = "any";
              let additionalProperties: { [name: string]: ParsedProperty } | any = {};
              let values: string[] | undefined = undefined;

              if (/^on/.test(name)) {
                typeString = "function";
                strictType = "function";
              } else if (member.type) {
                const type = checker.getTypeAtLocation(member);
                if (!type) return;

                strictType = member.type.getText();

                if (member.type.kind === ts.SyntaxKind.TypeLiteral) {
                  typeString = "object";
                  strictType = "object";
                  additionalProperties[name] = setAdditionalProperties(member);
                  // additionalProperties = setAdditionalProperties(member);
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
                  const referencedTypeName = typeRef.typeName.getText();
                  strictType = referencedTypeName;
                  typeString = "object";

                  // First try to find interface
                  const referencedInterface = findInterfaceDeclaration(sourceFile, referencedTypeName);
                  
                  if (referencedInterface) {
                    const referencedResult = visit(referencedInterface, referencedTypeName);
                    if (referencedResult) {
                      additionalProperties = referencedResult;
                    }
                  } else {
                    // If not an interface, try to find type alias
                    const typeAlias = findTypeAlias(sourceFile, referencedTypeName);
                    if (typeAlias && typeAlias.type.kind === ts.SyntaxKind.UnionType) {
                      const unionType = typeAlias.type as ts.UnionTypeNode;
                      const literalTypes = unionType.types.filter(
                        type => type.kind === ts.SyntaxKind.LiteralType
                      );
                      
                      if (literalTypes.length > 0) {
                        typeString = "enum";
                        values = literalTypes.map(type => type.getText().replace(/['"]/g, ''));
                        strictType = literalTypes.map(type => type.getText()).join(" | ");
                      }
                    }
                  }
                } else if (member.type.kind === ts.SyntaxKind.StringKeyword) {
                  typeString = "string";
                  strictType = member.type.getText();
                } else if (member.type.kind === ts.SyntaxKind.NumberKeyword) {
                  typeString = "number";
                } else if (member.type.kind === ts.SyntaxKind.BooleanKeyword) {
                  typeString = "boolean";
                } else if (member.type.kind === ts.SyntaxKind.AnyKeyword) {
                  typeString = "any";
                } else if (member.type.kind === ts.SyntaxKind.VoidKeyword) {
                  typeString = "function";
                } else if (member.type.kind === ts.SyntaxKind.NullKeyword) {
                  typeString = "null";
                } else if (
                  member.type.kind === ts.SyntaxKind.UndefinedKeyword
                ) {
                  typeString = "undefined";
                } else if (member.type.kind === ts.SyntaxKind.NeverKeyword) {
                  typeString = "never";
                } else if (member.type.kind === ts.SyntaxKind.UnknownKeyword) {
                  typeString = "unknown";
                } else if (member.type.kind === ts.SyntaxKind.SymbolKeyword) {
                  typeString = "symbol";
                } else if (member.type.kind === ts.SyntaxKind.BigIntKeyword) {
                  typeString = "bigint";
                } else if (member.type.kind === ts.SyntaxKind.ObjectKeyword) {
                  typeString = "object";
                } else if (member.type.kind === ts.SyntaxKind.ThisKeyword) {
                  typeString = "this";
                } else if (member.type.kind === ts.SyntaxKind.TypeOperator) {
                  typeString = "typeOperator";
                } else if (
                  member.type.kind === ts.SyntaxKind.IndexedAccessType
                ) {
                  typeString = "indexedAccessType";
                }
              }
              result = {
                ...result,
                [name]: {
                  name,
                  type: typeString,
                  strictType,
                  required,
                  values,
                  description: typeof map[name] === "string" ? map[name] : "",
                  additionalProperties,
                },
              };
            }
          });

          return result;
        } else {
          let childResult = undefined;
          ts.forEachChild(node, (child) => {
            const visitResult = visit(child, interfaceName);
            if (visitResult) {
              childResult = visitResult;
            }
          });
          return childResult;
        }
      };

      ts.forEachChild(sourceFile, (node) => {
        let setResult = visit(node, interfaceName);
        result = { ...result, ...setResult };
      });

      return result;
    };

    const result = structureAdyenWebTypes();
    return Response.json({ ...result });
  } catch (error: any) {
    if (error instanceof Response) {
      const data = await error.json();
      return new Response(
        JSON.stringify({
          error: data,
          status: error.status,
        }),
        {
          status: error.status,
        }
      );
    } else if (error instanceof ApiError) {
      return new Response(
        JSON.stringify({
          error: error.message,
          status: error.status,
        }),
        {
          status: error.status,
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          error: error.message,
          status: 500,
        }),
        {
          status: 500,
        }
      );
    }
  }
}

// Add this helper function to find interface declarations
const findInterfaceDeclaration = (
  sourceFile: ts.SourceFile,
  interfaceName: string
): ts.InterfaceDeclaration | undefined => {
  let foundInterface: ts.InterfaceDeclaration | undefined;

  const visit = (node: ts.Node) => {
    if (ts.isInterfaceDeclaration(node) && node.name.text === interfaceName) {
      foundInterface = node;
      return;
    }
    ts.forEachChild(node, visit);
  };

  ts.forEachChild(sourceFile, visit);
  return foundInterface;
};

// Add this helper function to find type aliases
const findTypeAlias = (
  sourceFile: ts.SourceFile,
  typeName: string
): ts.TypeAliasDeclaration | undefined => {
  let foundType: ts.TypeAliasDeclaration | undefined;

  const visit = (node: ts.Node) => {
    if (ts.isTypeAliasDeclaration(node) && node.name.text === typeName) {
      foundType = node;
      return;
    }
    ts.forEachChild(node, visit);
  };

  ts.forEachChild(sourceFile, visit);
  return foundType;
};
