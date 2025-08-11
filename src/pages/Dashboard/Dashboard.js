import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card, Badge } from '../../components/UI/LoadingSpinner';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import {
  DollarSign,
  Video,
  Clock,
  TrendingUp,
  Gift,
  ArrowRight,
  Star,
  Play,
  CheckCircle,
  Lock,
  Bell
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [recentEarnings, setRecentEarnings] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [tasksResponse, statsResponse, notificationsResponse] = await Promise.all([
        axios.get('/tasks'),
        axios.get('/users/stats'),
        axios.get('/users/notifications?limit=3')
      ]);

      if (tasksResponse.data.success) {
        setTasks(tasksResponse.data.tasks);
      }

      if (statsResponse.data.success) {
        setStats(statsResponse.data.stats);
        setRecentEarnings(statsResponse.data.recentEarnings || []);
      }

      if (notificationsResponse.data.success) {
        setNotifications(notificationsResponse.data.notifications);
      }

      // Refresh user data to get latest balance
      await refreshUser();
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getTaskStatusBadge = (task) => {
    if (!task.isUnlocked) {
      return <Badge variant="default">Locked</Badge>;
    }
    if (task.completed) {
      return <Badge variant="success">Completed</Badge>;
    }
    return <Badge variant="info">Available</Badge>;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {getGreeting()}, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ready to earn some money today? Check out your available tasks below.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Current Balance */}
        <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Current Balance</p>
              <p className="text-2xl font-bold">{user?.balance?.toLocaleString() || 0} IQD</p>
            </div>
            <div className="p-3 bg-green-400 rounded-full">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Total Earned */}
        <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Earned</p>
              <p className="text-2xl font-bold">{user?.totalEarned?.toLocaleString() || 0} IQD</p>
            </div>
            <div className="p-3 bg-blue-400 rounded-full">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Videos Watched */}
        <Card className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Videos Watched</p>
              <p className="text-2xl font-bold">{stats?.totalVideosWatched || 0}</p>
            </div>
            <div className="p-3 bg-purple-400 rounded-full">
              <Video className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Tasks Completed */}
        <Card className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Tasks Completed</p>
              <p className="text-2xl font-bold">{stats?.tasksCompleted || 0}</p>
            </div>
            <div className="p-3 bg-orange-400 rounded-full">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tasks Section */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Available Tasks</h2>
            <Link
              to="/tasks"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task._id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${task.isUnlocked
                      ? task.completed
                        ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                        : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                      }`}>
                      {task.isUnlocked ? (
                        task.completed ? <CheckCircle className="w-6 h-6" /> : <Play className="w-6 h-6" />
                      ) : (
                        <Lock className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Task {task.taskNumber}: {task.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {task.videos?.length || 0} videos • {task.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        {getTaskStatusBadge(task)}
                        {task.videos && task.videos.length > 0 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Progress: {task.videosWatched?.length || 0}/{task.videos.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {task.isUnlocked && !task.completed && (
                    <button
                      onClick={() => navigate(`/tasks/${task.taskNumber}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>Start</span>
                    </button>
                  )}
                </div>
              </Card>
            ))}

            {tasks.length === 0 && (
              <Card className="p-8 text-center">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Tasks Available
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Check back later for new earning opportunities!
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                to="/withdrawal"
                className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="font-medium text-green-700 dark:text-green-300">
                    Withdraw Money
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-green-600 dark:text-green-400" />
              </Link>

              <Link
                to="/tasks"
                className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-blue-700 dark:text-blue-300">
                    Watch Videos
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </Link>

              <Link
                to="/withdrawal-history"
                className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="font-medium text-purple-700 dark:text-purple-300">
                    View History
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </Link>
            </div>
          </Card>

          {/* Recent Notifications */}
          {notifications.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Notifications
                </h3>
                <Link
                  to="/notifications"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Earnings Tip */}
          <Card className="p-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
            <div className="flex items-center space-x-3 mb-3">
              <Star className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Pro Tip!</h3>
            </div>
            <p className="text-sm text-yellow-100 mb-4">
              Watch all videos in a task completely to maximize your earnings and unlock new tasks!
            </p>
            <Link
              to="/tasks"
              className="inline-flex items-center space-x-1 bg-white text-orange-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-orange-50 transition-colors"
            >
              <span>Start Earning</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </Card>
        </div>
      </div>
    </div >
  );
};

export default Dashboard;