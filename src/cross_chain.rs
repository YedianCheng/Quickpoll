use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum MessageType {
    VoteSubmission,
    PollCreation,
    PollResolution,
    UserRegistration,
    BalanceUpdate,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CrossChainMessage {
    pub message_id: String,
    pub message_type: MessageType,
    pub source_chain: String,
    pub target_chain: String,
    pub payload: String,
    pub timestamp: u64,
    pub signature: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VoteSubmissionMessage {
    pub poll_id: String,
    pub user_id: String,
    pub choice: bool,
    pub amount: u64,
    pub user_chain_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PollCreationMessage {
    pub poll_id: String,
    pub question: String,
    pub creator: String,
    pub end_time: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PollResolutionMessage {
    pub poll_id: String,
    pub result: bool,
    pub confidence: f64,
    pub oracle_chain_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CrossChainService {
    pub message_queue: Vec<CrossChainMessage>,
    pub processed_messages: HashMap<String, bool>,
    pub chain_connections: HashMap<String, Vec<String>>,
}

impl CrossChainService {
    pub fn new() -> Self {
        Self {
            message_queue: Vec::new(),
            processed_messages: HashMap::new(),
            chain_connections: HashMap::new(),
        }
    }

    pub fn send_vote_submission(
        &mut self,
        poll_id: String,
        user_id: String,
        choice: bool,
        amount: u64,
        user_chain_id: String,
        poll_chain_id: String,
    ) -> Result<String, String> {
        let message = VoteSubmissionMessage {
            poll_id: poll_id.clone(),
            user_id: user_id.clone(),
            choice,
            amount,
            user_chain_id: user_chain_id.clone(),
        };

        let message_id = format!("vote_{}_{}_{}", poll_id, user_id, 
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs()
        );

        let cross_chain_message = CrossChainMessage {
            message_id: message_id.clone(),
            message_type: MessageType::VoteSubmission,
            source_chain: user_chain_id,
            target_chain: poll_chain_id,
            payload: serde_json::to_string(&message).unwrap(),
            timestamp: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs(),
            signature: String::new(), // TODO: Add proper signature
        };

        self.message_queue.push(cross_chain_message);
        Ok(message_id)
    }

    pub fn send_poll_creation(
        &mut self,
        poll_id: String,
        question: String,
        creator: String,
        end_time: u64,
        poll_chain_id: String,
    ) -> Result<String, String> {
        let message = PollCreationMessage {
            poll_id: poll_id.clone(),
            question,
            creator: creator.clone(),
            end_time,
        };

        let message_id = format!("poll_{}_{}", poll_id, 
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs()
        );

        let cross_chain_message = CrossChainMessage {
            message_id: message_id.clone(),
            message_type: MessageType::PollCreation,
            source_chain: creator.clone(),
            target_chain: poll_chain_id,
            payload: serde_json::to_string(&message).unwrap(),
            timestamp: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs(),
            signature: String::new(), // TODO: Add proper signature
        };

        self.message_queue.push(cross_chain_message);
        Ok(message_id)
    }

    pub fn send_poll_resolution(
        &mut self,
        poll_id: String,
        result: bool,
        confidence: f64,
        oracle_chain_id: String,
        poll_chain_id: String,
    ) -> Result<String, String> {
        let message = PollResolutionMessage {
            poll_id: poll_id.clone(),
            result,
            confidence,
            oracle_chain_id: oracle_chain_id.clone(),
        };

        let message_id = format!("resolve_{}_{}", poll_id, 
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs()
        );

        let cross_chain_message = CrossChainMessage {
            message_id: message_id.clone(),
            message_type: MessageType::PollResolution,
            source_chain: oracle_chain_id.clone(),
            target_chain: poll_chain_id,
            payload: serde_json::to_string(&message).unwrap(),
            timestamp: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs(),
            signature: String::new(), // TODO: Add proper signature
        };

        self.message_queue.push(cross_chain_message);
        Ok(message_id)
    }

    pub fn process_messages(&mut self) -> Vec<CrossChainMessage> {
        let mut processed = Vec::new();
        let mut remaining = Vec::new();

        for message in self.message_queue.drain(..) {
            if !self.processed_messages.contains_key(&message.message_id) {
                processed.push(message.clone());
                self.processed_messages.insert(message.message_id.clone(), true);
            } else {
                remaining.push(message);
            }
        }

        self.message_queue = remaining;
        processed
    }

    pub fn add_chain_connection(&mut self, chain_id: String, connected_chains: Vec<String>) {
        self.chain_connections.insert(chain_id, connected_chains);
    }

    pub fn get_connected_chains(&self, chain_id: &str) -> Option<&Vec<String>> {
        self.chain_connections.get(chain_id)
    }
}
