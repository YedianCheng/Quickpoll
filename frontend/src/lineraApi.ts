// Linera Blockchain API
import { LINERA_GRAPHQL_ENDPOINT, LINERA_CHAIN_ID, LINERA_APPLICATION_ID } from './config';

export interface Poll {
  id: number;
  question: string;
  yesVotes: number;
  noVotes: number;
  yesAmount: number;
  noAmount: number;
  status: 'Active' | 'Resolved';
  endTime: number;
  correctAnswer?: boolean;
  category?: string;
  volume?: number;
}

// GraphQL query to fetch all polls
const QUERY_POLLS = `
  query {
    polls {
      id
      question
      yesVotes: yes_votes
      noVotes: no_votes
      yesAmount: yes_amount
      noAmount: no_amount
      status
      endTime: end_time
      correctAnswer: correct_answer
    }
  }
`;

// GraphQL query to fetch a single poll
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const QUERY_POLL = `
  query($pollId: Int!) {
    poll(pollId: $pollId) {
      id
      question
      yesVotes: yes_votes
      noVotes: no_votes
      yesAmount: yes_amount
      noAmount: no_amount
      status
      endTime: end_time
      correctAnswer: correct_answer
    }
  }
`;

// GraphQL mutation to create a poll
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MUTATION_CREATE_POLL = `
  mutation($chainId: String!, $operation: String!) {
    executeOperation(
      chainId: $chainId
      operation: $operation
    )
  }
`;

/**
 * Query GraphQL endpoint
 */
async function queryGraphQL(query: string, variables?: any): Promise<any> {
  try {
    const response = await fetch(LINERA_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      throw new Error(data.errors[0]?.message || 'GraphQL query failed');
    }

    return data;
  } catch (error) {
    console.error('GraphQL query failed:', error);
    throw error;
  }
}

/**
 * Execute a mutation on the blockchain
 */
async function executeMutation(operation: any): Promise<any> {
  try {
    // Encode the operation as JSON
    const operationJson = JSON.stringify(operation);
    
    const mutation = `
      mutation {
        executeOperation(
          chainId: "${LINERA_CHAIN_ID}",
          applicationId: "${LINERA_APPLICATION_ID}",
          operation: ${JSON.stringify(operationJson)}
        )
      }
    `;

    const response = await fetch(LINERA_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: mutation }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error('Mutation errors:', data.errors);
      throw new Error(data.errors[0]?.message || 'Mutation failed');
    }

    return data;
  } catch (error) {
    console.error('Mutation failed:', error);
    throw error;
  }
}

/**
 * Fetch all polls from the blockchain
 */
export async function fetchPolls(): Promise<Poll[]> {
  try {
    console.log('📊 Fetching polls from blockchain...');
    const result = await queryGraphQL(QUERY_POLLS);
    
    if (!result.data || !result.data.polls) {
      console.warn('No polls data in response');
      return [];
    }

    const polls = result.data.polls.map((poll: any) => ({
      id: poll.id,
      question: poll.question,
      yesVotes: poll.yesVotes || 0,
      noVotes: poll.noVotes || 0,
      yesAmount: poll.yesAmount || 0,
      noAmount: poll.noAmount || 0,
      status: poll.status === 'Resolved' ? 'Resolved' : 'Active',
      endTime: poll.endTime,
      correctAnswer: poll.correctAnswer,
      category: 'Blockchain',
      volume: (poll.yesAmount || 0) + (poll.noAmount || 0),
    }));

    console.log(`✅ Fetched ${polls.length} polls from blockchain`);
    return polls;
  } catch (error) {
    console.error('Failed to fetch polls from blockchain:', error);
    throw error;
  }
}

/**
 * Create a new poll on the blockchain
 */
export async function createPoll(question: string, endTime: number): Promise<number> {
  try {
    console.log('📝 Creating poll on blockchain...', { question, endTime });
    
    const operation = {
      CreatePoll: {
        question,
        end_time: endTime,
      },
    };

    const result = await executeMutation(operation);
    console.log('✅ Poll created on blockchain:', result);
    
    // Extract poll ID from response
    // The response format depends on your Linera setup
    // For now, we'll return a placeholder
    return Date.now(); // TODO: Extract actual poll ID from response
  } catch (error) {
    console.error('Failed to create poll on blockchain:', error);
    throw error;
  }
}

/**
 * Vote on a poll on the blockchain
 */
export async function vote(pollId: number, choice: boolean, amount: number = 10): Promise<void> {
  try {
    console.log('🗳️ Voting on blockchain...', { pollId, choice, amount });
    
    const operation = {
      Vote: {
        poll_id: pollId,
        choice,
        amount,
      },
    };

    const result = await executeMutation(operation);
    console.log('✅ Vote recorded on blockchain:', result);
  } catch (error) {
    console.error('Failed to vote on blockchain:', error);
    throw error;
  }
}

/**
 * Resolve a poll on the blockchain (admin only)
 */
export async function resolvePoll(pollId: number, correctAnswer: boolean): Promise<void> {
  try {
    console.log('⚖️ Resolving poll on blockchain...', { pollId, correctAnswer });
    
    const operation = {
      Resolve: {
        poll_id: pollId,
        correct_answer: correctAnswer,
      },
    };

    const result = await executeMutation(operation);
    console.log('✅ Poll resolved on blockchain:', result);
  } catch (error) {
    console.error('Failed to resolve poll on blockchain:', error);
    throw error;
  }
}

/**
 * Check if blockchain is available
 */
export async function checkBlockchainConnection(): Promise<boolean> {
  try {
    const response = await fetch(LINERA_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: '{ __typename }',
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Blockchain connection check failed:', error);
    return false;
  }
}

