const PROXY_CONFIG = {
  "/api": {
    target: "http://localhost:80",
    secure: false,
    changeOrigin: true,
    headers: { Origin: "http://localhost:80" },
  },
  "/graphql": {
    target: "http://localhost:80",
    secure: false,
    changeOrigin: true,
    headers: { Origin: "http://localhost:80" },
  },
};

module.exports = PROXY_CONFIG;
