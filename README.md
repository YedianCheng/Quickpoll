# 🗳️ QuickPoll - Linera Blockchain Voting System

A complete blockchain voting system supporting poll creation, voting, and poll resolution.

## 🎯 Project Overview

QuickPoll is a voting system based on Linera blockchain, using Rust for smart contract development and React for frontend interface. The system supports prediction markets, governance voting, and public opinion surveys.

## 🏗️ Project Structure

```
quickpoll/
├── src/                    # Rust backend code
│   ├── lib.rs             # ABI definition
│   ├── state.rs           # Data structures and state
│   ├── contract.rs        # Smart contract logic
│   └── service.rs         # GraphQL service
├── frontend/              # React frontend
│   ├── src/
│   │   ├── App.tsx        # Main application component
│   │   └── index.tsx      # Application entry point
│   ├── package.json       # Frontend dependencies
│   └── README.md          # Frontend documentation
├── examples/              # Demo programs
│   ├── demo.rs           # Simple demo
│   ├── simple_demo.rs    # Detailed demo
│   └── terminal_demo.rs  # Non-interactive terminal demo
├── tests/                # Test files
│   └── single_chain.rs   # Integration tests
├── Cargo.toml           # Rust dependencies
└── README.md            # Project documentation
```

## 🚀 Quick Start

### Backend (Rust)

#### 1. Run Tests
```bash
# Run all tests
cargo test

# Run unit tests
cargo test --lib

# Run integration tests
cargo test --test single_chain
```

#### 2. Run Demos
```bash
# Non-interactive demo (recommended)
cargo run --example terminal_demo

# Simple demo
cargo run --example demo

# Detailed demo
cargo run --example simple_demo
```

### Frontend (React)

#### 1. Install Dependencies
```bash
cd frontend
npm install
```

#### 2. Start Development Server
```bash
npm start
```

Application will open at http://localhost:3000

#### 3. Build Production Version
```bash
npm run build
```

## 🎯 Features

### Core Features
- **Create Polls** - Users can create new poll questions
- **Vote** - Users can vote yes/no on polls
- **Resolve Polls** - Administrators can set correct answers and end polls
- **View Poll List** - Real-time display of all poll statuses and results

### Technical Features
- **Based on Linera Blockchain** - Developed using Linera SDK
- **GraphQL Support** - Provides GraphQL query interface
- **Type Safety** - Dual type safety with Rust and TypeScript
- **Async Processing** - Supports asynchronous operations
- **Modern UI** - Built with React + Tailwind CSS

## 🛠️ Technology Stack

### Backend
- **Rust** - Systems programming language
- **Linera SDK** - Blockchain development framework
- **async-graphql** - GraphQL support
- **serde** - Serialization/deserialization

### Frontend
- **React 18** - User interface library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Create React App** - Build tool

## 📱 Interface Preview

### Web Frontend
- Modern responsive design
- Intuitive voting management interface
- Real-time voting result display
- Support for desktop and mobile devices

### Terminal Demo
- Non-interactive demo (recommended)
- Automatic display of all features
- Suitable for understanding system functionality

## 🧪 Testing

### Run All Tests
```bash
cargo test
```

### Test Coverage
- **Unit Tests** - Contract logic testing
- **Integration Tests** - End-to-end testing
- **Frontend Tests** - React component testing

## 🚀 Deployment

### Backend Deployment
1. Build Rust project
2. Deploy to Linera testnet
3. Configure GraphQL service

### Frontend Deployment
1. Build React application: `npm run build`
2. Deploy to static hosting service
3. Configure environment variables

## 📝 Use Cases

- **Community Governance Voting** - Community decision voting
- **Prediction Markets** - Users can predict event outcomes
- **Public Opinion Surveys** - Collect public opinions
- **Decision Support Systems** - Help organizations make decisions

## 🔧 Development Guide

### Backend Development
1. Modify `src/contract.rs` to add new contract logic
2. Update `src/state.rs` to modify data structures
3. Add GraphQL queries in `src/service.rs`
4. Run `cargo test` to ensure tests pass

### Frontend Development
1. Modify `frontend/src/App.tsx` to update interface
2. Add custom styles in `frontend/src/App.css`
3. Run `npm start` to start development server

## 📚 Documentation

- [Backend API Documentation](src/)
- [Frontend Component Documentation](frontend/src/)
- [Deployment Guide](README_TERMINAL.md)
- [Development Guide](frontend/README.md)

## 🤝 Contributing

1. Fork the project
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

This project is licensed under the Apache 2.0 License.

## 🎉 Getting Started

1. **Clone Project**: `git clone <repository-url>`
2. **Run Backend Tests**: `cargo test`
3. **Start Frontend**: `cd frontend && npm start`
4. **Experience Features**: Open http://localhost:3000 in browser

## 💡 Tips

- This is a demo project showcasing a complete blockchain voting system
- Frontend uses mock backend, data is not persistent
- Actual deployment requires Linera blockchain environment
- All features are tested and verified

---

**QuickPoll** - Making voting simpler, more transparent, and more trustworthy! 🗳️✨