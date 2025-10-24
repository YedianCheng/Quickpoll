use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PollStatus {
    Active,
    Resolved,
    Cancelled,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PollChain {
    pub poll_id: String,
    pub question: String,
    pub creator: String,
    pub yes_votes: u64,
    pub no_votes: u64,
    pub yes_amount: u64,
    pub no_amount: u64,
    pub total_amount: u64,
    pub status: PollStatus,
    pub end_time: u64,
    pub participants: Vec<String>,
    pub vote_records: Vec<VoteSubmission>,
    pub created_at: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VoteSubmission {
    pub user_id: String,
    pub choice: bool,
    pub amount: u64,
    pub signature: String,
    pub timestamp: u64,
    pub user_chain_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PollResult {
    pub poll_id: String,
    pub winner: bool,
    pub confidence: f64,
    pub total_participants: u32,
    pub total_amount: u64,
    pub resolved_at: u64,
}

impl PollChain {
    pub fn new(
        poll_id: String,
        question: String,
        creator: String,
        end_time: u64,
    ) -> Self {
        Self {
            poll_id: poll_id.clone(),
            question,
            creator,
            yes_votes: 0,
            no_votes: 0,
            yes_amount: 0,
            no_amount: 0,
            total_amount: 0,
            status: PollStatus::Active,
            end_time,
            participants: Vec::new(),
            vote_records: Vec::new(),
            created_at: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs(),
        }
    }

    pub fn submit_vote(
        &mut self,
        user_id: String,
        choice: bool,
        amount: u64,
        signature: String,
        user_chain_id: String,
    ) -> Result<(), String> {
        if !self.is_active() {
            return Err("Poll is not active".to_string());
        }

        if self.has_user_voted(&user_id) {
            return Err("User has already voted".to_string());
        }

        let vote_submission = VoteSubmission {
            user_id: user_id.clone(),
            choice,
            amount,
            signature,
            timestamp: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs(),
            user_chain_id,
        };

        self.vote_records.push(vote_submission);
        self.participants.push(user_id);

        if choice {
            self.yes_votes += 1;
            self.yes_amount += amount;
        } else {
            self.no_votes += 1;
            self.no_amount += amount;
        }

        self.total_amount += amount;
        Ok(())
    }

    pub fn is_active(&self) -> bool {
        matches!(self.status, PollStatus::Active) && 
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs() < self.end_time
    }

    pub fn has_user_voted(&self, user_id: &str) -> bool {
        self.participants.contains(&user_id.to_string())
    }

    pub fn resolve_poll(&mut self, result: bool, confidence: f64) -> PollResult {
        self.status = PollStatus::Resolved;
        
        PollResult {
            poll_id: self.poll_id.clone(),
            winner: result,
            confidence,
            total_participants: self.participants.len() as u32,
            total_amount: self.total_amount,
            resolved_at: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs(),
        }
    }

    pub fn get_vote_distribution(&self) -> (f64, f64) {
        let total = self.yes_amount + self.no_amount;
        if total == 0 {
            return (0.0, 0.0);
        }
        
        let yes_percentage = (self.yes_amount as f64 / total as f64) * 100.0;
        let no_percentage = (self.no_amount as f64 / total as f64) * 100.0;
        
        (yes_percentage, no_percentage)
    }
}
