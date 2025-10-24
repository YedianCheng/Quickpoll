// QuickPoll Simple Demo Program
// Show basic functionality of voting system, avoid infinite loop issues

use quickpoll::{Operation, Response};

fn main() {
    println!("🗳️  QuickPoll Simple Demo");
    println!("======================");
    
    // Demonstrate creating poll
    println!("\n📝 1. Create Poll Demo:");
    let create_operation = Operation::CreatePoll {
        question: "Do you think Rust is the best programming language?".to_string(),
        end_time: 86400, // End after 24 hours
    };
    println!("   Operation: {:?}", create_operation);
    println!("   Expected Response: {:?}", Response::PollCreated(1));
    
    // Demonstrate voting
    println!("\n🗳️  2. Vote Demo:");
    let vote_operation = Operation::Vote {
        poll_id: 1,
        choice: true,  // Yes
        amount: 100,
    };
    println!("   Operation: {:?}", vote_operation);
    println!("   Expected Response: {:?}", Response::VoteSuccess);
    
    // Demonstrate resolving poll
    println!("\n✅ 3. Resolve Poll Demo:");
    let resolve_operation = Operation::Resolve {
        poll_id: 1,
        correct_answer: true,
    };
    println!("   Operation: {:?}", resolve_operation);
    println!("   Expected Response: {:?}", Response::ResolveSuccess);
    
    // Demonstrate error handling
    println!("\n❌ 4. Error Handling Demo:");
    println!("   Operation: Vote on non-existent poll");
    println!("   Expected Response: {:?}", Response::Error("Poll does not exist".to_string()));
    
    // Show system features
    println!("\n🔧 System Features:");
    println!("   • Based on Linera blockchain");
    println!("   • GraphQL query support");
    println!("   • Type-safe Rust implementation");
    println!("   • Async processing support");
    
    // Show use cases
    println!("\n🎯 Use Cases:");
    println!("   • Community governance voting");
    println!("   • Prediction markets");
    println!("   • Public opinion surveys");
    println!("   • Decision support systems");
    
    // Show technology stack
    println!("\n🛠️  Technology Stack:");
    println!("   • Rust - Systems programming language");
    println!("   • Linera SDK - Blockchain framework");
    println!("   • async-graphql - GraphQL support");
    println!("   • serde - Serialization/deserialization");
    
    println!("\n✨ Demo completed!");
    println!("💡 Tip: This is a voting system based on Linera blockchain");
    println!("   Can be used for prediction markets, governance voting, and other scenarios.");
}
