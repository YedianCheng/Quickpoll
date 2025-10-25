// /frontend/src/config.ts

// Conway Testnet Configuration
export const LINERA_GRAPHQL_ENDPOINT = process.env.REACT_APP_LINERA_GRAPHQL_ENDPOINT || 'http://localhost:8080';

// Deployed on Conway Testnet
export const LINERA_CHAIN_ID = process.env.REACT_APP_LINERA_CHAIN_ID || 'd1e24f0f84eb7b5a5b788f45b40d70e083488411eece8adfa811fe50998bdc7d';
export const LINERA_APPLICATION_ID = process.env.REACT_APP_LINERA_APPLICATION_ID || '5088003121860631e0b4162399b1ca680eac820ce28b904e942dccf61f9e1aec';

// Network Info
export const NETWORK_NAME = 'Conway Testnet';
export const FAUCET_URL = 'https://faucet.testnet-conway.linera.net';