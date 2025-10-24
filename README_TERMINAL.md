# QuickPoll Terminal Interactive Guide

## 🚀 How to Run Demos

### 1. Non-interactive Demo (Recommended to run this first)
```bash
cargo run --example terminal_demo
```

This demo will automatically show all features without user input.

### 2. Interactive Demo
```bash
cargo run --example interactive_terminal
```

This demo allows you to interact with the system through a menu.

## 📋 Feature Description

### Supported Operations:
1. **Create Poll** - Create new poll questions
2. **Vote** - Vote yes/no on existing polls
3. **Resolve Poll** - Administrators can end polls and set correct answers
4. **View Poll List** - View all poll statuses and results
5. **Help** - Display system help information
6. **Exit** - Exit the program

### Usage Examples:

#### Create Poll
- Select option 1
- Enter poll question, e.g.: "Do you think Rust is the best programming language?"
- Enter end time (seconds), default 86400 (24 hours)

#### Vote
- Select option 2
- Enter poll ID (get from create poll response)
- Choose 1=Yes or 0=No
- Enter vote amount, default 100

#### Resolve Poll
- Select option 3
- Enter poll ID to resolve
- Enter correct answer (1=Yes, 0=No)

#### View Poll List
- Select option 4
- System will display detailed information of all polls

## 🔧 Technical Features

- **Based on Linera blockchain framework**
- **GraphQL query support**
- **Type-safe Rust implementation**
- **Async processing support**

## 🎯 Use Cases

- **Community Governance Voting** - Community decision voting
- **Prediction Markets** - Users can predict event outcomes
- **Public Opinion Surveys** - Collect public opinions
- **Decision Support Systems** - Help organizations make decisions

## 🛠️ Development Guide

### Project Structure
```
src/
├── lib.rs          # ABI definition
├── state.rs        # Data structures and state
├── contract.rs     # Contract logic
└── service.rs      # GraphQL service

examples/
├── demo.rs                    # Simple demo
├── simple_demo.rs            # Detailed demo
├── terminal_demo.rs         # Non-interactive terminal demo
└── interactive_terminal.rs   # Interactive terminal demo
```

### Run Tests
```bash
# Run all tests
cargo test

# Run unit tests
cargo test --lib

# Run integration tests
cargo test --test single_chain
```

### Compile Check
```bash
# Check code
cargo check

# Compile project
cargo build

# Run specific example
cargo run --example terminal_demo
```

## 📝 Notes

1. **Interactive Demo**: If the program gets stuck in a loop, press `Ctrl+C` to stop
2. **Input Validation**: The program validates input validity
3. **Data Persistence**: Current demo version data is lost after program ends
4. **Error Handling**: The program includes basic error handling mechanisms

## 🎉 Getting Started

1. First run the non-interactive demo to understand features:
```bash
cargo run --example terminal_demo
```

2. Then try the interactive demo:
```bash
cargo run --example interactive_terminal
```

3. Follow the menu prompts to operate

## 💡 Tips

- This is a demo version, actual deployment requires Linera blockchain environment
- All operations are simulated and won't actually affect blockchain state
- You can run the program multiple times to test different scenarios