# 🗳️ QuickPoll - Decentralized Prediction Market Platform

[![Linera](https://img.shields.io/badge/Linera-Blockchain-blue)](https://linera.io)
[![Rust](https://img.shields.io/badge/Rust-1.70+-orange)](https://www.rust-lang.org)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)
[![License](https://img.shields.io/badge/License-Apache%202.0-green)](LICENSE)

A Polymarket-style decentralized prediction market platform built on Linera blockchain with innovative three-subchain architecture.

## 🌟 Live Demo

- **Frontend**: [https://your-app.vercel.app](https://your-app.vercel.app) (Coming soon)
- **GitHub**: [https://github.com/YedianCheng/Quickpoll](https://github.com/YedianCheng/Quickpoll)
- **Video Demo**: [Watch Demo](https://youtube.com/...) (Coming soon)

## 🎯 Overview

QuickPoll is a cutting-edge decentralized prediction market platform that enables users to create and participate in prediction markets on various topics including politics, sports, finance, and more. Built on Linera blockchain, it features a unique three-subchain architecture for optimal performance and scalability.

### Key Features

- 🎨 **Modern UI**: Polymarket-style interface with sleek design
- ⛓️ **Three-Subchain Architecture**: Separate chains for users, polls, and oracle services
- 🔐 **Wallet Integration**: Full Linera wallet support
- 📊 **Real-time Probability**: Dynamic probability calculation based on voting amounts
- 🏷️ **Market Categories**: Politics, Sports, Finance, Crypto, Tech, and more
- 👑 **Admin Panel**: Complete management system with user and market approval
- 🔔 **Smart Notifications**: Non-intrusive notification system
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile

## 🏗️ Architecture

### Three-Subchain Design

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   User Chain    │      │   Poll Chain    │      │  Oracle Chain   │
├─────────────────┤      ├─────────────────┤      ├─────────────────┤
│ • Wallet        │◄────►│ • Market Data   │◄────►│ • Data Sources  │
│ • Asset Balance │      │ • Order Book    │      │ • Verification  │
│ • Vote History  │      │ • Participants  │      │ • Consensus     │
│ • Reputation    │      │ • Status        │      │ • Results       │
└─────────────────┘      └─────────────────┘      └─────────────────┘
         │                        │                        │
         └────────────────────────┴────────────────────────┘
                    Cross-Chain Messaging
```

### Project Structure

```
quickpoll/
├── src/                      # Rust Smart Contracts
│   ├── lib.rs               # ABI definitions
│   ├── state.rs             # State management
│   ├── contract.rs          # Main contract logic
│   ├── service.rs           # GraphQL service
│   ├── user_chain.rs        # User subchain
│   ├── poll_chain.rs        # Poll subchain
│   ├── oracle_chain.rs      # Oracle microchain
│   ├── cross_chain.rs       # Cross-chain messaging
│   └── chain_manager.rs     # Chain orchestration
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── App.tsx          # Main application
│   │   ├── AdminPanel.tsx   # Admin dashboard
│   │   ├── Notification.tsx # Notification system
│   │   ├── wallet.ts        # Wallet integration
│   │   └── config.ts        # Configuration
│   ├── deploy.sh            # Deployment script
│   └── vercel.json          # Vercel configuration
├── examples/                 # Demo programs
├── tests/                    # Integration tests
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites

- Rust 1.70+ with `wasm32-unknown-unknown` target
- Node.js 18+ and npm
- Linera CLI
- Git

### Local Development

#### 1. Clone the Repository

```bash
git clone https://github.com/YedianCheng/Quickpoll.git
cd Quickpoll
```

#### 2. Backend Setup

```bash
# Install Rust dependencies
cargo build

# Run tests
cargo test

# Build WASM contracts
cargo build --release --target wasm32-unknown-unknown
```

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:3000`

## 🌐 Deployment

### Deploy to Conway Testnet

#### 1. Configure Linera

```bash
# Initialize wallet with Conway testnet
linera wallet init --with-new-chain --faucet https://faucet.testnet-conway.linera.net

# Get test tokens from faucet
# Visit: https://faucet.testnet-conway.linera.net
```

#### 2. Deploy Smart Contracts

```bash
# Build contracts
cargo build --release --target wasm32-unknown-unknown

# Deploy to testnet
linera publish-and-create \
  target/wasm32-unknown-unknown/release/quickpoll_contract.wasm \
  target/wasm32-unknown-unknown/release/quickpoll_service.wasm

# Note down the Chain ID and Application ID
```

#### 3. Deploy Frontend to Vercel

```bash
cd frontend

# Update config with your deployment info
# Edit src/config.ts with your Chain ID and Application ID

# Deploy to Vercel
npm run build
vercel --prod

# Or connect GitHub repository to Vercel for auto-deployment
```

### Environment Variables

Create `.env` file in the frontend directory:

```env
REACT_APP_LINERA_GRAPHQL_ENDPOINT=https://conway-testnet.linera.net
REACT_APP_LINERA_CHAIN_ID=your-chain-id
REACT_APP_LINERA_APPLICATION_ID=your-application-id
```

## 💡 Features

### For Users

- **Create Markets**: Submit new prediction markets for review
- **Vote/Trade**: Buy YES or NO positions in active markets
- **Portfolio**: Track your voting history and positions
- **Search & Filter**: Find markets by category or search
- **Real-time Updates**: Live probability and volume updates

### For Administrators

- **User Management**: Approve and manage user accounts
- **Market Review**: Approve or reject submitted markets
- **Direct Publishing**: Create markets that publish immediately
- **Analytics Dashboard**: Monitor platform statistics
- **Data Management**: View and manage all platform data

### Technical Features

- **Microchain Architecture**: Each component runs on its own chain
- **Cross-Chain Messaging**: Efficient communication between chains
- **GraphQL API**: Flexible data querying
- **Wallet Integration**: Full Linera wallet support
- **Smart Notifications**: Toast-style, non-blocking notifications
- **Responsive Design**: Mobile-first approach
- **TypeScript**: Full type safety
- **Modern UI/UX**: Inspired by Polymarket

## 🛠️ Technology Stack

### Backend
- **Linera SDK**: Blockchain development framework
- **Rust**: Systems programming language
- **async-graphql**: GraphQL server
- **serde**: Serialization framework

### Frontend
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS
- **Vercel**: Deployment platform

## 📊 Smart Contract Features

### User Chain
- Wallet and asset management
- Voting history tracking
- Reputation system
- Voting power calculation

### Poll Chain
- Market creation and management
- Vote submission and tracking
- Participant management
- Status tracking (Active/Resolved)

### Oracle Chain
- External data source registration
- Result verification
- Consensus mechanism
- Signature validation

### Cross-Chain Communication
- Poll creation messages
- Vote submission messages
- Resolution messages
- Automated message queue

## 🧪 Testing

```bash
# Run all tests
cargo test

# Run specific test
cargo test --test single_chain

# Run with output
cargo test -- --nocapture

# Frontend tests
cd frontend
npm test
```

## 📚 Documentation

- [Deployment Guide](frontend/DEPLOYMENT.md)
- [API Documentation](docs/API.md)
- [Architecture Design](docs/ARCHITECTURE.md)
- [User Guide](docs/USER_GUIDE.md)

## 🎥 Demo Video

[Watch the full demo video](https://youtube.com/...) (Coming soon)

**What you'll see:**
- Market creation and approval workflow
- Voting and probability updates
- Admin panel features
- Wallet connection
- Real-time data updates

## 🗺️ Roadmap

### Wave 1 (Current) ✅
- [x] Three-subchain architecture
- [x] Basic market creation and voting
- [x] Modern UI/UX
- [x] Admin panel
- [x] Wallet integration
- [x] Deployment to Conway testnet

### Wave 2 (Planned)
- [ ] Real-time GraphQL subscriptions
- [ ] Advanced market types (scalar, multiple choice)
- [ ] Order book implementation
- [ ] Enhanced analytics
- [ ] Mobile app

### Wave 3 (Future)
- [ ] AI market maker integration
- [ ] Risk management tools
- [ ] Advanced oracle features
- [ ] Multi-chain support
- [ ] DAO governance

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👥 Team

- **Yedian Cheng** - Lead Developer
  - GitHub: [@YedianCheng](https://github.com/YedianCheng)
  - Telegram: @your-telegram
  - X (Twitter): @your-twitter

## 📄 License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Linera Team**: For the amazing blockchain SDK
- **Polymarket**: For UI/UX inspiration
- **Community**: For feedback and support

## 📞 Contact

- **Issues**: [GitHub Issues](https://github.com/YedianCheng/Quickpoll/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YedianCheng/Quickpoll/discussions)
- **Email**: your-email@example.com

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ on Linera Blockchain**

Making prediction markets accessible, transparent, and decentralized! 🚀