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
  Bell,
  ArrowUp,
  Target,
  Award
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProgressBar = ({ percentage, color = "green" }) => {
  const colorClasses = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500"
  };

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
      <div
        className={`h-full ${colorClasses[color]} transition-all duration-500 ease-out`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  );
};

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
      toast.error('فشل تحميل بيانات لوحة التحكم');
    } finally {
      setLoading(false);
    }
  };

  const getTaskStatusBadge = (task) => {
    if (!task.isUnlocked) {
      return <Badge variant="default">مقفول</Badge>;
    }
    if (task.completed) {
      return <Badge variant="success">مكتمل</Badge>;
    }
    return <Badge variant="info">متاح</Badge>;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'صباح الخير';
    if (hour < 18) return 'مساء الخير';
    return 'مساء النور';
  };

  const calculateProgress = (watched, total) => {
    if (!total || total === 0) return 0;
    return Math.round((watched / total) * 100);
  };

  if (loading) {
    return <LoadingSpinner text="جاري تحميل لوحة التحكم..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      {/* Welcome Section */}
      <div className="mb-8 text-right">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          {getGreeting()}، {user?.name}! 👋
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          هل أنت مستعد لكسب المال اليوم؟ تحقق من المهام المتاحة أدناه.
        </p>
      </div>

      {/* Main Balance Card */}
      <Card className="mb-8 p-8 bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-black/10 backdrop-blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="text-right flex-1">
              <p className="text-green-100 text-sm font-medium mb-1">الرصيد الحالي</p>
              <p className="text-4xl md:text-5xl font-bold mb-2">{user?.balance?.toLocaleString() || 0} د.ع</p>
              <div className="flex items-center justify-start space-x-reverse space-x-2">
                <ArrowUp className="w-4 h-4 text-green-200" />
                <span className="text-green-200 text-sm">استمر في الكسب!</span>
              </div>
            </div>
            <div className="p-4 bg-green-400/30 backdrop-blur rounded-2xl">
              <DollarSign className="w-8 h-8" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-green-400/20">
            <div className="text-center">
              <p className="text-green-100 text-xs mb-1">إجمالي الأرباح</p>
              <p className="text-lg font-semibold">{user?.totalEarned?.toLocaleString() || 0} د.ع</p>
            </div>
            <div className="text-center">
              <p className="text-green-100 text-xs mb-1">المهام المكتملة</p>
              <p className="text-lg font-semibold">{stats?.tasksCompleted || 0}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Earned */}
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-right flex-1">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">إجمالي الأرباح</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{user?.totalEarned?.toLocaleString() || 0} د.ع</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">نمو الأرباح</span>
                <span className="font-medium text-blue-600">ممتاز!</span>
              </div>
              <ProgressBar percentage={75} color="blue" />
            </div>
          </div>
        </Card>

        {/* Videos Watched */}
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/5"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-right flex-1">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">الفيديوهات المشاهدة</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalVideosWatched || 0}</p>
                <p className="text-xs text-purple-600 font-medium">استمر في المشاهدة!</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl">
                <Video className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">التقدم</span>
                <span className="font-medium text-purple-600">رائع!</span>
              </div>
              <ProgressBar percentage={calculateProgress(stats?.totalVideosWatched, stats?.totalVideosWatched + 20)} color="purple" />
            </div>
          </div>
        </Card>

        {/* Tasks Completed */}
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-600/5"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-right flex-1">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">المهام المكتملة</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.tasksCompleted || 0}</p>
                <p className="text-xs text-orange-600 font-medium">إنجاز رائع!</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">معدل الإكمال</span>
                <span className="font-medium text-orange-600">عالي</span>
              </div>
              <ProgressBar percentage={90} color="orange" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tasks Section */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6 space-x-reverse space-x-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">المهام المتاحة</h2>
            <Link
              to="/tasks"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center space-x-reverse space-x-1"
            >
              <span>عرض الكل</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task._id} className="p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between space-x-reverse space-x-4">
                  <div className="flex items-center space-x-reverse space-x-4 flex-1">
                    <div className={`p-3 rounded-2xl ${task.isUnlocked
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
                    <div className="text-right flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                        المهمة {task.taskNumber}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {task.videos?.length || 0} فيديو • {task.description}
                      </p>
                      <div className="flex items-center space-x-reverse space-x-3 mt-3">
                        {getTaskStatusBadge(task)}
                        {task.videos && task.videos.length > 0 && (
                          <div className="flex items-center space-x-reverse space-x-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              التقدم: {task.videosWatched?.length || 0}/{task.videos.length}
                            </span>
                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                              <div
                                className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                                style={{
                                  width: `${calculateProgress(task.videosWatched?.length || 0, task.videos.length)}%`
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {task.isUnlocked && !task.completed && (
                    <button
                      onClick={() => navigate(`/tasks/${task.taskNumber}`)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center space-x-reverse space-x-2 shadow-lg hover:shadow-xl"
                    >
                      <Play className="w-4 h-4" />
                      <span>ابدأ</span>
                    </button>
                  )}
                </div>
              </Card>
            ))}

            {tasks.length === 0 && (
              <Card className="p-8 text-center border border-gray-100 dark:border-gray-700">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  لا توجد مهام متاحة
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  عد لاحقًا لمزيد من فرص الكسب!
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-right">
              إجراءات سريعة
            </h3>
            <div className="space-y-3">
              <Link
                to="/withdrawal"
                className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-300 space-x-reverse space-x-3 border border-green-200 dark:border-green-800"
              >
                <div className="flex items-center space-x-reverse space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="font-medium text-green-700 dark:text-green-300">
                    سحب الأموال
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-green-600 dark:text-green-400" />
              </Link>

              <Link
                to="/tasks"
                className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 space-x-reverse space-x-3 border border-blue-200 dark:border-blue-800"
              >
                <div className="flex items-center space-x-reverse space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                    <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-medium text-blue-700 dark:text-blue-300">
                    مشاهدة الفيديوهات
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </Link>

              <Link
                to="/withdrawal-history"
                className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-300 space-x-reverse space-x-3 border border-purple-200 dark:border-purple-800"
              >
                <div className="flex items-center space-x-reverse space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="font-medium text-purple-700 dark:text-purple-300">
                    عرض السجل
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </Link>
            </div>
          </Card>

          {/* Recent Notifications */}
          {notifications.length > 0 && (
            <Card className="p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4 space-x-reverse space-x-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-right">
                  الإشعارات الحديثة
                </h3>
                <Link
                  to="/notifications"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                >
                  عرض الكل
                </Link>
              </div>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className="flex items-start space-x-reverse space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600"
                  >
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0 text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString('ar')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Earnings Tip */}
          <Card className="p-6 bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-0">
            <div className="flex items-center space-x-reverse space-x-3 mb-3">
              <Star className="w-6 h-6" />
              <h3 className="text-lg font-semibold">نصيحة!</h3>
            </div>
            <p className="text-sm text-yellow-100 mb-4">
              شاهد جميع الفيديوهات في المهمة بالكامل لزيادة أرباحك وفتح مهام جديدة!
            </p>
            <Link
              to="/tasks"
              className="inline-flex items-center space-x-reverse space-x-2 bg-white text-orange-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-50 transition-colors shadow-lg"
            >
              <span>ابدأ الكسب</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;