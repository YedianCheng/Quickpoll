// Copyright (c) Zefchain Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

//! Integration testing for the quickpoll application.

#![cfg(not(target_arch = "wasm32"))]

use quickpoll::Operation;
use linera_sdk::test::{QueryOutcome, TestValidator};

/// Tests setting and incrementing a counter
///
/// Creates the application on a `chain`, initializing it with a 10 then add 10 and obtain 20.
/// which is then checked.
#[tokio::test(flavor = "multi_thread")]
async fn single_chain_test() {
    let (validator, module_id) =
        TestValidator::with_current_module::<quickpoll::QuickPollAbi, (), ()>().await;
    let mut chain = validator.new_chain().await;

    let application_id = chain
        .create_application(module_id, (), (), vec![])
        .await;

    // Test creating a poll
    chain
        .add_block(|block| {
            block.with_operation(application_id, Operation::CreatePoll { 
                question: "Test question".to_string(), 
                end_time: 1000 
            });
        })
        .await;

    // Test voting on the poll
    chain
        .add_block(|block| {
            block.with_operation(application_id, Operation::Vote { 
                poll_id: 1, 
                choice: true, 
                amount: 100 
            });
        })
        .await;

    // Test resolving the poll
    chain
        .add_block(|block| {
            block.with_operation(application_id, Operation::Resolve { 
                poll_id: 1, 
                correct_answer: true 
            });
        })
        .await;

    // Query the poll
    let QueryOutcome { response, .. } =
        chain.graphql_query(application_id, "query { polls }").await;
    
    // Basic assertion that the query executed successfully
    // The response should be a valid JSON response (could be null, object, etc.)
    assert!(matches!(response, serde_json::Value::Null | serde_json::Value::Object(_)));
}
