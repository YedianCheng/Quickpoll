// QuickPoll 演示程序
// 展示如何使用 QuickPoll 系统

use quickpoll::{Operation, Response};

fn main() {
    println!("🚀 QuickPoll 演示程序");
    println!("====================");
    
    // 演示操作类型
    println!("\n📋 支持的操作:");
    
    let create_poll = Operation::CreatePoll {
        question: "你认为这个项目怎么样？".to_string(),
        end_time: 1000,
    };
    println!("1. 创建投票: {:?}", create_poll);
    
    let vote = Operation::Vote {
        poll_id: 1,
        choice: true,  // 赞成
        amount: 100,
    };
    println!("2. 投票: {:?}", vote);
    
    let resolve = Operation::Resolve {
        poll_id: 1,
        correct_answer: true,
    };
    println!("3. 解决投票: {:?}", resolve);
    
    // 演示响应类型
    println!("\n📤 响应类型:");
    let responses = vec![
        Response::PollCreated(1),
        Response::VoteSuccess,
        Response::ResolveSuccess,
        Response::Error("投票已结束".to_string()),
    ];
    
    for (i, response) in responses.iter().enumerate() {
        println!("{}. {:?}", i + 1, response);
    }
    
    println!("\n🎯 使用场景:");
    println!("• 预测市场 - 用户可以预测事件结果");
    println!("• 治理投票 - 社区决策投票");
    println!("• 民意调查 - 收集公众意见");
    println!("• 决策支持 - 帮助组织做出决策");
    
    println!("\n🔧 技术特点:");
    println!("• 基于 Linera 区块链");
    println!("• GraphQL 查询支持");
    println!("• 类型安全");
    println!("• 异步处理");
    
    println!("\n✨ 演示完成！");
}
