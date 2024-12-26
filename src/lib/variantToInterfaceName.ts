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
  ancv: {
    v5: {
      interfaceName: "ANCVProps",
      variant: "ancv",
      path: "packages/lib/src/components/ANCV/ANCV.tsx",
    },
    v6: {
      interfaceName: "ANCVConfiguration",
      variant: "ancv",
      path: "packages/lib/src/components/ANCV/types.ts",
    },
  },
  paypal: {
    v3: {
      interfaceName: "PayPalCommonProps",
      variant: "paypal",
      path: "packages/lib/src/components/PayPal/types.ts",
    },
    v4: {
      interfaceName: "PayPalCommonProps",
      variant: "paypal",
      path: "packages/lib/src/components/PayPal/types.ts",
    },
    v5: {
      interfaceName: "PayPalCommonProps",
      variant: "paypal",
      path: "packages/lib/src/components/PayPal/types.ts",
    },
    v6: {
      interfaceName: "PayPalConfiguration",
      variant: "paypal",
      path: "packages/lib/src/components/PayPal/types.ts",
    },
  },
  klarna: {
    v5: {
      interfaceName: "KlarnaPaymentsProps",
      variant: "paypal",
      path: "packages/lib/src/components/PayPal/types.ts",
    },
    v6: {
      interfaceName: "KlarnConfiguration",
      variant: "klarna",
      path: "packages/lib/src/components/Klarna/types.ts",
    },
  },
};
