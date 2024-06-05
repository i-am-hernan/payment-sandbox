module.exports = {
  publicRuntimeConfig: {
    APP_NAME: process.env.APP_NAME || "Adyen Sandbox",
    API_UAT: process.env.API_UAT || "http://localhost:8080",
    API_PRODUCTION: process.env.API_PRODUCTION || "http://localhost:8080",
    PRODUCTION: process.env.PRODUCTION || true,
    DOMAIN_DEVELOPMENT: process.env.DOMAIN_DEVELOPMENT || "http://localhost:3000",
  },
};