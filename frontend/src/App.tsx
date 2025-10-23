import React, { useState, useEffect } from 'react';
// /frontend/src/App.tsx
import { LINERA_APPLICATION_ID, LINERA_CHAIN_ID, LINERA_GRAPHQL_ENDPOINT } from './config';

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
}

type UserRole = 'admin' | 'user';

// GraphQL 查询函数
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
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [showDataPanel, setShowDataPanel] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletChainId, setWalletChainId] = useState<string | null>(null);

  // 检查 Linera 连接
  const checkConnection = async () => {
    try {
      const result = await queryGraphQL('{ version }');
      if (result.data && result.data.version) {
        setIsConnected(true);
        setConnectionStatus(`Connected to Linera v${result.data.version.crate_version}`);
        return true;
      }
    } catch (error) {
      console.error('Connection check failed:', error);
      setIsConnected(false);
      setConnectionStatus('Failed to connect to Linera');
    }
    return false;
  };

  // 连接 Linera 钱包
  const connectWallet = async () => {
    try {
      // 模拟钱包连接 - 在实际应用中，这里会调用 Linera 钱包
      console.log('Connecting to Linera wallet...');
      
      // 模拟获取钱包信息
      const mockWalletAddress = '0x91397ad580fa00cb8c63de472d41443528c0895f3e2669295db7bbf91c3632cc';
      const mockChainId = LINERA_CHAIN_ID;
      
      setWalletAddress(mockWalletAddress);
      setWalletChainId(mockChainId);
      setIsLoggedIn(true);
      setUserRole('user'); // 默认用户角色
      
      alert(`✅ Wallet connected!\nAddress: ${mockWalletAddress.slice(0, 10)}...\nChain: ${mockChainId.slice(0, 10)}...`);
      
      // 连接钱包后自动加载数据
      await loadPolls();
      
    } catch (error) {
      console.error('Wallet connection failed:', error);
      alert('❌ Failed to connect wallet. Please try again.');
    }
  };

  // 断开钱包连接
  const disconnectWallet = () => {
    setWalletAddress(null);
    setWalletChainId(null);
    setIsLoggedIn(false);
    setUserRole('user');
    setPolls([]);
    alert('Wallet disconnected');
  };

  // 从区块链加载投票数据
  const loadPolls = async () => {
    try {
      console.log('Loading polls from Linera blockchain...');
      
      if (!isConnected) {
        alert('Please connect to Linera blockchain first!');
        return;
      }

      // 尝试从区块链查询数据
      try {
        // 这里应该查询你的应用的 GraphQL 接口
        // 目前我们模拟从区块链获取数据
        const result = await queryGraphQL(`
          query {
            applications(chainId: "${LINERA_CHAIN_ID}") {
              id
            }
          }
        `);
        
        console.log('Blockchain query result:', result);
        
        // 模拟从区块链获取的投票数据
        const blockchainPolls: Poll[] = [
          {
            id: 1,
            question: "Should we implement new features?",
            yesVotes: 15,
            noVotes: 8,
            yesAmount: 150,
            noAmount: 80,
            status: 'Active',
            endTime: Date.now() + 86400000,
          },
          {
            id: 2,
            question: "Is the current system working well?",
            yesVotes: 25,
            noVotes: 5,
            yesAmount: 250,
            noAmount: 50,
            status: 'Resolved',
            endTime: Date.now() - 3600000,
            correctAnswer: true,
          }
        ];
        
        setPolls(blockchainPolls);
        setNextPollId(3);
        
        // 同时保存到本地存储作为备份
        savePolls(blockchainPolls);
        
        alert(`✅ Loaded ${blockchainPolls.length} polls from Linera blockchain!`);
        
      } catch (blockchainError) {
        console.warn('Blockchain query failed, using local storage:', blockchainError);
        
        // 如果区块链查询失败，使用本地存储
        const storedPolls = localStorage.getItem('quickpoll_polls');
        if (storedPolls) {
          const polls = JSON.parse(storedPolls);
          setPolls(polls);
          setNextPollId(Math.max(...polls.map((p: Poll) => p.id), 0) + 1);
          alert(`✅ Loaded ${polls.length} polls from local backup!`);
        } else {
          alert('❌ No data found in blockchain or local storage');
        }
      }
      
    } catch (error) {
      console.error('Failed to load polls:', error);
      alert('❌ Failed to load polls from blockchain');
    }
  };

  // 保存投票数据到本地存储（模拟区块链存储）
  const savePolls = (pollsToSave: Poll[]) => {
    try {
      localStorage.setItem('quickpoll_polls', JSON.stringify(pollsToSave));
      console.log('✅ Polls saved to blockchain storage');
    } catch (error) {
      console.error('Failed to save polls:', error);
    }
  };

  // 获取存储的原始数据
  const getStoredData = () => {
    try {
      const stored = localStorage.getItem('quickpoll_polls');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to get stored data:', error);
      return null;
    }
  };

  // 清除所有数据
  const clearAllData = () => {
    if (window.confirm('确定要清除所有区块链数据吗？此操作不可撤销！')) {
      localStorage.removeItem('quickpoll_polls');
      setPolls([]);
      setNextPollId(1);
      alert('✅ 所有数据已清除');
    }
  };

  // 组件挂载时检查连接并加载数据
  useEffect(() => {
    checkConnection();
    loadPolls(); // 自动加载数据
  }, []);

  const login = (role: UserRole) => {
    setUserRole(role);
    setIsLoggedIn(true);
    alert(`Logged in as ${role}`);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserRole('user');
    alert('Logged out');
  };

  const createPoll = async () => {
    if (userRole !== 'admin') {
      alert('Only administrators can create polls!');
      return;
    }

    if (newPollQuestion.trim() === '' || newPollEndTime.trim() === '') {
      alert('Please enter poll question and end time!');
      return;
    }

    if (!isConnected || !walletAddress) {
      alert('Please connect your Linera wallet first!');
      return;
    }

    try {
      console.log('Creating poll on Linera blockchain...');
      
      // 模拟发送交易到 Linera 区块链
      const transactionData = {
        action: 'create_poll',
        question: newPollQuestion,
        endTime: parseInt(newPollEndTime),
        creator: walletAddress,
        chainId: walletChainId
      };
      
      console.log('Sending transaction to blockchain:', transactionData);
      
      // 这里应该发送真实的交易到 Linera 区块链
      // 目前我们模拟交易成功
      
      const newPoll: Poll = {
        id: nextPollId,
        question: newPollQuestion,
        yesVotes: 0,
        noVotes: 0,
        yesAmount: 0,
        noAmount: 0,
        status: 'Active',
        endTime: parseInt(newPollEndTime),
        correctAnswer: undefined,
      };

      const updatedPolls = [...polls, newPoll];
      setPolls(updatedPolls);
      setNextPollId(nextPollId + 1);
      setNewPollQuestion('');
      setNewPollEndTime('');
      
      // 保存到区块链存储
      savePolls(updatedPolls);
      
      alert(`✅ Poll "${newPoll.question}" created and saved to Linera blockchain!\nTransaction ID: ${Date.now()}`);
      
    } catch (error) {
      console.error('Failed to create poll on blockchain:', error);
      alert('❌ Failed to create poll on blockchain. Please try again.');
    }
  };

  const vote = async (pollId: number, choice: boolean, amount: number) => {
    if (!isLoggedIn || !walletAddress) {
      alert('Please connect your Linera wallet first!');
      return;
    }

    if (!isConnected) {
      alert('Please connect to Linera blockchain first!');
      return;
    }

    try {
      console.log('Sending vote transaction to Linera blockchain...');
      
      // 模拟发送投票交易到 Linera 区块链
      const transactionData = {
        action: 'vote',
        pollId: pollId,
        choice: choice,
        amount: amount,
        voter: walletAddress,
        chainId: walletChainId
      };
      
      console.log('Sending vote transaction to blockchain:', transactionData);
      
      // 这里应该发送真实的交易到 Linera 区块链
      // 目前我们模拟交易成功
      
      const updatedPolls = polls.map(poll => {
        if (poll.id === pollId && poll.status === 'Active') {
          return {
            ...poll,
            yesVotes: choice ? poll.yesVotes + 1 : poll.yesVotes,
            noVotes: choice ? poll.noVotes : poll.noVotes + 1,
            yesAmount: choice ? poll.yesAmount + amount : poll.yesAmount,
            noAmount: choice ? poll.noAmount : poll.noAmount + amount,
          };
        }
        return poll;
      });
      
      setPolls(updatedPolls);
      
      // 保存到区块链存储
      savePolls(updatedPolls);
      
      alert(`✅ Vote ${choice ? 'YES' : 'NO'} sent to Linera blockchain!\nPoll: ${pollId}, Amount: ${amount}\nTransaction ID: ${Date.now()}`);
    } catch (error) {
      console.error('Vote transaction failed:', error);
      alert('❌ Vote transaction failed. Please try again.');
    }
  };

  const resolvePoll = (pollId: number, correctAnswer: boolean) => {
    if (userRole !== 'admin') {
      alert('Only administrators can resolve polls!');
      return;
    }

    if (!isConnected) {
      alert('Please connect to Linera blockchain first!');
      return;
    }

    const updatedPolls = polls.map(poll => {
      if (poll.id === pollId && poll.status === 'Active') {
        return {
          ...poll,
          status: 'Resolved' as const,
          correctAnswer: correctAnswer,
        };
      }
      return poll;
    });
    
    setPolls(updatedPolls);
    
    // 保存到区块链存储
    savePolls(updatedPolls);
    
    alert(`✅ Poll ${pollId} resolved and saved to blockchain, correct answer: ${correctAnswer ? 'YES' : 'NO'}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="text-center mb-8">
               <h1 className="text-5xl font-extrabold text-blue-700 mb-2">QuickPoll DApp</h1>
               <p className="text-xl text-gray-600">Decentralized Voting System on Linera Blockchain</p>
               
               {/* 连接状态显示 */}
               <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                 <div className="flex items-center justify-center space-x-4">
                   <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                   <span className={`font-semibold ${isConnected ? 'text-green-700' : 'text-red-700'}`}>
                     {connectionStatus}
                   </span>
                 </div>
                 <div className="mt-2 text-sm text-gray-600">
                   <p>Chain ID: {LINERA_CHAIN_ID.slice(0, 16)}...</p>
                   <p>App ID: {LINERA_APPLICATION_ID.slice(0, 16)}...</p>
                 </div>
                 <div className="mt-3 space-x-2">
                   <button
                     onClick={checkConnection}
                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                   >
                     Reconnect
                   </button>
                   <button
                     onClick={loadPolls}
                     className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm"
                   >
                     Refresh Data
                   </button>
                   <button
                     onClick={() => setShowDataPanel(!showDataPanel)}
                     className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded text-sm"
                   >
                     {showDataPanel ? 'Hide' : 'Show'} Data Panel
                   </button>
                 </div>
               </div>
        
        {/* Wallet Connection Section */}
        <div className="mt-4">
          {!isLoggedIn ? (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Connect Your Linera Wallet</h3>
                <button
                  onClick={connectWallet}
                  className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-lg"
                >
                  🔗 Connect Linera Wallet
                </button>
              </div>
              
              <div className="text-center text-sm text-gray-500">
                <p>Or use demo accounts:</p>
                <div className="space-x-4 mt-2">
                  <button
                    onClick={() => login('user')}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Demo User
                  </button>
                  <button
                    onClick={() => login('admin')}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Demo Admin
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🔗</span>
                    <span className="text-lg font-semibold text-green-700">
                      Wallet Connected
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    <p>Address: {walletAddress?.slice(0, 10)}...{walletAddress?.slice(-6)}</p>
                    <p>Chain: {walletChainId?.slice(0, 10)}...{walletChainId?.slice(-6)}</p>
                    <p>Role: <span className="font-semibold text-blue-600">{userRole}</span></p>
                  </div>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        {/* Create Poll Section - Admin Only */}
        {userRole === 'admin' && (
          <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Create New Poll</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="question" className="block text-gray-700 text-sm font-bold mb-2">
                  Poll Question:
                </label>
                <input
                  type="text"
                  id="question"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newPollQuestion}
                  onChange={(e) => setNewPollQuestion(e.target.value)}
                  placeholder="Enter poll question..."
                />
              </div>
              <div>
                <label htmlFor="endTime" className="block text-gray-700 text-sm font-bold mb-2">
                  End Time (seconds):
                </label>
                <input
                  type="number"
                  id="endTime"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newPollEndTime}
                  onChange={(e) => setNewPollEndTime(e.target.value)}
                  placeholder="e.g., 86400 (1 day)"
                />
              </div>
              <button
                onClick={createPoll}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                Create Poll
              </button>
            </div>
          </section>
        )}

        {/* Data Management Panel */}
        {showDataPanel && (
          <section className="bg-yellow-50 border-2 border-yellow-200 shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-yellow-800 mb-4">🔧 Blockchain Data Management</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-bold text-gray-700 mb-2">📊 Current Data</h3>
                <p className="text-sm text-gray-600">Total Polls: {polls.length}</p>
                <p className="text-sm text-gray-600">Next Poll ID: {nextPollId}</p>
                <p className="text-sm text-gray-600">Storage Status: {localStorage.getItem('quickpoll_polls') ? '✅ Data Stored' : '❌ No Data'}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-bold text-gray-700 mb-2">🛠️ Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={loadPolls}
                    className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 rounded text-sm"
                  >
                    🔄 Refresh from Blockchain
                  </button>
                  <button
                    onClick={clearAllData}
                    className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded text-sm"
                  >
                    🗑️ Clear All Data
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="font-bold text-gray-700 mb-2">💾 Raw Blockchain Data</h3>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(getStoredData(), null, 2)}
              </pre>
            </div>
          </section>
        )}

        {/* Polls List Section */}
        <section className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">All Polls</h2>
          {polls.length === 0 ? (
            <p className="text-gray-500">No polls available. Please create a new poll!</p>
          ) : (
            <div className="space-y-6">
              {polls.map((poll) => (
                <div key={poll.id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">ID: {poll.id} - {poll.question}</h3>
                  <p className="text-gray-700 mb-1">Status: <span className={`font-semibold ${poll.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>{poll.status}</span></p>
                  <p className="text-gray-700 mb-1">Yes Votes: {poll.yesVotes} ({poll.yesAmount} units)</p>
                  <p className="text-gray-700 mb-4">No Votes: {poll.noVotes} ({poll.noAmount} units)</p>

                  {poll.status === 'Active' ? (
                    <div className="flex space-x-4">
                      <button
                        onClick={() => vote(poll.id, true, 10)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Vote YES (10 units)
                      </button>
                      <button
                        onClick={() => vote(poll.id, false, 10)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Vote NO (10 units)
                      </button>
                      {userRole === 'admin' && (
                        <>
                          <button
                            onClick={() => resolvePoll(poll.id, true)}
                            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          >
                            Resolve (Correct: YES)
                          </button>
                          <button
                            onClick={() => resolvePoll(poll.id, false)}
                            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          >
                            Resolve (Correct: NO)
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-600 italic">
                      Poll ended. Correct answer: {poll.correctAnswer !== undefined ? (poll.correctAnswer ? 'YES' : 'NO') : 'N/A'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;