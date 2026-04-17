// Proxy para demo na AWS — aponta para o Gateway público (EC2-1)
// Uso: ng serve --proxy-config proxy.conf.aws.js

const GATEWAY_URL = 'http://54.90.62.101:8080';

const PROXY_CONFIG = {
  "/api": {
    target: GATEWAY_URL,
    secure: false,
    changeOrigin: true,
  },
  "/graphql": {
    target: GATEWAY_URL,
    secure: false,
    changeOrigin: true,
  },
  "/financeapi": {
    target: GATEWAY_URL,
    secure: false,
    changeOrigin: true,
  },
};

module.exports = PROXY_CONFIG;
