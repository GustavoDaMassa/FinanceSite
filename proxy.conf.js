const PROXY_CONFIG = {
  "/api": {
    target: "http://localhost:8080",
    secure: false,
    changeOrigin: true,
    headers: { Origin: "http://localhost:8080" },
  },
  "/graphql": {
    target: "http://localhost:8080",
    secure: false,
    changeOrigin: true,
    headers: { Origin: "http://localhost:8080" },
  },
};

module.exports = PROXY_CONFIG;
