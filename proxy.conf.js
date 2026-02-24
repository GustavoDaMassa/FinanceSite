const PROXY_CONFIG = {
  "/api": {
    target: "https://api.financeapi.com.br",
    secure: true,
    changeOrigin: true,
  },
  "/graphql": {
    target: "https://api.financeapi.com.br",
    secure: true,
    changeOrigin: true,
  },
};

module.exports = PROXY_CONFIG;
