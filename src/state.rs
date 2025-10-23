use linera_sdk::views::{linera_views, MapView, RegisterView, RootView, ViewStorageContext};
use serde::{Deserialize, Serialize};

/// Poll ID 
pub type PollId = u64;

/// Owner 
pub type Owner = [u8; 32];

/// Composite key for user votes
#[derive(Debug, Clone, Serialize, Deserialize, async_graphql::SimpleObject, async_graphql::InputObject, PartialEq, Eq, Hash)]
pub struct VoteKey {
    pub poll_id: PollId,
    pub owner: String, // Convert [u8; 32] to hex string for GraphQL compatibility
}

/// Poll Status
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq, async_graphql::Enum)]
pub enum PollStatus {
    Active,
    Resolved,
}

/// Single Poll
#[derive(Debug, Clone, Serialize, Deserialize, async_graphql::SimpleObject)]
pub struct Poll {
    pub id: PollId,
    pub question: String,
    pub creator: Owner,
    pub yes_votes: u64,
    pub no_votes: u64,
    pub yes_amount: u64,
    pub no_amount: u64,
    pub status: PollStatus,
    pub end_time: u64,
    pub correct_answer: Option<bool>,
}

/// User's vote record
#[derive(Debug, Clone, Serialize, Deserialize, async_graphql::SimpleObject)]
pub struct Vote {
    pub choice: bool,  // true = Yes, false = No
    pub amount: u64,
}

/// Application state
#[derive(RootView, async_graphql::SimpleObject)]
#[view(context = ViewStorageContext)]
pub struct QuickPollState {
    /// All polls (ID -> Poll)
    pub polls: MapView<PollId, Poll>,
    
    /// User's vote record (VoteKey -> Vote)
    pub user_votes: MapView<VoteKey, Vote>,
    
    /// Next Poll ID
    pub next_poll_id: RegisterView<u64>,
}