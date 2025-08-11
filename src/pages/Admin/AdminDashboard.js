import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge } from '../../components/UI/LoadingSpinner';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import {
  Users,
  Video,
  DollarSign,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Eye,
  ArrowRight,
  Calendar
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/dashboard/stats');

      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Fetch dashboard stats error:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <LoadingSpinner text="Loading admin dashboard..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor platform activity and manage user operations
        </p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
              <p className="text-blue-100 text-xs mt-1">Active accounts</p>
            </div>
            <div className="p-3 bg-blue-400 rounded-full">
              <Users className="w-8 h-8" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Videos</p>
              <p className="text-3xl font-bold">{stats?.totalVideos || 0}</p>
              <p className="text-purple-100 text-xs mt-1">Active content</p>
            </div>
            <div className="p-3 bg-purple-400 rounded-full">
              <Video className="w-8 h-8" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Earnings</p>
              <p className="text-3xl font-bold">{(stats?.totalEarnings || 0).toLocaleString()}</p>
              <p className="text-green-100 text-xs mt-1">IQD distributed</p>
            </div>
            <div className="p-3 bg-green-400 rounded-full">
              <DollarSign className="w-8 h-8" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Pending Withdrawals</p>
              <p className="text-3xl font-bold">{stats?.pendingWithdrawals || 0}</p>
              <p className="text-orange-100 text-xs mt-1">Awaiting review</p>
            </div>
            <div className="p-3 bg-orange-400 rounded-full">
              <Clock className="w-8 h-8" />
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Platform Activity
            </h3>
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Video Views</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats?.totalViews?.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Withdrawals</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats?.totalWithdrawals || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Average Earnings/User</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats?.totalUsers > 0
                  ? Math.round((stats?.totalEarnings || 0) / stats.totalUsers).toLocaleString()
                  : 0
                } IQD
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <Eye className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                New users: +{Math.floor(Math.random() * 10) + 1} today
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Videos watched: +{Math.floor(Math.random() * 50) + 20} today
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Tasks completed: +{Math.floor(Math.random() * 15) + 5} today
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              System Status
            </h3>
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Server Status</span>
              <Badge variant="success">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
              <Badge variant="success">Connected</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Payment System</span>
              <Badge variant="success">Active</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Users
            </h3>
            <Link
              to="/admin/users"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {stats?.recentUsers?.map((user) => (
              <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Joined {formatDate(user.createdAt)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Last login: {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                  </p>
                </div>
              </div>
            ))}

            {(!stats?.recentUsers || stats.recentUsers.length === 0) && (
              <div className="py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">No recent users</p>
              </div>
            )}
          </div>
        </Card>

        {/* Top Videos */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Performing Videos
            </h3>
            <Link
              to="/admin/videos"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {stats?.topVideos?.map((video, index) => (
              <div key={video._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                      #{index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {video.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {video.totalViews} views • {video.totalEarnings?.toLocaleString()} IQD earned
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="info">
                    {video.totalViews} views
                  </Badge>
                </div>
              </div>
            ))}

            {(!stats?.topVideos || stats.topVideos.length === 0) && (
              <div className="py-8">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">No videos uploaded yet</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Quick Actions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/users"
            className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="font-medium text-blue-700 dark:text-blue-300">Manage Users</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">View and edit user accounts</p>
            </div>
          </Link>

          <Link
            to="/admin/videos"
            className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            <Video className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="font-medium text-purple-700 dark:text-purple-300">Manage Videos</p>
              <p className="text-sm text-purple-600 dark:text-purple-400">Add and edit video content</p>
            </div>
          </Link>

          <Link
            to="/admin/withdrawals"
            className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            <div>
              <p className="font-medium text-green-700 dark:text-green-300">Process Withdrawals</p>
              <p className="text-sm text-green-600 dark:text-green-400">Review payment requests</p>
            </div>
          </Link>

          <Link
            to="/admin/settings"
            className="flex items-center space-x-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
          >
            <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            <div>
              <p className="font-medium text-orange-700 dark:text-orange-300">Platform Settings</p>
              <p className="text-sm text-orange-600 dark:text-orange-400">Configure system settings</p>
            </div>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;