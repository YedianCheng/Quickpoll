// QuickPoll Demo Program
// Show how to use QuickPoll system

use quickpoll::{Operation, Response};

fn main() {
    println!("🚀 QuickPoll Demo Program");
    println!("====================");
    
    // Demonstrate operation types
    println!("\n📋 Supported Operations:");
    
    let create_poll = Operation::CreatePoll {
        question: "What do you think about this project?".to_string(),
        end_time: 1000,
    };
    println!("1. Create Poll: {:?}", create_poll);
    
    let vote = Operation::Vote {
        poll_id: 1,
        choice: true,  // Yes
        amount: 100,
    };
    println!("2. Vote: {:?}", vote);
    
    let resolve = Operation::Resolve {
        poll_id: 1,
        correct_answer: true,
    };
    println!("3. Resolve Poll: {:?}", resolve);
    
    // Demonstrate response types
    println!("\n📤 Response Types:");
    let responses = vec![
        Response::PollCreated(1),
        Response::VoteSuccess,
        Response::ResolveSuccess,
        Response::Error("Poll has ended".to_string()),
    ];
    
    for (i, response) in responses.iter().enumerate() {
        println!("{}. {:?}", i + 1, response);
    }
    
    println!("\n🎯 Use Cases:");
    println!("• Prediction Markets - Users can predict event outcomes");
    println!("• Governance Voting - Community decision voting");
    println!("• Public Opinion Surveys - Collect public opinions");
    println!("• Decision Support - Help organizations make decisions");
    
    println!("\n🔧 Technical Features:");
    println!("• Based on Linera blockchain");
    println!("• GraphQL query support");
    println!("• Type safety");
    println!("• Async processing");
    
    println!("\n✨ Demo completed!");
}
