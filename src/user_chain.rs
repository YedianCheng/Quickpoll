use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserProfile {
    pub user_id: String,
    pub wallet_address: String,
    pub balance: u64,
    pub voting_power: u64,
    pub reputation: u32,
    pub created_at: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VoteRecord {
    pub poll_id: String,
    pub choice: bool,
    pub amount: u64,
    pub timestamp: u64,
    pub chain_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserChain {
    pub profile: UserProfile,
    pub voting_history: Vec<VoteRecord>,
    pub active_polls: Vec<String>,
    pub reputation_history: Vec<u32>,
}

impl UserChain {
    pub fn new(user_id: String, wallet_address: String) -> Self {
        Self {
            profile: UserProfile {
                user_id: user_id.clone(),
                wallet_address,
                balance: 1000, // Initial balance
                voting_power: 100,
                reputation: 100,
                created_at: std::time::SystemTime::now()
                    .duration_since(std::time::UNIX_EPOCH)
                    .unwrap()
                    .as_secs(),
            },
            voting_history: Vec::new(),
            active_polls: Vec::new(),
            reputation_history: vec![100],
        }
    }

    pub fn add_vote(&mut self, poll_id: String, choice: bool, amount: u64, chain_id: String) {
        let vote_record = VoteRecord {
            poll_id: poll_id.clone(),
            choice,
            amount,
            timestamp: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs(),
            chain_id,
        };
        
        self.voting_history.push(vote_record);
        self.active_polls.push(poll_id);
        
        // Update reputation based on voting activity
        self.update_reputation();
    }

    pub fn update_reputation(&mut self) {
        let activity_score = self.voting_history.len() as u32;
        let new_reputation = (self.profile.reputation + activity_score).min(1000);
        self.profile.reputation = new_reputation;
        self.reputation_history.push(new_reputation);
    }

    pub fn get_voting_power(&self) -> u64 {
        // Voting power based on reputation and balance
        let reputation_multiplier = (self.profile.reputation as f64 / 100.0).min(2.0);
        (self.profile.balance as f64 * reputation_multiplier) as u64
    }
}
