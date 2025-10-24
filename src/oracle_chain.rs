use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OracleData {
    pub poll_id: String,
    pub result: Option<bool>,
    pub confidence: f64,
    pub data_sources: Vec<String>,
    pub timestamp: u64,
    pub signature: String,
    pub oracle_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DataSource {
    pub source_id: String,
    pub name: String,
    pub reliability: f64,
    pub last_update: u64,
    pub is_active: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OracleChain {
    pub oracle_id: String,
    pub data_sources: HashMap<String, DataSource>,
    pub poll_results: HashMap<String, OracleData>,
    pub consensus_threshold: f64,
    pub created_at: u64,
}

impl OracleChain {
    pub fn new(oracle_id: String) -> Self {
        Self {
            oracle_id: oracle_id.clone(),
            data_sources: HashMap::new(),
            poll_results: HashMap::new(),
            consensus_threshold: 0.7, // 70% consensus required
            created_at: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs(),
        }
    }

    pub fn add_data_source(
        &mut self,
        source_id: String,
        name: String,
        reliability: f64,
    ) {
        let data_source = DataSource {
            source_id: source_id.clone(),
            name,
            reliability,
            last_update: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs(),
            is_active: true,
        };
        
        self.data_sources.insert(source_id, data_source);
    }

    pub fn submit_result(
        &mut self,
        poll_id: String,
        result: bool,
        confidence: f64,
        source_id: String,
        signature: String,
    ) -> Result<OracleData, String> {
        if !self.data_sources.contains_key(&source_id) {
            return Err("Unknown data source".to_string());
        }

        let oracle_data = OracleData {
            poll_id: poll_id.clone(),
            result: Some(result),
            confidence,
            data_sources: vec![source_id.clone()],
            timestamp: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs(),
            signature,
            oracle_id: self.oracle_id.clone(),
        };

        self.poll_results.insert(poll_id.clone(), oracle_data.clone());
        
        // Update data source last update time
        if let Some(source) = self.data_sources.get_mut(&source_id) {
            source.last_update = oracle_data.timestamp;
        }

        Ok(oracle_data)
    }

    pub fn get_consensus_result(&self, poll_id: &str) -> Option<OracleData> {
        self.poll_results.get(poll_id).cloned()
    }

    pub fn calculate_consensus(&self, poll_id: &str) -> f64 {
        if let Some(_result) = self.poll_results.get(poll_id) {
            let active_sources: Vec<&DataSource> = self.data_sources
                .values()
                .filter(|source| source.is_active)
                .collect();
            
            if active_sources.is_empty() {
                return 0.0;
            }

            let total_reliability: f64 = active_sources
                .iter()
                .map(|source| source.reliability)
                .sum();
            
            let consensus = total_reliability / active_sources.len() as f64;
            consensus
        } else {
            0.0
        }
    }

    pub fn is_result_trusted(&self, poll_id: &str) -> bool {
        let consensus = self.calculate_consensus(poll_id);
        consensus >= self.consensus_threshold
    }

    pub fn get_poll_status(&self, poll_id: &str) -> PollStatus {
        if let Some(result) = self.poll_results.get(poll_id) {
            if result.result.is_some() && self.is_result_trusted(poll_id) {
                PollStatus::Resolved
            } else {
                PollStatus::Pending
            }
        } else {
            PollStatus::Pending
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PollStatus {
    Pending,
    Resolved,
    Failed,
}
