const PROXY_CONFIG = {
  "/api": {
    target: "http://localhost:80",
    secure: false,
    changeOrigin: false,
  },
  "/graphql": {
    target: "http://localhost:80",
    secure: false,
    changeOrigin: false,
  },
};

module.exports = PROXY_CONFIG;
