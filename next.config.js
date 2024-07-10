// next.config.js
const path = require("path");

module.exports = {
  // Enable TypeScript support
  typescript: {
    ignoreBuildErrors: false, // Set to true to ignore TypeScript errors during build
  },
  reactStrictMode: false,
  // Custom webpack configuration
  webpack: (config, { isServer }) => {
    // Handle SVGs as React components
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        "@svgr/webpack",
        {
          loader: "file-loader",
          options: {
            publicPath: "/_next/static/images",
            outputPath: "static/images",
            name: "[name].[hash].[ext]",
          },
        },
      ],
    });

    // Resolve path aliases (optional)
    config.resolve.alias["@components"] = path.join(
      __dirname,
      "src/components"
    );
    config.resolve.alias["@styles"] = path.join(__dirname, "src/styles");
    config.resolve.alias["@utils"] = path.join(__dirname, "src/utils");
    config.resolve.alias["@public"] = path.join(__dirname, "public");

    return config;
  },
};
