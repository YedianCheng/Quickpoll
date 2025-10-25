# 🚀 QuickPoll - Conway Testnet Deployment

## ✅ Deployment Status: SUCCESSFUL

**Deployment Date**: October 25, 2025  
**Network**: Conway Testnet  
**Linera Protocol Version**: v0.15.4

---

## 📊 Deployment Details

### Smart Contract Information

| Property | Value |
|----------|-------|
| **Chain ID** | `d1e24f0f84eb7b5a5b788f45b40d70e083488411eece8adfa811fe50998bdc7d` |
| **Application ID** | `5088003121860631e0b4162399b1ca680eac820ce28b904e942dccf61f9e1aec` |
| **Owner Address** | `0xf1708614d4d6526ac5177e96478ba2f87954e50bc3b8ce494baf2dcd3a8d8dfb` |
| **Network** | Conway Testnet |
| **Faucet URL** | https://faucet.testnet-conway.linera.net |

### Contract Files

- **Contract WASM**: `target/wasm32-unknown-unknown/release/quickpoll_contract.wasm` (193 KB)
- **Service WASM**: `target/wasm32-unknown-unknown/release/quickpoll_service.wasm` (1.1 MB)

---

## 🔑 Key Deployment Steps

### 1. Environment Setup

```bash
# Created testnet directory
mkdir -p ~/.linera_testnet

# Set environment variables
export LINERA_WALLET=$HOME/.linera_testnet/wallet_0.json
export LINERA_KEYSTORE=$HOME/.linera_testnet/keystore_0.json
export LINERA_STORAGE=rocksdb:$HOME/.linera_testnet/client_0.db
```

### 2. Wallet Initialization

```bash
# Initialized wallet with Conway testnet faucet
linera wallet init --faucet https://faucet.testnet-conway.linera.net

# Requested a new chain (CRITICAL STEP!)
linera wallet request-chain --faucet https://faucet.testnet-conway.linera.net
```

### 3. Contract Deployment

```bash
# Built WASM contracts
cargo build --release --target wasm32-unknown-unknown

# Deployed to Conway Testnet
linera publish-and-create \
  target/wasm32-unknown-unknown/release/quickpoll_contract.wasm \
  target/wasm32-unknown-unknown/release/quickpoll_service.wasm
```

**Result**: ✅ Application published successfully in 2042 ms

---

## 🎯 Verification

### Check Deployment Status

```bash
# View wallet and chains
linera wallet show

# Query application
linera query-application 5088003121860631e0b4162399b1ca680eac820ce28b904e942dccf61f9e1aec
```

### Expected Output

```
Chain ID: d1e24f0f84eb7b5a5b788f45b40d70e083488411eece8adfa811fe50998bdc7d
AccountOwner: 0xf1708614d4d6526ac5177e96478ba2f87954e50bc3b8ce494baf2dcd3a8d8dfb
Block Height: 1
Status: Active
```

---

## 🌐 Frontend Configuration

### Updated Files

1. **`frontend/src/config.ts`**
   - Updated `LINERA_CHAIN_ID` to deployed chain
   - Updated `LINERA_APPLICATION_ID` to deployed app
   - Added network info constants

2. **`frontend/ENV_SETUP.md`**
   - Created environment variable guide
   - Added Vercel deployment instructions

### Environment Variables

```env
REACT_APP_LINERA_GRAPHQL_ENDPOINT=http://localhost:8080
REACT_APP_LINERA_CHAIN_ID=d1e24f0f84eb7b5a5b788f45b40d70e083488411eece8adfa811fe50998bdc7d
REACT_APP_LINERA_APPLICATION_ID=5088003121860631e0b4162399b1ca680eac820ce28b904e942dccf61f9e1aec
REACT_APP_NETWORK_NAME=Conway Testnet
REACT_APP_FAUCET_URL=https://faucet.testnet-conway.linera.net
```

---

## 💡 Important Notes

### Critical Discovery

The key to successful deployment on Conway Testnet was using:

```bash
linera wallet request-chain --faucet <FAUCET_URL>
```

Instead of relying solely on `linera wallet init`. This ensures:
- ✅ Proper owner assignment
- ✅ Valid chain creation
- ✅ Ability to propose blocks

### Common Issues Avoided

1. ❌ **Owner: null** - Fixed by using `request-chain`
2. ❌ **Version mismatch** - Ensured v0.15.4 for both CLI and SDK
3. ❌ **PATH conflicts** - Removed old Linera installations

---

## 📚 References

- **Linera Documentation**: https://docs.linera.io
- **Conway Testnet**: https://faucet.testnet-conway.linera.net
- **GitHub Repository**: https://github.com/YedianCheng/Quickpoll
- **Linera Protocol**: https://github.com/linera-io/linera-protocol

---

## 🎉 Next Steps

- [ ] Deploy frontend to Vercel
- [ ] Record demo video
- [ ] Submit Wave 1 application
- [ ] Monitor testnet performance
- [ ] Gather user feedback

---

**Deployment Completed Successfully** ✅  
**Ready for Wave 1 Submission** 🚀

