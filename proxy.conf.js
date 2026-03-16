const isProduction = process.env['NODE_ENV'] === 'production';
const BACKEND_URL = isProduction ? 'https://api.financeapi.com.br' : 'http://localhost:8080';

const PROXY_CONFIG = {
  "/api": {
    target: BACKEND_URL,
    secure: isProduction,
    changeOrigin: true,
  },
  "/graphql": {
    target: BACKEND_URL,
    secure: isProduction,
    changeOrigin: true,
  },
};

module.exports = PROXY_CONFIG;
