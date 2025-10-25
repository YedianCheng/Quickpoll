# Environment Variables Setup

## Conway Testnet Configuration

Create a `.env` file in the `frontend/` directory with the following content:

```env
# Linera Conway Testnet Configuration

# GraphQL Endpoint
# For local development: http://localhost:8080
# For Conway Testnet: https://conway-testnet.linera.net (if available)
REACT_APP_LINERA_GRAPHQL_ENDPOINT=http://localhost:8080

# Deployed Application Info (Conway Testnet)
REACT_APP_LINERA_CHAIN_ID=d1e24f0f84eb7b5a5b788f45b40d70e083488411eece8adfa811fe50998bdc7d
REACT_APP_LINERA_APPLICATION_ID=5088003121860631e0b4162399b1ca680eac820ce28b904e942dccf61f9e1aec

# Network Configuration
REACT_APP_NETWORK_NAME=Conway Testnet
REACT_APP_FAUCET_URL=https://faucet.testnet-conway.linera.net
```

## For Vercel Deployment

Add these environment variables in your Vercel project settings:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - `REACT_APP_LINERA_GRAPHQL_ENDPOINT`
   - `REACT_APP_LINERA_CHAIN_ID`
   - `REACT_APP_LINERA_APPLICATION_ID`
   - `REACT_APP_NETWORK_NAME`
   - `REACT_APP_FAUCET_URL`

## Current Deployment

- **Network**: Conway Testnet
- **Chain ID**: `d1e24f0f84eb7b5a5b788f45b40d70e083488411eece8adfa811fe50998bdc7d`
- **Application ID**: `5088003121860631e0b4162399b1ca680eac820ce28b904e942dccf61f9e1aec`
- **Owner**: `0xf1708614d4d6526ac5177e96478ba2f87954e50bc3b8ce494baf2dcd3a8d8dfb`

