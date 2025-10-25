/*! ABI of the QuickPoll Application */

use serde::{Deserialize, Serialize};
use linera_sdk::linera_base_types::{ContractAbi, ServiceAbi};

/// QuickPoll ABI
pub struct QuickPollAbi;

/// Operation Type
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Operation {
    /// Create new poll
    CreatePoll {
        question: String,
        end_time: u64,
    },

    /// Vote
    Vote {
        poll_id: u64,
        choice: bool,  // true = Yes, false = No
        amount: u64,
    },

    /// Resolve poll (admin operation)
    Resolve {
        poll_id: u64,
        correct_answer: bool,
    },
}

/// Response Type
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Response {
    /// Poll created successfully, return Poll ID
    PollCreated(u64),

    /// Vote successful
    VoteSuccess,

    /// Resolve successful
    ResolveSuccess,

    /// Error
    Error(String),
}

// Implement ContractAbi
impl ContractAbi for QuickPollAbi {
    type Operation = Operation;
    type Response = Response;
}

// Implement ServiceAbi
impl ServiceAbi for QuickPollAbi {
    type Query = async_graphql::Request;
    type QueryResponse = async_graphql::Response;
}
