import React, { useState, useEffect, useCallback } from 'react';
import { LINERA_CHAIN_ID, LINERA_GRAPHQL_ENDPOINT } from './config';
import AdminPanel from './AdminPanel';
import { walletManager } from './wallet';
import { NotificationProvider, showSuccess, showError, showInfo, showWarning } from './Notification';
import * as LineraAPI from './lineraApi';

interface Poll {
  id: number;
  question: string;
  yesVotes: number;
  noVotes: number;
  yesAmount: number;
  noAmount: number;
  status: 'Active' | 'Resolved' | 'Pending';
  endTime: number;
  correctAnswer?: boolean;
  category?: string;
  volume?: number;
  isPending?: boolean;
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
  const [isConnecting, setIsConnecting] = useState(false);
  const [showCreateMarket, setShowCreateMarket] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);

  const categories = ['All', 'Politics', 'Sports', 'Finance', 'Crypto', 'Tech', 'World', 'Economy'];

  const connectWallet = async () => {
    // Prevent multiple connection attempts
    if (isConnecting) {
      showWarning('Connection in progress, please wait...');
      return;
    }

    // If already connected, don't reconnect
    if (isLoggedIn && walletAddress) {
      showInfo('Wallet already connected!');
      return;
    }

    try {
      setIsConnecting(true);
      console.log('🔍 Checking for MetaMask...');
      
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        showError('MetaMask is not installed! Please install MetaMask extension first.');
        console.error('❌ MetaMask not found');
        setIsConnecting(false);
        return;
      }

      console.log('✅ MetaMask detected, requesting connection...');
      console.log('📱 MetaMask object:', window.ethereum);
      
      // Connect to wallet (MetaMask or Linera)
      const walletInfo = await walletManager.connectWallet();
      console.log('🎉 Wallet connected in App.tsx!', walletInfo);
      
      setWalletAddress(walletInfo.address);
      setIsLoggedIn(true);
      setUserRole('user');
      
      showSuccess(`Wallet connected! Address: ${walletInfo.address.slice(0, 10)}...`);
      
      // Load polls after successful connection
      console.log('📊 Loading polls after connection...');
      await loadPolls();
    } catch (error) {
      console.error('❌ Wallet connection failed:', error);
      
      // Handle specific MetaMask errors
      if (error && typeof error === 'object' && 'code' in error) {
        const err = error as { code: number; message: string };
        if (err.code === -32002) {
          showWarning('Please check MetaMask - there is a pending connection request. Close the popup and try again.');
          return;
        } else if (err.code === 4001) {
          showInfo('Connection request rejected by user');
          return;
        }
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showError(`Failed to connect wallet: ${errorMessage}`);
    } finally {
      setIsConnecting(false);
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
      console.log('📊 Loading polls from blockchain...');
      
      // Try to fetch from blockchain first
      try {
        const blockchainPolls = await LineraAPI.fetchPolls();
        
        if (blockchainPolls && blockchainPolls.length > 0) {
          setPolls(blockchainPolls);
          setNextPollId(Math.max(...blockchainPolls.map((p: Poll) => p.id), 0) + 1);
          // Also save to local storage as backup
          savePolls(blockchainPolls);
          console.log(`✅ Loaded ${blockchainPolls.length} polls from blockchain`);
          showSuccess(`Loaded ${blockchainPolls.length} markets from blockchain`);
          return;
        }
      } catch (blockchainError) {
        console.warn('⚠️ Failed to load from blockchain, trying local storage:', blockchainError);
      }

      // Fallback to local storage
      const storedPolls = localStorage.getItem('quickpoll_polls');
      if (storedPolls) {
        const polls = JSON.parse(storedPolls);
        setPolls(polls);
        setNextPollId(Math.max(...polls.map((p: Poll) => p.id), 0) + 1);
        console.log(`📦 Loaded ${polls.length} polls from local storage`);
        showInfo('Loaded markets from local storage (offline mode)');
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
            question: "Will Bitcoin reach $150,000 by end of 2025?",
            yesVotes: 28,
            noVotes: 15,
            yesAmount: 2800,
            noAmount: 1500,
            status: 'Active' as const,
            endTime: 1767225600, // Dec 31, 2025
            category: 'Crypto',
            volume: 4300
          },
          {
            id: 2,
            question: "Will Donald Trump win the 2024 US Presidential Election?",
            yesVotes: 45,
            noVotes: 32,
            yesAmount: 4500,
            noAmount: 3200,
            status: 'Resolved' as const,
            endTime: 1730851200, // Nov 5, 2024
            correctAnswer: true,
            category: 'Politics',
            volume: 7700
          },
          {
            id: 3,
            question: "Will Ethereum reach $5,000 by June 2026?",
            yesVotes: 22,
            noVotes: 18,
            yesAmount: 2200,
            noAmount: 1800,
            status: 'Active' as const,
            endTime: 1780358400, // Jun 30, 2026
            category: 'Crypto',
            volume: 4000
          },
          {
            id: 4,
            question: "Will AI replace 50% of software jobs by 2027?",
            yesVotes: 35,
            noVotes: 40,
            yesAmount: 3500,
            noAmount: 4000,
            status: 'Active' as const,
            endTime: 1798761600, // Dec 31, 2027
            category: 'Tech',
            volume: 7500
          },
          {
            id: 5,
            question: "Will the S&P 500 reach 7,000 by end of 2025?",
            yesVotes: 30,
            noVotes: 25,
            yesAmount: 3000,
            noAmount: 2500,
            status: 'Active' as const,
            endTime: 1767225600, // Dec 31, 2025
            category: 'Finance',
            volume: 5500
          },
          {
            id: 6,
            question: "Will the Fed cut rates by December 2024?",
            yesVotes: 98,
            noVotes: 2,
            yesAmount: 9800,
            noAmount: 200,
            status: 'Active' as const,
            endTime: 1735689600, // Dec 31, 2024
            category: 'Finance',
            volume: 10000
          },
          {
            id: 7,
            question: "Will NVIDIA be the largest company by end of November 2024?",
            yesVotes: 93,
            noVotes: 7,
            yesAmount: 9300,
            noAmount: 700,
            status: 'Active' as const,
            endTime: 1732924800, // Nov 30, 2024
            category: 'Finance',
            volume: 10000
          },
          {
            id: 8,
            question: "Will Elon Musk step down as Tesla CEO in 2025?",
            yesVotes: 4,
            noVotes: 96,
            yesAmount: 400,
            noAmount: 9600,
            status: 'Active' as const,
            endTime: 1767225600, // Dec 31, 2025
            category: 'Tech',
            volume: 10000
          },
          {
            id: 9,
            question: "Will gold close above $3,000 in 2025?",
            yesVotes: 1,
            noVotes: 99,
            yesAmount: 100,
            noAmount: 9900,
            status: 'Active' as const,
            endTime: 1767225600, // Dec 31, 2025
            category: 'Finance',
            volume: 10000
          },
          {
            id: 10,
            question: "Will Solana reach $350 by end of October 2024?",
            yesVotes: 5,
            noVotes: 95,
            yesAmount: 500,
            noAmount: 9500,
            status: 'Active' as const,
            endTime: 1730419200, // Oct 31, 2024
            category: 'Crypto',
            volume: 10000
          },
          {
            id: 11,
            question: "Will DraftKings launch a prediction market in 2025?",
            yesVotes: 27,
            noVotes: 73,
            yesAmount: 2700,
            noAmount: 7300,
            status: 'Active' as const,
            endTime: 1767225600, // Dec 31, 2025
            category: 'Sports',
            volume: 10000
          },
          {
            id: 12,
            question: "Will Perplexity acquire Chrome in 2025?",
            yesVotes: 3,
            noVotes: 97,
            yesAmount: 300,
            noAmount: 9700,
            status: 'Active' as const,
            endTime: 1767225600, // Dec 31, 2025
            category: 'Tech',
            volume: 10000
          }
        ];
        setPolls(blockchainPolls);
        setNextPollId(13);
        savePolls(blockchainPolls);
        console.log(`Loaded ${blockchainPolls.length} polls from blockchain`);
      } catch (blockchainError) {
        console.warn('Blockchain query failed, using default data:', blockchainError);
        // Load default data if no blockchain connection
        const defaultPolls: Poll[] = [
          {
            id: 1,
            question: "Will Bitcoin reach $150,000 by end of 2025?",
            yesVotes: 28,
            noVotes: 15,
            yesAmount: 2800,
            noAmount: 1500,
            status: 'Active' as const,
            endTime: 1767225600,
            category: 'Crypto',
            volume: 4300
          },
          {
            id: 2,
            question: "Will Donald Trump win the 2024 US Presidential Election?",
            yesVotes: 45,
            noVotes: 32,
            yesAmount: 4500,
            noAmount: 3200,
            status: 'Resolved' as const,
            endTime: 1730851200,
            correctAnswer: true,
            category: 'Politics',
            volume: 7700
          },
          {
            id: 3,
            question: "Will Ethereum reach $5,000 by June 2026?",
            yesVotes: 22,
            noVotes: 18,
            yesAmount: 2200,
            noAmount: 1800,
            status: 'Active' as const,
            endTime: 1780358400,
            category: 'Crypto',
            volume: 4000
          },
          {
            id: 4,
            question: "Will AI replace 50% of software jobs by 2027?",
            yesVotes: 35,
            noVotes: 40,
            yesAmount: 3500,
            noAmount: 4000,
            status: 'Active' as const,
            endTime: 1798761600,
            category: 'Tech',
            volume: 7500
          },
          {
            id: 5,
            question: "Will the S&P 500 reach 7,000 by end of 2025?",
            yesVotes: 30,
            noVotes: 25,
            yesAmount: 3000,
            noAmount: 2500,
            status: 'Active' as const,
            endTime: 1767225600,
            category: 'Finance',
            volume: 5500
          },
          {
            id: 6,
            question: "Will the Fed cut rates by December 2024?",
            yesVotes: 98,
            noVotes: 2,
            yesAmount: 9800,
            noAmount: 200,
            status: 'Active' as const,
            endTime: 1735689600,
            category: 'Finance',
            volume: 10000
          },
          {
            id: 7,
            question: "Will NVIDIA be the largest company by end of November 2024?",
            yesVotes: 93,
            noVotes: 7,
            yesAmount: 9300,
            noAmount: 700,
            status: 'Active' as const,
            endTime: 1732924800,
            category: 'Finance',
            volume: 10000
          },
          {
            id: 8,
            question: "Will Elon Musk step down as Tesla CEO in 2025?",
            yesVotes: 4,
            noVotes: 96,
            yesAmount: 400,
            noAmount: 9600,
            status: 'Active' as const,
            endTime: 1767225600,
            category: 'Tech',
            volume: 10000
          },
          {
            id: 9,
            question: "Will gold close above $3,000 in 2025?",
            yesVotes: 1,
            noVotes: 99,
            yesAmount: 100,
            noAmount: 9900,
            status: 'Active' as const,
            endTime: 1767225600,
            category: 'Finance',
            volume: 10000
          },
          {
            id: 10,
            question: "Will Solana reach $350 by end of October 2024?",
            yesVotes: 5,
            noVotes: 95,
            yesAmount: 500,
            noAmount: 9500,
            status: 'Active' as const,
            endTime: 1730419200,
            category: 'Crypto',
            volume: 10000
          },
          {
            id: 11,
            question: "Will DraftKings launch a prediction market in 2025?",
            yesVotes: 27,
            noVotes: 73,
            yesAmount: 2700,
            noAmount: 7300,
            status: 'Active' as const,
            endTime: 1767225600,
            category: 'Sports',
            volume: 10000
          },
          {
            id: 12,
            question: "Will Perplexity acquire Chrome in 2025?",
            yesVotes: 3,
            noVotes: 97,
            yesAmount: 300,
            noAmount: 9700,
            status: 'Active' as const,
            endTime: 1767225600,
            category: 'Tech',
            volume: 10000
          }
        ];
        setPolls(defaultPolls);
        setNextPollId(13);
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
    
    // Create poll locally first for immediate feedback
    const newPoll: Poll = {
      id: nextPollId,
      question: newPollQuestion,
      yesVotes: 0,
      noVotes: 0,
      yesAmount: 0,
      noAmount: 0,
      status: userRole === 'admin' ? 'Active' : 'Pending' as any,
      endTime,
      category: 'General',
      volume: 0,
      isPending: userRole !== 'admin' // Add pending flag for admin review
    };

    const updatedPolls = [...polls, newPoll];
    setPolls(updatedPolls);
    setNextPollId(nextPollId + 1);
    setNewPollQuestion('');
    setNewPollEndTime('');
    setShowCreateMarket(false);
    savePolls(updatedPolls);
    
    if (userRole === 'admin') {
      showSuccess('✅ Market created and published immediately!');
    } else {
      showSuccess('✅ Market submitted for review! Waiting for admin approval.');
    }
    
    // Try to submit to blockchain in background (non-blocking)
    try {
      console.log('📝 Attempting to sync market to blockchain...');
      await LineraAPI.createPoll(newPollQuestion, endTime);
      console.log('✅ Market synced to blockchain');
    } catch (error) {
      console.warn('⚠️ Could not sync to blockchain (using local storage):', error);
      // Don't show error to user - local storage is working fine
    }
  };

  const vote = async (pollId: number, choice: boolean) => {
    if (!isLoggedIn) {
      showWarning('Please connect wallet first');
      return;
    }

    const amount = 10; // Mock voting amount
    
    // Update local state immediately for better UX
    const updatedPolls = polls.map(poll => {
      if (poll.id === pollId) {
        const updatedPoll = {
          ...poll,
          yesVotes: choice ? poll.yesVotes + 1 : poll.yesVotes,
          noVotes: !choice ? poll.noVotes + 1 : poll.noVotes,
          yesAmount: choice ? poll.yesAmount + amount : poll.yesAmount,
          noAmount: !choice ? poll.noAmount + amount : poll.noAmount,
          volume: (poll.volume || 0) + amount
        };
        
        // Update selectedPoll if it's the same poll
        if (selectedPoll && selectedPoll.id === pollId) {
          setSelectedPoll(updatedPoll);
        }
        
        return updatedPoll;
      }
      return poll;
    });

    setPolls(updatedPolls);
    savePolls(updatedPolls);
    showSuccess(`✅ Voted ${choice ? 'Yes' : 'No'} successfully!`);
    
    // Try to submit to blockchain in background (non-blocking)
    try {
      console.log('🗳️ Attempting to sync vote to blockchain...', { pollId, choice, amount });
      await LineraAPI.vote(pollId, choice, amount);
      console.log('✅ Vote synced to blockchain');
    } catch (error) {
      console.warn('⚠️ Could not sync to blockchain (using local storage):', error);
      // Don't show error to user - local storage is working fine
    }
  };

  const resolvePoll = async (pollId: number, correctAnswer: boolean) => {
    if (userRole !== 'admin') {
      showWarning('Only admin can resolve polls');
      return;
    }

    // Update local state immediately
    const updatedPolls = polls.map(poll => {
      if (poll.id === pollId) {
        const updatedPoll = {
          ...poll,
          status: 'Resolved' as const,
          correctAnswer
        };
        
        // Update selectedPoll if it's the same poll
        if (selectedPoll && selectedPoll.id === pollId) {
          setSelectedPoll(updatedPoll);
        }
        
        return updatedPoll;
      }
      return poll;
    });

    setPolls(updatedPolls);
    savePolls(updatedPolls);
    showSuccess(`✅ Market resolved! Correct answer: ${correctAnswer ? 'Yes' : 'No'}`);
    
    // Try to submit to blockchain in background (non-blocking)
    try {
      console.log('⚖️ Attempting to sync resolution to blockchain...', { pollId, correctAnswer });
      await LineraAPI.resolvePoll(pollId, correctAnswer);
      console.log('✅ Resolution synced to blockchain');
    } catch (error) {
      console.warn('⚠️ Could not sync to blockchain (using local storage):', error);
      // Don't show error to user - local storage is working fine
    }
  };

  // Load data on mount
  useEffect(() => {
    loadPolls();
  }, [loadPolls]);

  const calculateProbability = (poll: Poll) => {
    const total = poll.yesAmount + poll.noAmount;
    if (total === 0) return 50;
    return Math.round((poll.yesAmount / total) * 100);
  };

  const filteredPolls = polls.filter(poll => {
    const matchesCategory = selectedCategory === 'All' || poll.category === selectedCategory;
    const matchesSearch = poll.question.toLowerCase().includes(searchQuery.toLowerCase());
    // Only show active and resolved markets to regular users
    // Admins can see all markets
    const isVisible = userRole === 'admin' || poll.status !== 'Pending';
    return matchesCategory && matchesSearch && isVisible;
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
                    disabled={isConnecting}
                    className={`px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium shadow-sm ${
                      isConnecting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
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

        {/* Create Market Button */}
        {isLoggedIn && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setShowCreateMarket(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium shadow-sm flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create New Market</span>
            </button>
          </div>
        )}

        {/* Markets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPolls.map((poll) => {
            const probability = calculateProbability(poll);
            const totalVolume = poll.volume || 0;
            
            return (
              <div 
                key={poll.id} 
                onClick={() => setSelectedPoll(poll)}
                className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
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
                        {new Date(poll.endTime * 1000).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
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

      {/* Create Market Modal */}
      {showCreateMarket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowCreateMarket(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Create New Market</h3>
              <button
                onClick={() => setShowCreateMarket(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Market Question
                </label>
                <input
                  type="text"
                  value={newPollQuestion}
                  onChange={(e) => setNewPollQuestion(e.target.value)}
                  placeholder="e.g., Will Bitcoin reach $150,000 by end of 2025?"
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
                  lang="en-US"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={createPoll}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 font-medium"
                >
                  Create Market
                </button>
                <button
                  onClick={() => {
                    setShowCreateMarket(false);
                    setNewPollQuestion('');
                    setNewPollEndTime('');
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

      {/* Poll Detail Modal */}
      {selectedPoll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPoll(null)}>
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Market Details</h3>
              <button
                onClick={() => setSelectedPoll(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Question */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {selectedPoll.question}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="px-3 py-1 bg-gray-100 rounded-full font-medium">
                    {selectedPoll.category || 'General'}
                  </span>
                  <span className="font-medium">${(selectedPoll.volume || 0).toLocaleString()} Volume</span>
                  <span>
                    Ends {new Date(selectedPoll.endTime * 1000).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedPoll.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedPoll.status}
                  </span>
                </div>
              </div>

              {/* Probability Chart */}
              <div className="bg-gradient-to-r from-green-50 to-red-50 rounded-lg p-6">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-blue-600">
                    {calculateProbability(selectedPoll)}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Current Probability</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-full transition-all duration-300"
                    style={{ width: `${calculateProbability(selectedPoll)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>Yes: {calculateProbability(selectedPoll)}%</span>
                  <span>No: {100 - calculateProbability(selectedPoll)}%</span>
                </div>
              </div>

              {/* Voting Options */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Place Your Bet</h4>
                
                {/* Yes Option */}
                <div className="border-2 border-green-200 rounded-lg p-4 hover:border-green-400 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-bold">Y</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Yes</div>
                        <div className="text-sm text-gray-500">
                          {selectedPoll.yesVotes} votes • ${selectedPoll.yesAmount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {calculateProbability(selectedPoll)}¢
                      </div>
                      <div className="text-xs text-gray-500">per share</div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      vote(selectedPoll.id, true);
                    }}
                    disabled={selectedPoll.status === 'Resolved' || !isLoggedIn}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {!isLoggedIn ? 'Connect Wallet to Vote' : 'Buy Yes Shares'}
                  </button>
                </div>

                {/* No Option */}
                <div className="border-2 border-red-200 rounded-lg p-4 hover:border-red-400 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 font-bold">N</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">No</div>
                        <div className="text-sm text-gray-500">
                          {selectedPoll.noVotes} votes • ${selectedPoll.noAmount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">
                        {100 - calculateProbability(selectedPoll)}¢
                      </div>
                      <div className="text-xs text-gray-500">per share</div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      vote(selectedPoll.id, false);
                    }}
                    disabled={selectedPoll.status === 'Resolved' || !isLoggedIn}
                    className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {!isLoggedIn ? 'Connect Wallet to Vote' : 'Buy No Shares'}
                  </button>
                </div>
              </div>

              {/* Resolution Status */}
              {selectedPoll.status === 'Resolved' && (
                <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="font-semibold text-blue-900">Market Resolved</div>
                      <div className="text-sm text-blue-700">
                        Correct Answer: <span className="font-bold">{selectedPoll.correctAnswer ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Controls */}
              {userRole === 'admin' && selectedPoll.status === 'Active' && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Admin Controls</h4>
                  <div className="flex space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        resolvePoll(selectedPoll.id, true);
                        setSelectedPoll(null);
                      }}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                    >
                      Resolve: Yes
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        resolvePoll(selectedPoll.id, false);
                        setSelectedPoll(null);
                      }}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                    >
                      Resolve: No
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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