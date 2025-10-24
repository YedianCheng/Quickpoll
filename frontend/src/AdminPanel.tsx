import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'verified_user' | 'admin' | 'super_admin';
  status: 'active' | 'pending' | 'suspended';
  walletAddress: string;
  reputation: number;
  createdAt: string;
}

interface PendingMarket {
  id: number;
  question: string;
  category: string;
  endTime: number;
  creator: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reason?: string;
}

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  pendingMarkets: number;
  totalMarkets: number;
  totalVolume: number;
}

interface AdminPanelProps {
  onLogout?: () => void;
}

function AdminPanel({ onLogout }: AdminPanelProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [pendingMarkets, setPendingMarkets] = useState<PendingMarket[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    pendingMarkets: 0,
    totalMarkets: 0,
    totalVolume: 0
  });
  const [activeTab, setActiveTab] = useState<'users' | 'markets' | 'stats'>('stats');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Mock data - 在实际应用中从后端API获取
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        username: 'alice_crypto',
        email: 'alice@example.com',
        role: 'verified_user',
        status: 'active',
        walletAddress: '0x1234...5678',
        reputation: 85,
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        username: 'bob_trader',
        email: 'bob@example.com',
        role: 'user',
        status: 'pending',
        walletAddress: '0x9876...5432',
        reputation: 0,
        createdAt: '2024-01-20'
      },
      {
        id: '3',
        username: 'charlie_admin',
        email: 'charlie@example.com',
        role: 'admin',
        status: 'active',
        walletAddress: '0xabcd...efgh',
        reputation: 100,
        createdAt: '2024-01-10'
      }
    ];

    const mockPendingMarkets: PendingMarket[] = [
      {
        id: 1,
        question: 'Will Ethereum reach $5,000 by end of 2024?',
        category: 'Crypto',
        endTime: 1735689600,
        creator: 'alice_crypto',
        status: 'pending',
        submittedAt: '2024-01-22'
      },
      {
        id: 2,
        question: 'Will the US election result be contested?',
        category: 'Politics',
        endTime: 1735689600,
        creator: 'bob_trader',
        status: 'pending',
        submittedAt: '2024-01-21'
      }
    ];

    setUsers(mockUsers);
    setPendingMarkets(mockPendingMarkets);
    setStats({
      totalUsers: mockUsers.length,
      activeUsers: mockUsers.filter(u => u.status === 'active').length,
      pendingMarkets: mockPendingMarkets.length,
      totalMarkets: 15,
      totalVolume: 125000
    });
  }, []);

  const approveUser = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: 'active', role: 'verified_user' as const }
        : user
    ));
  };

  const suspendUser = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: 'suspended' as const }
        : user
    ));
  };

  const approveMarket = (marketId: number) => {
    setPendingMarkets(pendingMarkets.map(market => 
      market.id === marketId 
        ? { ...market, status: 'approved' as const }
        : market
    ));
  };

  const rejectMarket = (marketId: number, reason: string) => {
    setPendingMarkets(pendingMarkets.map(market => 
      market.id === marketId 
        ? { ...market, status: 'rejected' as const, reason }
        : market
    ));
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMarkets = pendingMarkets.filter(market =>
    market.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    market.creator.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 ml-3">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-full font-medium">
                Super Admin
              </span>
              <button 
                onClick={onLogout}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'stats', label: 'Dashboard', icon: '📊' },
              { id: 'users', label: 'User Management', icon: '👥' },
              { id: 'markets', label: 'Market Review', icon: '📈' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-blue-600 text-xl">👥</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-green-600 text-xl">✅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <span className="text-yellow-600 text-xl">⏳</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Markets</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingMarkets}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <span className="text-purple-600 text-xl">💰</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Volume</p>
                    <p className="text-2xl font-bold text-gray-900">${stats.totalVolume.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">New user registration: alice_crypto</span>
                    <span className="text-xs text-gray-400">2 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Market pending review: "Will Bitcoin reach $100k?"</span>
                    <span className="text-xs text-gray-400">4 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Market approved: "Election prediction 2024"</span>
                    <span className="text-xs text-gray-400">6 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reputation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.role === 'super_admin' ? 'bg-red-100 text-red-800' :
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'verified_user' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' :
                          user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.reputation}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {user.status === 'pending' && (
                            <button
                              onClick={() => approveUser(user.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                          <button
                            onClick={() => suspendUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Suspend
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Market Review Tab */}
        {activeTab === 'markets' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Market Review</h2>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="Search markets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredMarkets.map((market) => (
                <div key={market.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {market.question}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="px-2 py-1 bg-gray-100 rounded-full">
                          {market.category}
                        </span>
                        <span>Created by: {market.creator}</span>
                        <span>Submitted: {market.submittedAt}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      market.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      market.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {market.status}
                    </span>
                  </div>

                  {market.status === 'pending' && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => approveMarket(market.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                      >
                        Approve Market
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Rejection reason:');
                          if (reason) rejectMarket(market.id, reason);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
                      >
                        Reject Market
                      </button>
                    </div>
                  )}

                  {market.reason && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-800">
                        <strong>Rejection reason:</strong> {market.reason}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminPanel;
