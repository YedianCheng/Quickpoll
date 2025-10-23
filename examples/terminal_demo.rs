// QuickPoll 终端交互演示
// 一个简单、安全的命令行界面

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
            Response::Error("投票不存在".to_string())
        }
    }
    
    fn resolve(&mut self, poll_id: u64, correct_answer: bool) -> Response {
        if let Some(poll) = self.polls.iter_mut().find(|p| p.id == poll_id) {
            poll.status = PollStatus::Resolved;
            Response::ResolveSuccess
        } else {
            Response::Error("投票不存在".to_string())
        }
    }
    
    fn list_polls(&self) {
        println!("\n📊 当前投票列表:");
        if self.polls.is_empty() {
            println!("  暂无投票");
        } else {
            for poll in &self.polls {
                println!("  ID: {} | 问题: {} | 赞成: {}票({}) | 反对: {}票({}) | 状态: {:?}", 
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
    println!("🗳️  QuickPoll 终端交互演示");
    println!("==============================");
    println!("欢迎使用 QuickPoll 投票系统！");
    println!("这是一个基于 Linera 区块链的投票系统演示。\n");
    
    let mut app = QuickPollApp::new();
    
    // 演示一些基本操作
    println!("🚀 开始演示...\n");
    
    // 1. 创建投票
    println!("📝 1. 创建投票演示:");
    let response = app.create_poll("你认为 Rust 是最好的编程语言吗？".to_string(), 86400);
    println!("   操作: CreatePoll {{ question: \"你认为 Rust 是最好的编程语言吗？\", end_time: 86400 }}");
    println!("   响应: {:?}\n", response);
    
    // 2. 投票
    println!("🗳️  2. 投票演示:");
    let response = app.vote(1, true, 100);
    println!("   操作: Vote {{ poll_id: 1, choice: true, amount: 100 }}");
    println!("   响应: {:?}\n", response);
    
    // 3. 再次投票
    println!("🗳️  3. 再次投票演示:");
    let response = app.vote(1, false, 50);
    println!("   操作: Vote {{ poll_id: 1, choice: false, amount: 50 }}");
    println!("   响应: {:?}\n", response);
    
    // 4. 查看投票列表
    println!("📊 4. 查看投票列表:");
    app.list_polls();
    println!();
    
    // 5. 解决投票
    println!("✅ 5. 解决投票演示:");
    let response = app.resolve(1, true);
    println!("   操作: Resolve {{ poll_id: 1, correct_answer: true }}");
    println!("   响应: {:?}\n", response);
    
    // 6. 最终状态
    println!("📊 6. 最终投票状态:");
    app.list_polls();
    println!();
    
    println!("🔧 系统特点:");
    println!("   • 基于 Linera 区块链框架");
    println!("   • 支持 GraphQL 查询");
    println!("   • 类型安全的 Rust 实现");
    println!("   • 异步处理支持\n");
    
    println!("🎯 使用场景:");
    println!("   • 社区治理投票");
    println!("   • 预测市场");
    println!("   • 民意调查");
    println!("   • 决策支持系统\n");
    
    println!("✨ 演示完成！");
    println!("💡 提示: 这是一个基于 Linera 区块链的投票系统");
    println!("   可以用于预测市场、治理投票等场景。\n");
}
