// QuickPoll 简单演示程序
// 展示投票系统的基本功能，避免死循环问题

use quickpoll::{Operation, Response};

fn main() {
    println!("🗳️  QuickPoll 简单演示");
    println!("======================");
    
    // 演示创建投票
    println!("\n📝 1. 创建投票演示:");
    let create_operation = Operation::CreatePoll {
        question: "你认为 Rust 是最好的编程语言吗？".to_string(),
        end_time: 86400, // 24小时后结束
    };
    println!("   操作: {:?}", create_operation);
    println!("   预期响应: {:?}", Response::PollCreated(1));
    
    // 演示投票
    println!("\n🗳️  2. 投票演示:");
    let vote_operation = Operation::Vote {
        poll_id: 1,
        choice: true,  // 赞成
        amount: 100,
    };
    println!("   操作: {:?}", vote_operation);
    println!("   预期响应: {:?}", Response::VoteSuccess);
    
    // 演示解决投票
    println!("\n✅ 3. 解决投票演示:");
    let resolve_operation = Operation::Resolve {
        poll_id: 1,
        correct_answer: true,
    };
    println!("   操作: {:?}", resolve_operation);
    println!("   预期响应: {:?}", Response::ResolveSuccess);
    
    // 演示错误情况
    println!("\n❌ 4. 错误处理演示:");
    println!("   操作: 投票到不存在的投票");
    println!("   预期响应: {:?}", Response::Error("投票不存在".to_string()));
    
    // 展示系统特点
    println!("\n🔧 系统特点:");
    println!("   • 基于 Linera 区块链");
    println!("   • 支持 GraphQL 查询");
    println!("   • 类型安全的 Rust 实现");
    println!("   • 异步处理支持");
    
    // 展示使用场景
    println!("\n🎯 使用场景:");
    println!("   • 社区治理投票");
    println!("   • 预测市场");
    println!("   • 民意调查");
    println!("   • 决策支持系统");
    
    // 展示技术栈
    println!("\n🛠️  技术栈:");
    println!("   • Rust - 系统编程语言");
    println!("   • Linera SDK - 区块链框架");
    println!("   • async-graphql - GraphQL 支持");
    println!("   • serde - 序列化/反序列化");
    
    println!("\n✨ 演示完成！");
    println!("💡 提示: 这是一个基于 Linera 区块链的投票系统");
    println!("   可以用于预测市场、治理投票等场景。");
}
