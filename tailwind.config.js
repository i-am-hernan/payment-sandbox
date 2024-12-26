/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontSize: {
        xxs: "var(--custom-font-xxs)", // Example: 10px
      },
      colors: {
        border: "hsl(var(--border))",
        adyen: "var(--custom-accent)",
        code: "hsl(var(--custom-accent-code))",
        variable: "var(--code-variable)",
        property: "var(--code-property)",
        reserved: "var(--code-reserved)",
        grey: "hsl(var(--grey))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },

        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        warning: {
          DEFAULT: "var(--color-warning)",
        },
        info: {
          DEFAULT: "var(--custom-accent-info)",
        },
        js: {
          DEFAULT: "var(--color-js-icon)",
        },
        preview: {
          DEFAULT: "var(--color-preview-icon)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        typing: {
          "0%": {
            width: "0%",
            visibility: "visible",
            borderRightWidth: "2px",
            borderRightColor: "hsl(var(--foreground))"
          },
          "99.9%": {
            borderRightWidth: "2px",
            borderRightColor: "hsl(var(--foreground))"
          },
          "100%": {
            width: "100%",
            borderRightWidth: "0px"
          },
        },
        cursor: {
          "0%, 100%": {
            borderRightColor: "hsl(var(--foreground))"
          },
          "50%": {
            borderRightColor: "transparent"
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        typing: "typing 2s steps(40), cursor 1s step-end infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
