export interface VariantToInterfaceName {
  interfaceName: string;
  variant: string;
  path: string;
}

export const variantToInterfaceName: Record<
  string,
  Record<string, VariantToInterfaceName>
> = {
  dropin: {
    v3: {
      interfaceName: "DropinElementProps",
      variant: "dropin",
      path: "packages/lib/src/components/Dropin/types.ts",
    },
    v4: {
      interfaceName: "DropinElementProps",
      variant: "dropin",
      path: "packages/lib/src/components/Dropin/types.ts",
    },
    v5: {
      interfaceName: "DropinElementProps",
      variant: "dropin",
      path: "packages/lib/src/components/Dropin/types.ts",
    },
    v6: {
      interfaceName: "DropinConfiguration",
      variant: "dropin",
      path: "packages/lib/src/components/Dropin/types.ts",
    },
  },
  card: {
    v3: {
      interfaceName: "CardElementProps",
      variant: "card",
      path: "packages/lib/src/components/Card/types.ts",
    },
    v4: {
      interfaceName: "CardElementProps",
      variant: "card",
      path: "packages/lib/src/components/Card/types.ts",
    },
    v5: {
      interfaceName: "CardElementProps",
      variant: "card",
      path: "packages/lib/src/components/Card/types.ts",
    },
    v6: {
      interfaceName: "CardConfiguration",
      variant: "card",
      path: "packages/lib/src/components/Card/types.ts",
    },
  },
  scheme: {
    v3: {
      interfaceName: "CardElementProps",
      variant: "scheme",
      path: "packages/lib/src/components/Card/types.ts",
    },
    v4: {
      interfaceName: "CardElementProps",
      variant: "scheme",
      path: "packages/lib/src/components/Card/types.ts",
    },
    v5: {
      interfaceName: "CardElementProps",
      variant: "scheme",
      path: "packages/lib/src/components/Card/types.ts",
    },
    v6: {
      interfaceName: "CardConfiguration",
      variant: "scheme",
      path: "packages/lib/src/components/Card/types.ts",
    },
  },
};
