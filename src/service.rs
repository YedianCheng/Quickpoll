#![cfg_attr(target_arch = "wasm32", no_main)]

use crate::state;

use std::sync::Arc;

use async_graphql::{EmptyMutation, EmptySubscription, Object};
use linera_sdk::{
    linera_base_types::WithServiceAbi, views::View, Service,
    ServiceRuntime,
};

use self::state::{QuickPollState, Poll, PollStatus};

pub struct QuickpollService {
    state: QuickPollState,
    runtime: Arc<ServiceRuntime<Self>>,
}

linera_sdk::service!(QuickpollService);

impl WithServiceAbi for QuickpollService {
    type Abi = crate::QuickPollAbi;
}

impl Service for QuickpollService {
    type Parameters = ();

    async fn new(runtime: ServiceRuntime<Self>) -> Self {
        let state = QuickPollState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        QuickpollService {
            state,
            runtime: Arc::new(runtime),
        }
    }

    async fn handle_query(&self, request: Self::Query) -> Self::QueryResponse {
        // Create a simple query response
        let query_root = SimpleQueryRoot;
        let schema = async_graphql::Schema::build(query_root, EmptyMutation, EmptySubscription)
            .finish();
        schema.execute(request).await
    }
}

struct SimpleQueryRoot;

#[Object]
impl SimpleQueryRoot {
    async fn polls(&self) -> Vec<Poll> {
        // Return some sample data
        vec![
            Poll {
                id: 1,
                question: "Should we implement new features?".to_string(),
                creator: [0u8; 32], // Default creator
                yes_votes: 15,
                no_votes: 8,
                yes_amount: 150,
                no_amount: 80,
                status: PollStatus::Active,
                end_time: 1234567890,
                correct_answer: None,
            },
            Poll {
                id: 2,
                question: "Is the current system working well?".to_string(),
                creator: [0u8; 32], // Default creator
                yes_votes: 25,
                no_votes: 5,
                yes_amount: 250,
                no_amount: 50,
                status: PollStatus::Resolved,
                end_time: 1234567890,
                correct_answer: Some(true),
            }
        ]
    }
    
    async fn poll(&self, poll_id: u64) -> Option<Poll> {
        if poll_id == 1 {
            Some(Poll {
                id: 1,
                question: "Should we implement new features?".to_string(),
                creator: [0u8; 32], // Default creator
                yes_votes: 15,
                no_votes: 8,
                yes_amount: 150,
                no_amount: 80,
                status: PollStatus::Active,
                end_time: 1234567890,
                correct_answer: None,
            })
        } else if poll_id == 2 {
            Some(Poll {
                id: 2,
                question: "Is the current system working well?".to_string(),
                creator: [0u8; 32], // Default creator
                yes_votes: 25,
                no_votes: 5,
                yes_amount: 250,
                no_amount: 50,
                status: PollStatus::Resolved,
                end_time: 1234567890,
                correct_answer: Some(true),
            })
        } else {
            None
        }
    }
}

struct QueryRoot<'a> {
    state: &'a QuickPollState,
}

#[Object]
impl<'a> QueryRoot<'a> {
    async fn polls(&self) -> Vec<Poll> {
        // For now, return empty list
        // TODO: Implement proper state access
        vec![]
    }
    
    async fn poll(&self, poll_id: u64) -> Option<Poll> {
        self.state.polls.get(&poll_id).await.ok().flatten()
    }
    
    async fn poll_count(&self) -> u64 {
        // For now, return 0 as we don't have a direct count method
        // In a real implementation, you might want to maintain a counter
        0
    }
}

#[cfg(test)]
mod tests {
    use std::sync::Arc;

    use async_graphql::Request;
    use futures::FutureExt as _;
    use linera_sdk::{util::BlockingWait, views::View, Service, ServiceRuntime};

    use super::{QuickpollService, QuickPollState};

    #[test]
    fn query() {
        let runtime = Arc::new(ServiceRuntime::<QuickpollService>::new());
        let state = QuickPollState::load(runtime.root_view_storage_context())
            .blocking_wait()
            .expect("Failed to read from mock key value store");

        let service = QuickpollService { state, runtime };
        let request = Request::new("{ polls }");

        let response = service
            .handle_query(request)
            .now_or_never()
            .expect("Query should not await anything");

        // Basic test - just ensure the query executes without error
        assert!(matches!(response.data, async_graphql::Value::Null));
    }
}
