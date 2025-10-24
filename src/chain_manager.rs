use crate::{
    user_chain::UserChain,
    poll_chain::PollChain,
    oracle_chain::OracleChain,
    cross_chain::CrossChainService,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChainManager {
    pub user_chains: HashMap<String, UserChain>,
    pub poll_chains: HashMap<String, PollChain>,
    pub oracle_chain: OracleChain,
    pub cross_chain_service: CrossChainService,
    pub chain_registry: HashMap<String, String>, // chain_id -> chain_type
}

impl ChainManager {
    pub fn new() -> Self {
        Self {
            user_chains: HashMap::new(),
            poll_chains: HashMap::new(),
            oracle_chain: OracleChain::new("oracle_main".to_string()),
            cross_chain_service: CrossChainService::new(),
            chain_registry: HashMap::new(),
        }
    }

    pub fn create_user_chain(&mut self, user_id: String, wallet_address: String) -> String {
        let chain_id = format!("user_{}", user_id);
        let user_chain = UserChain::new(user_id.clone(), wallet_address);
        
        self.user_chains.insert(chain_id.clone(), user_chain);
        self.chain_registry.insert(chain_id.clone(), "user".to_string());
        
        // Add cross-chain connections
        self.cross_chain_service.add_chain_connection(
            chain_id.clone(),
            vec!["oracle_main".to_string()]
        );
        
        chain_id
    }

    pub fn create_poll_chain(
        &mut self,
        poll_id: String,
        question: String,
        creator: String,
        end_time: u64,
    ) -> String {
        let chain_id = format!("poll_{}", poll_id);
        let poll_chain = PollChain::new(poll_id.clone(), question.clone(), creator.clone(), end_time);
        
        self.poll_chains.insert(chain_id.clone(), poll_chain);
        self.chain_registry.insert(chain_id.clone(), "poll".to_string());
        
        // Add cross-chain connections
        self.cross_chain_service.add_chain_connection(
            chain_id.clone(),
            vec!["oracle_main".to_string()]
        );
        
        // Send poll creation message
        let _ = self.cross_chain_service.send_poll_creation(
            poll_id,
            question,
            creator,
            end_time,
            chain_id.clone(),
        );
        
        chain_id
    }

    pub fn submit_vote(
        &mut self,
        user_id: String,
        poll_id: String,
        choice: bool,
        amount: u64,
    ) -> Result<String, String> {
        let user_chain_id = format!("user_{}", user_id);
        let poll_chain_id = format!("poll_{}", poll_id);
        
        // Check if user chain exists
        if let Some(user_chain) = self.user_chains.get_mut(&user_chain_id) {
            // Add vote to user chain
            user_chain.add_vote(poll_id.clone(), choice, amount, poll_chain_id.clone());
            
            // Send vote submission message
            let message_id = self.cross_chain_service.send_vote_submission(
                poll_id.clone(),
                user_id.clone(),
                choice,
                amount,
                user_chain_id.clone(),
                poll_chain_id.clone(),
            )?;
            
            // Process the vote in poll chain
            if let Some(poll_chain) = self.poll_chains.get_mut(&poll_chain_id) {
                let _ = poll_chain.submit_vote(
                    user_id.clone(),
                    choice,
                    amount,
                    "signature".to_string(), // TODO: Add proper signature
                    user_chain_id.clone(),
                );
            }
            
            Ok(message_id)
        } else {
            Err("User chain not found".to_string())
        }
    }

    pub fn resolve_poll(
        &mut self,
        poll_id: String,
        result: bool,
        confidence: f64,
    ) -> Result<String, String> {
        let poll_chain_id = format!("poll_{}", poll_id);
        
        // Submit result to oracle chain
        let _oracle_data = self.oracle_chain.submit_result(
            poll_id.clone(),
            result,
            confidence,
            "external_source".to_string(),
            "oracle_signature".to_string(),
        )?;
        
        // Send resolution message to poll chain
        let message_id = self.cross_chain_service.send_poll_resolution(
            poll_id.clone(),
            result,
            confidence,
            "oracle_main".to_string(),
            poll_chain_id.clone(),
        )?;
        
        // Resolve the poll in poll chain
        if let Some(poll_chain) = self.poll_chains.get_mut(&poll_chain_id) {
            let _ = poll_chain.resolve_poll(result, confidence);
        }
        
        Ok(message_id)
    }

    pub fn get_user_chain(&self, user_id: &str) -> Option<&UserChain> {
        let chain_id = format!("user_{}", user_id);
        self.user_chains.get(&chain_id)
    }

    pub fn get_poll_chain(&self, poll_id: &str) -> Option<&PollChain> {
        let chain_id = format!("poll_{}", poll_id);
        self.poll_chains.get(&chain_id)
    }

    pub fn get_chain_type(&self, chain_id: &str) -> Option<&String> {
        self.chain_registry.get(chain_id)
    }

    pub fn process_cross_chain_messages(&mut self) -> Vec<String> {
        let messages = self.cross_chain_service.process_messages();
        messages.into_iter().map(|msg| msg.message_id).collect()
    }

    pub fn get_system_status(&self) -> SystemStatus {
        SystemStatus {
            total_user_chains: self.user_chains.len(),
            total_poll_chains: self.poll_chains.len(),
            active_polls: self.poll_chains.values()
                .filter(|poll| poll.is_active())
                .count(),
            total_messages: self.cross_chain_service.message_queue.len(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemStatus {
    pub total_user_chains: usize,
    pub total_poll_chains: usize,
    pub active_polls: usize,
    pub total_messages: usize,
}
