export interface VariantToInterfaceName {  
    interfaceName: string;
    variant: string;
    path: string;
}

export const variantToInterfaceName: Record<string, Record<string, VariantToInterfaceName>> = {
    dropin: {
       v4: {
        interfaceName: "DropinElementProps",
        variant: "dropin",
        path: "packages/lib/src/components/Dropin/types.ts"
       }, 
       v5: {
        interfaceName: "DropinElementProps",
        variant: "dropin",
        path: "packages/lib/src/components/Dropin/types.ts"
       },
       v6: {
        interfaceName: "DropinConfiguration",
        variant: "dropin",
        path: "packages/lib/src/components/Dropin/types.ts"
       }
    }
  };
  