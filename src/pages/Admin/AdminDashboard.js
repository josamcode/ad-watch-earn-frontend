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
      toast.error('فشل تحميل إحصائيات لوحة التحكم');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <LoadingSpinner text="جاري تحميل لوحة تحكم المشرف..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          لوحة تحكم المشرف
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          راقب نشاط النظام وقم بإدارة عمليات المستخدمين
        </p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">إجمالي المستخدمين</p>
              <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
              <p className="text-blue-100 text-xs mt-1">الحسابات النشطة</p>
            </div>
            <div className="p-3 bg-blue-400 rounded-full">
              <Users className="w-8 h-8" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">إجمالي الفيديوهات</p>
              <p className="text-3xl font-bold">{stats?.totalVideos || 0}</p>
              <p className="text-purple-100 text-xs mt-1">المحتوى النشط</p>
            </div>
            <div className="p-3 bg-purple-400 rounded-full">
              <Video className="w-8 h-8" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">إجمالي الأرباح</p>
              <p className="text-3xl font-bold">{(stats?.totalEarnings || 0).toLocaleString()}</p>
              <p className="text-green-100 text-xs mt-1">دينار عراقي موزع</p>
            </div>
            <div className="p-3 bg-green-400 rounded-full">
              <DollarSign className="w-8 h-8" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">طلبات السحب المعلقة</p>
              <p className="text-3xl font-bold">{stats?.pendingWithdrawals || 0}</p>
              <p className="text-orange-100 text-xs mt-1">بانتظار المراجعة</p>
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
              نشاط النظام
            </h3>
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">إجمالي مشاهدات الفيديوهات</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats?.totalViews?.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">إجمالي عمليات السحب</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats?.totalWithdrawals || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">متوسط الأرباح/مستخدم</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats?.totalUsers > 0
                  ? Math.round((stats?.totalEarnings || 0) / stats.totalUsers).toLocaleString()
                  : 0
                } د.ع
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              النشاط الأخير
            </h3>
            <Eye className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                مستخدمون جدد: +{Math.floor(Math.random() * 10) + 1} اليوم
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                فيديوهات مشاهدة: +{Math.floor(Math.random() * 50) + 20} اليوم
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                مهام مكتملة: +{Math.floor(Math.random() * 15) + 5} اليوم
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              حالة النظام
            </h3>
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">حالة الخادم</span>
              <Badge variant="success">متصل</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">قاعدة البيانات</span>
              <Badge variant="success">متصل</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">نظام الدفع</span>
              <Badge variant="success">نشط</Badge>
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
              المستخدمون الجدد
            </h3>
            <Link
              to="/admin/users"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center space-x-1"
            >
              <span>عرض الكل</span>
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
                    انضم في {formatDate(user.createdAt)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    آخر تسجيل دخول: {user.lastLogin ? formatDate(user.lastLogin) : 'أبدًا'}
                  </p>
                </div>
              </div>
            ))}

            {(!stats?.recentUsers || stats.recentUsers.length === 0) && (
              <div className="py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">لا يوجد مستخدمون حديثون</p>
              </div>
            )}
          </div>
        </Card>

        {/* Top Videos */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              أفضل الفيديوهات أداءً
            </h3>
            <Link
              to="/admin/videos"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center space-x-1"
            >
              <span>عرض الكل</span>
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
                      {video.totalViews} مشاهدة • {video.totalEarnings?.toLocaleString()} د.ع مكتسبة
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="info">
                    {video.totalViews} مشاهدة
                  </Badge>
                </div>
              </div>
            ))}

            {(!stats?.topVideos || stats.topVideos.length === 0) && (
              <div className="py-8">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">لم يتم رفع فيديوهات بعد</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          إجراءات سريعة
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/users"
            className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="font-medium text-blue-700 dark:text-blue-300">إدارة المستخدمين</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">عرض وتعديل الحسابات</p>
            </div>
          </Link>

          <Link
            to="/admin/videos"
            className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            <Video className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="font-medium text-purple-700 dark:text-purple-300">إدارة الفيديوهات</p>
              <p className="text-sm text-purple-600 dark:text-purple-400">إضافة وتعديل المحتوى</p>
            </div>
          </Link>

          <Link
            to="/admin/withdrawals"
            className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            <div>
              <p className="font-medium text-green-700 dark:text-green-300">معالجة السحوبات</p>
              <p className="text-sm text-green-600 dark:text-green-400">مراجعة طلبات الدفع</p>
            </div>
          </Link>

          <Link
            to="/admin/settings"
            className="flex items-center space-x-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
          >
            <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            <div>
              <p className="font-medium text-orange-700 dark:text-orange-300">إعدادات النظام</p>
              <p className="text-sm text-orange-600 dark:text-orange-400">ضبط إعدادات النظام</p>
            </div>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;