// QuickPoll Terminal Interactive Demo
// A simple, secure command-line interface

use std::io::{self, Write};
use quickpoll::{Operation, Response};

#[derive(Debug)]
struct MockPoll {
    id: u64,
    question: String,
    yes_votes: u64,
    no_votes: u64,
    yes_amount: u64,
    no_amount: u64,
    status: PollStatus,
}

#[derive(Debug)]
enum PollStatus {
    Active,
    Resolved,
}

struct QuickPollApp {
    polls: Vec<MockPoll>,
    next_poll_id: u64,
}

impl QuickPollApp {
    fn new() -> Self {
        Self {
            polls: Vec::new(),
            next_poll_id: 1,
        }
    }
    
    fn create_poll(&mut self, question: String, end_time: u64) -> Response {
        let poll = MockPoll {
            id: self.next_poll_id,
            question,
            yes_votes: 0,
            no_votes: 0,
            yes_amount: 0,
            no_amount: 0,
            status: PollStatus::Active,
        };
        
        self.polls.push(poll);
        let poll_id = self.next_poll_id;
        self.next_poll_id += 1;
        
        Response::PollCreated(poll_id)
    }
    
    fn vote(&mut self, poll_id: u64, choice: bool, amount: u64) -> Response {
        if let Some(poll) = self.polls.iter_mut().find(|p| p.id == poll_id) {
            if choice {
                poll.yes_votes += 1;
                poll.yes_amount += amount;
            } else {
                poll.no_votes += 1;
                poll.no_amount += amount;
            }
            Response::VoteSuccess
        } else {
            Response::Error("Poll does not exist".to_string())
        }
    }
    
    fn resolve(&mut self, poll_id: u64, correct_answer: bool) -> Response {
        if let Some(poll) = self.polls.iter_mut().find(|p| p.id == poll_id) {
            poll.status = PollStatus::Resolved;
            Response::ResolveSuccess
        } else {
            Response::Error("Poll does not exist".to_string())
        }
    }
    
    fn list_polls(&self) {
        println!("\n📊 Current Poll List:");
        if self.polls.is_empty() {
            println!("  No polls available");
        } else {
            for poll in &self.polls {
                println!("  ID: {} | Question: {} | Yes: {} votes({}) | No: {} votes({}) | Status: {:?}", 
                    poll.id, poll.question, poll.yes_votes, poll.yes_amount, 
                    poll.no_votes, poll.no_amount, poll.status);
            }
        }
    }
}

fn get_input(prompt: &str) -> String {
    print!("{}", prompt);
    io::stdout().flush().unwrap();
    let mut input = String::new();
    io::stdin().read_line(&mut input).unwrap();
    input.trim().to_string()
}

fn get_number(prompt: &str, default: u64) -> u64 {
    let input = get_input(prompt);
    input.parse().unwrap_or(default)
}

fn main() {
    println!("🗳️  QuickPoll Terminal Interactive Demo");
    println!("==============================");
    println!("Welcome to QuickPoll voting system!");
    println!("This is a voting system demo based on Linera blockchain.\n");
    
    let mut app = QuickPollApp::new();
    
    // Demonstrate some basic operations
    println!("🚀 Starting demo...\n");
    
    // 1. Create poll
    println!("📝 1. Create Poll Demo:");
    let response = app.create_poll("Do you think Rust is the best programming language?".to_string(), 86400);
    println!("   Operation: CreatePoll {{ question: \"Do you think Rust is the best programming language?\", end_time: 86400 }}");
    println!("   Response: {:?}\n", response);
    
    // 2. Vote
    println!("🗳️  2. Vote Demo:");
    let response = app.vote(1, true, 100);
    println!("   Operation: Vote {{ poll_id: 1, choice: true, amount: 100 }}");
    println!("   Response: {:?}\n", response);
    
    // 3. Vote again
    println!("🗳️  3. Vote Again Demo:");
    let response = app.vote(1, false, 50);
    println!("   Operation: Vote {{ poll_id: 1, choice: false, amount: 50 }}");
    println!("   Response: {:?}\n", response);
    
    // 4. View poll list
    println!("📊 4. View Poll List:");
    app.list_polls();
    println!();
    
    // 5. Resolve poll
    println!("✅ 5. Resolve Poll Demo:");
    let response = app.resolve(1, true);
    println!("   Operation: Resolve {{ poll_id: 1, correct_answer: true }}");
    println!("   Response: {:?}\n", response);
    
    // 6. Final status
    println!("📊 6. Final Poll Status:");
    app.list_polls();
    println!();
    
    println!("🔧 System Features:");
    println!("   • Based on Linera blockchain framework");
    println!("   • GraphQL query support");
    println!("   • Type-safe Rust implementation");
    println!("   • Async processing support\n");
    
    println!("🎯 Use Cases:");
    println!("   • Community governance voting");
    println!("   • Prediction markets");
    println!("   • Public opinion surveys");
    println!("   • Decision support systems\n");
    
    println!("✨ Demo completed!");
    println!("💡 Tip: This is a voting system based on Linera blockchain");
    println!("   Can be used for prediction markets, governance voting, and other scenarios.\n");
}
