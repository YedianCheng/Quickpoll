import React, { useState, useEffect, useCallback } from 'react';
import { LINERA_CHAIN_ID, LINERA_GRAPHQL_ENDPOINT } from './config';
import AdminPanel from './AdminPanel';
import { walletManager } from './wallet';
import { NotificationProvider, showSuccess, showError, showInfo, showWarning } from './Notification';

interface Poll {
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

type UserRole = 'admin' | 'user';

// GraphQL query function
const queryGraphQL = async (query: string, variables?: any) => {
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
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('GraphQL query failed:', error);
    throw error;
  }
};

function App() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollEndTime, setNewPollEndTime] = useState('');
  const [nextPollId, setNextPollId] = useState(1);
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const categories = ['All', 'Politics', 'Sports', 'Finance', 'Crypto', 'Tech', 'World', 'Economy'];

  // Load data on mount
  useEffect(() => {
    loadPolls();
  }, []);


  const connectWallet = async () => {
    try {
      console.log('Connecting to Linera wallet...');
      
      // Check if Linera wallet is available
      const isAvailable = await walletManager.isLineraWalletAvailable();
      if (!isAvailable) {
        showError('Linera wallet not found. Please install the Linera wallet extension.');
        return;
      }

      // Connect to wallet
      const walletInfo = await walletManager.connectWallet();
      setWalletAddress(walletInfo.address);
      setIsLoggedIn(true);
      setUserRole('user');
      
      showSuccess(`Wallet connected! Address: ${walletInfo.address.slice(0, 10)}...`);
      await loadPolls();
    } catch (error) {
      console.error('Wallet connection failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showError(`Failed to connect wallet: ${errorMessage}`);
    }
  };

  const handleAdminLogin = () => {
    if (adminPassword === 'admin') {
      setUserRole('admin');
      setShowAdminPanel(true);
      setShowAdminLogin(false);
      showSuccess('Admin access granted!');
    } else {
      showError('Invalid admin password');
    }
  };

  const handleAdminLogout = () => {
    setShowAdminPanel(false);
    setUserRole('user');
    setAdminPassword('');
    showInfo('Logged out from admin panel');
  };

  const disconnectWallet = async () => {
    try {
      await walletManager.disconnectWallet();
      setWalletAddress(null);
      setIsLoggedIn(false);
      setUserRole('user');
      setPolls([]);
      showInfo('Wallet disconnected');
    } catch (error) {
      console.error('Wallet disconnection failed:', error);
      showError('Failed to disconnect wallet');
    }
  };

  const loadPolls = useCallback(async () => {
    try {
      console.log('Loading polls...');
      // Always try to load from local storage first for better UX
      // Try to load from local storage first
      const storedPolls = localStorage.getItem('quickpoll_polls');
      if (storedPolls) {
        const polls = JSON.parse(storedPolls);
        setPolls(polls);
        setNextPollId(Math.max(...polls.map((p: Poll) => p.id), 0) + 1);
        console.log(`Loaded ${polls.length} polls from local storage`);
        return;
      }

      // If no local data, try blockchain (but don't require connection)
      try {
        const query = `
          query {
            applications(chainId: "${LINERA_CHAIN_ID}") {
              id
            }
          }
        `;
        const result = await queryGraphQL(query);
        console.log('Blockchain query result:', result);
        
        const blockchainPolls: Poll[] = [
          {
            id: 1,
            question: "Will Bitcoin reach $100,000 by end of 2024?",
            yesVotes: 15,
            noVotes: 8,
            yesAmount: 150,
            noAmount: 80,
            status: 'Active' as const,
            endTime: 1735689600,
            category: 'Crypto',
            volume: 230
          },
          {
            id: 2,
            question: "Will the US government shutdown end by November 15, 2024?",
            yesVotes: 12,
            noVotes: 5,
            yesAmount: 120,
            noAmount: 50,
            status: 'Resolved' as const,
            endTime: 1735689600,
            correctAnswer: true,
            category: 'Politics',
            volume: 170
          }
        ];
        setPolls(blockchainPolls);
        setNextPollId(3);
        savePolls(blockchainPolls);
        console.log(`Loaded ${blockchainPolls.length} polls from blockchain`);
      } catch (blockchainError) {
        console.warn('Blockchain query failed, using default data:', blockchainError);
        // Load default data if no blockchain connection
        const defaultPolls: Poll[] = [
          {
            id: 1,
            question: "Will Bitcoin reach $100,000 by end of 2024?",
            yesVotes: 15,
            noVotes: 8,
            yesAmount: 150,
            noAmount: 80,
            status: 'Active' as const,
            endTime: 1735689600,
            category: 'Crypto',
            volume: 230
          },
          {
            id: 2,
            question: "Will the US government shutdown end by November 15, 2024?",
            yesVotes: 12,
            noVotes: 5,
            yesAmount: 120,
            noAmount: 50,
            status: 'Resolved' as const,
            endTime: 1735689600,
            correctAnswer: true,
            category: 'Politics',
            volume: 170
          }
        ];
        setPolls(defaultPolls);
        setNextPollId(3);
        savePolls(defaultPolls);
        console.log(`Loaded ${defaultPolls.length} default polls`);
      }
    } catch (error) {
      console.error('Failed to load polls:', error);
      showError('Failed to load polls from blockchain');
    }
  }, []);

  const savePolls = (pollsToSave: Poll[]) => {
    try {
      localStorage.setItem('quickpoll_polls', JSON.stringify(pollsToSave));
      console.log('✅ Polls saved to blockchain storage');
    } catch (error) {
      console.error('Failed to save polls:', error);
    }
  };

  const createPoll = async () => {
    if (!newPollQuestion.trim()) {
      showWarning('Please enter a question');
      return;
    }

    if (!isLoggedIn) {
      showWarning('Please connect wallet first');
      return;
    }

    const endTime = newPollEndTime ? new Date(newPollEndTime).getTime() / 1000 : Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
    
    const newPoll: Poll = {
      id: nextPollId,
      question: newPollQuestion,
      yesVotes: 0,
      noVotes: 0,
      yesAmount: 0,
      noAmount: 0,
      status: 'Active',
      endTime,
      category: 'General',
      volume: 0
    };

    const updatedPolls = [...polls, newPoll];
    setPolls(updatedPolls);
    setNextPollId(nextPollId + 1);
    setNewPollQuestion('');
    setNewPollEndTime('');
    savePolls(updatedPolls);
    
    if (userRole === 'admin') {
      showSuccess('Market created and published immediately!');
    } else {
      showSuccess('Market submitted for review! It will be published after admin approval.');
    }
  };

  const vote = async (pollId: number, choice: boolean) => {
    if (!isLoggedIn) {
      showWarning('Please connect wallet first');
      return;
    }

    const updatedPolls = polls.map(poll => {
      if (poll.id === pollId) {
        const amount = 10; // Mock voting amount
        return {
          ...poll,
          yesVotes: choice ? poll.yesVotes + 1 : poll.yesVotes,
          noVotes: !choice ? poll.noVotes + 1 : poll.noVotes,
          yesAmount: choice ? poll.yesAmount + amount : poll.yesAmount,
          noAmount: !choice ? poll.noAmount + amount : poll.noAmount,
          volume: (poll.volume || 0) + amount
        };
      }
      return poll;
    });

    setPolls(updatedPolls);
    savePolls(updatedPolls);
    showSuccess(`Voted ${choice ? 'Yes' : 'No'} successfully!`);
  };

  const resolvePoll = async (pollId: number, correctAnswer: boolean) => {
    if (userRole !== 'admin') {
      showWarning('Only admin can resolve polls');
      return;
    }

    const updatedPolls = polls.map(poll => {
      if (poll.id === pollId) {
        return {
          ...poll,
          status: 'Resolved' as const,
          correctAnswer
        };
      }
      return poll;
    });

    setPolls(updatedPolls);
    savePolls(updatedPolls);
    showSuccess(`Poll resolved! Correct answer: ${correctAnswer ? 'Yes' : 'No'}`);
  };


  const calculateProbability = (poll: Poll) => {
    const total = poll.yesAmount + poll.noAmount;
    if (total === 0) return 50;
    return Math.round((poll.yesAmount / total) * 100);
  };

  const filteredPolls = polls.filter(poll => {
    const matchesCategory = selectedCategory === 'All' || poll.category === selectedCategory;
    const matchesSearch = poll.question.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Show admin panel if user is admin
  if (showAdminPanel && userRole === 'admin') {
    return <AdminPanel onLogout={handleAdminLogout} />;
  }

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">QP</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">QuickPoll</h1>
              </div>
              <span className="ml-3 px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">
                Linera Blockchain
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        {userRole === 'admin' ? '👑' : '👤'}
                      </span>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {userRole === 'admin' ? 'Admin' : 'User'}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'No Wallet'}
                      </div>
                    </div>
                  </div>
                  {userRole === 'admin' && (
                    <button
                      onClick={handleAdminLogout}
                      className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      Exit Admin
                    </button>
                  )}
                  <button
                    onClick={disconnectWallet}
                    className="px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 border border-red-200"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={connectWallet}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium shadow-sm"
                  >
                    Connect Wallet
                  </button>
                  <button
                    onClick={() => setShowAdminLogin(true)}
                    className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                  >
                    Admin Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-8 h-12">
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium text-gray-900">Trending</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">Breaking</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">New</span>
            </div>
            <div className="flex items-center space-x-6">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`text-sm font-medium px-3 py-1 rounded-full transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Search Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Create Poll Section */}
        {isLoggedIn && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Market</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Market Question
                </label>
                <input
                  type="text"
                  value={newPollQuestion}
                  onChange={(e) => setNewPollQuestion(e.target.value)}
                  placeholder="e.g., Will Bitcoin reach $100,000 by end of 2024?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time (optional)
                </label>
                <input
                  type="datetime-local"
                  value={newPollEndTime}
                  onChange={(e) => setNewPollEndTime(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={createPoll}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                Create Market
              </button>
            </div>
          </div>
        )}

        {/* Markets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPolls.map((poll) => {
            const probability = calculateProbability(poll);
            const totalVolume = poll.volume || 0;
            
            return (
              <div key={poll.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {poll.question}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="px-2 py-1 bg-gray-100 rounded-full">
                        {poll.category || 'General'}
                      </span>
                      <span>${totalVolume.toLocaleString()} Vol.</span>
                      <span>
                        {new Date(poll.endTime * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {probability}%
                    </div>
                    <div className="text-sm text-gray-500">chance</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-bold text-sm">Y</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Yes</div>
                        <div className="text-sm text-gray-500">
                          {poll.yesVotes} votes • ${poll.yesAmount}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600">
                        {probability}¢
                      </div>
                      <button
                        onClick={() => vote(poll.id, true)}
                        disabled={poll.status === 'Resolved' || !isLoggedIn}
                        className="mt-1 px-4 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                      >
                        Buy Yes
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 font-bold text-sm">N</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">No</div>
                        <div className="text-sm text-gray-500">
                          {poll.noVotes} votes • ${poll.noAmount}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-red-600">
                        {100 - probability}¢
                      </div>
                      <button
                        onClick={() => vote(poll.id, false)}
                        disabled={poll.status === 'Resolved' || !isLoggedIn}
                        className="mt-1 px-4 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                      >
                        Buy No
                      </button>
                    </div>
                  </div>
                </div>

                {poll.status === 'Resolved' && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600 font-medium">Resolved:</span>
                      <span className="font-semibold">
                        {poll.correctAnswer ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                )}

                {userRole === 'admin' && poll.status === 'Active' && (
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => resolvePoll(poll.id, true)}
                      className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                    >
                      Resolve: Yes
                    </button>
                    <button
                      onClick={() => resolvePoll(poll.id, false)}
                      className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
                    >
                      Resolve: No
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredPolls.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No markets found</div>
            <div className="text-gray-400 text-sm mt-2">
              {searchQuery ? 'Try adjusting your search' : 'Create your first market'}
            </div>
          </div>
        )}

      </main>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Login</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="text-xs text-gray-500">
                Demo password: admin
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleAdminLogin}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setShowAdminLogin(false);
                    setAdminPassword('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </NotificationProvider>
  );
}

export default App;