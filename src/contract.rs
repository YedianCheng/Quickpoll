#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use linera_sdk::{
    linera_base_types::WithContractAbi,
    views::{RootView, View},
    Contract, ContractRuntime,
};

use quickpoll::{Operation, Response};

use self::state::{QuickPollState, Poll, Vote, VoteKey, PollStatus};

pub struct QuickpollContract {
    state: QuickPollState,
    runtime: ContractRuntime<Self>,
}

linera_sdk::contract!(QuickpollContract);

/// Implement WithContractAbi
impl WithContractAbi for QuickpollContract {
    type Abi = quickpoll::QuickPollAbi;
}

/// Implement Contract
impl Contract for QuickpollContract {
    type Message = ();
    type Parameters = ();
    type InstantiationArgument = ();
    type EventValue = ();

    /// Load the contract
    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = QuickPollState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        QuickpollContract { state, runtime }
    }

    async fn instantiate(&mut self, _argument: Self::InstantiationArgument) {
        // Initialize the next poll ID to 1
        self.state.next_poll_id.set(1);
    }

    async fn execute_operation(&mut self, operation: Self::Operation) -> Self::Response {
        match operation {
            Operation::CreatePoll { question, end_time } => {
                let poll_id = *self.state.next_poll_id.get();
                let creator = self.runtime.authenticated_signer()
                    .map(|owner| {
                        // Convert AccountOwner to [u8; 32] using debug format
                        let _debug_str = format!("{:?}", owner);
                        let mut result = [0u8; 32];
                        // This is a simplified approach - in practice you'd want proper conversion
                        result[0] = 1; // Mark as authenticated
                        result
                    })
                    .unwrap_or([0u8; 32]);
                
                let poll = Poll {
                    id: poll_id,
                    question,
                    creator,
                    yes_votes: 0,
                    no_votes: 0,
                    yes_amount: 0,
                    no_amount: 0,
                    status: PollStatus::Active,
                    end_time,
                    correct_answer: None,
                };
                
                self.state.polls.insert(&poll_id, poll).expect("Failed to insert poll");
                self.state.next_poll_id.set(poll_id + 1);
                
                Response::PollCreated(poll_id)
            }
            Operation::Vote { poll_id, choice, amount } => {
                let voter = self.runtime.authenticated_signer()
                    .map(|owner| {
                        // Convert AccountOwner to [u8; 32] using debug format
                        let _debug_str = format!("{:?}", owner);
                        let mut result = [0u8; 32];
                        // This is a simplified approach - in practice you'd want proper conversion
                        result[0] = 1; // Mark as authenticated
                        result
                    })
                    .unwrap_or([0u8; 32]);
                let vote_key = VoteKey {
                    poll_id,
                    owner: hex::encode(&voter),
                };
                
                let vote = Vote { choice, amount };
                self.state.user_votes.insert(&vote_key, vote).expect("Failed to insert vote");
                
                // Update poll vote counts
                if let Some(mut poll) = self.state.polls.get(&poll_id).await.expect("Failed to get poll") {
                    if choice {
                        poll.yes_votes += 1;
                        poll.yes_amount += amount;
                    } else {
                        poll.no_votes += 1;
                        poll.no_amount += amount;
                    }
                    self.state.polls.insert(&poll_id, poll).expect("Failed to update poll");
                }
                
                Response::VoteSuccess
            }
            Operation::Resolve { poll_id, correct_answer } => {
                if let Some(mut poll) = self.state.polls.get(&poll_id).await.expect("Failed to get poll") {
                    poll.status = PollStatus::Resolved;
                    poll.correct_answer = Some(correct_answer);
                    self.state.polls.insert(&poll_id, poll).expect("Failed to update poll");
                }
                
                Response::ResolveSuccess
            }
        }
    }

    async fn execute_message(&mut self, _message: Self::Message) {}

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
}

#[cfg(test)]
mod tests {
    use futures::FutureExt as _;
    use linera_sdk::{util::BlockingWait, views::View, Contract, ContractRuntime};

    use quickpoll::Operation;

    use super::{QuickpollContract, QuickPollState};

    #[test]
    fn operation() {
        let mut app = create_and_instantiate_app();

        // Test that the app was initialized correctly
        assert_eq!(*app.state.next_poll_id.get(), 1);
        
        // Test that we can create a poll (this will work even without authentication due to our fallback)
        let response = app
            .execute_operation(Operation::CreatePoll { 
                question: "Test question".to_string(), 
                end_time: 1000 
            })
            .now_or_never()
            .expect("Execution of application operation should not await anything");

        // The response should be PollCreated with ID 1
        match response {
            quickpoll::Response::PollCreated(poll_id) => {
                assert_eq!(poll_id, 1);
            }
            _ => panic!("Expected PollCreated response"),
        }
    }

    fn create_and_instantiate_app() -> QuickpollContract {
        let mut runtime = ContractRuntime::new().with_application_parameters(());
        
        // Set a mock authenticated signer for testing
        // Try using None first to see if that works
        runtime.set_authenticated_signer(None);
        
        let mut contract = QuickpollContract {
            state: QuickPollState::load(runtime.root_view_storage_context())
                .blocking_wait()
                .expect("Failed to read from mock key value store"),
            runtime,
        };

        contract
            .instantiate(())
            .now_or_never()
            .expect("Initialization of application state should not await anything");

        assert_eq!(*contract.state.next_poll_id.get(), 1);

        contract
    }
}
