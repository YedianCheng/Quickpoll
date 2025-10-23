# QuickPoll - Linera Blockchain Voting System

## 🎯 Project Overview

**QuickPoll** is a decentralized voting system built on the Linera blockchain, enabling transparent and secure community governance through blockchain-based voting mechanisms.

## 🚀 Features

- **🔗 Wallet Integration**: Connect with Linera wallet for secure authentication
- **🗳️ Decentralized Voting**: Create and participate in polls on the blockchain
- **👥 Role-based Access**: Admin and user roles with different permissions
- **📊 Real-time Results**: Live voting statistics and poll resolution
- **🔒 Blockchain Storage**: All data stored on Linera blockchain
- **💾 Data Persistence**: Refresh-resistant data storage

## 🛠️ Technology Stack

### Backend (Linera Blockchain)
- **Rust** - Smart contract development
- **Linera SDK v0.15.3** - Blockchain framework
- **async-graphql** - GraphQL API
- **serde** - Serialization

### Frontend
- **React 18** - User interface
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Linera Integration** - Blockchain connectivity

## 📋 Linera SDK Features Used

1. **Linera SDK v0.15.3**
   - Smart contract development
   - GraphQL service integration
   - Blockchain state management
   - Transaction handling

2. **Linera Protocol Features**
   - Local testnet deployment
   - Wallet integration
   - Chain state management
   - Application deployment

## 🏃‍♂️ Quick Start

### Prerequisites
- Rust 1.70+
- Node.js 16+
- Linera CLI

### Backend Setup
```bash
# Clone repository
git clone <repository-url>
cd quickpoll

# Build smart contracts
cargo build --release --target wasm32-unknown-unknown

# Deploy to Linera testnet
linera publish-and-create target/wasm32-unknown-unknown/release/quickpoll_contract.wasm target/wasm32-unknown-unknown/release/quickpoll_service.wasm
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Access Application
- **Frontend**: http://localhost:3000
- **Linera Service**: http://localhost:8080

## 🎥 Demo

### Live Demo
- **URL**: http://localhost:3000
- **Features**: Wallet connection, voting, poll creation, data persistence

### Demo Steps
1. Connect Linera wallet
2. Create polls (admin role)
3. Vote on polls (user role)
4. View real-time results
5. Resolve polls (admin role)

## 👥 Team Information

**Team**: QuickPoll Development Team
- **Contact**: [Your Telegram] | [Your X/Twitter]
- **Repository**: [GitHub URL]

## 📈 Changelog

### Wave 1 - Initial Implementation
- ✅ Smart contract development with Linera SDK
- ✅ React frontend with wallet integration
- ✅ GraphQL service implementation
- ✅ Local testnet deployment
- ✅ Data persistence and blockchain storage
- ✅ Role-based access control
- ✅ Real-time voting system

## 🔧 Development Notes

### Linera Integration
- Smart contracts deployed on local Linera testnet
- GraphQL API for blockchain data access
- Wallet-based authentication
- Transaction-based voting system

### Architecture
- **Smart Contract**: Rust-based Linera application
- **Frontend**: React with Linera wallet integration
- **Storage**: Blockchain-based data persistence
- **API**: GraphQL service for data queries

## 📄 License

This project is open-source and available under the Apache 2.0 License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

---

**QuickPoll** - Making decentralized governance accessible and transparent! 🗳️✨
