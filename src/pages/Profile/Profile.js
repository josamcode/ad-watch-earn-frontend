import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card, Button, Input } from '../../components/UI/LoadingSpinner';
import {
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Video,
  Settings,
  Shield,
  Edit3,
  Save,
  X,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const response = await axios.put('/users/profile', formData);

      if (response.data.success) {
        updateUser(response.data.user);
        setIsEditing(false);
        toast.success('تم تحديث الملف الشخصي بنجاح!');
      } else {
        toast.error(response.data.message || 'فشل في تحديث الملف الشخصي');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      const message = error.response?.data?.message || 'فشل في تحديث الملف الشخصي';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || ''
    });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTaskProgressPercentage = () => {
    if (!user?.taskProgress) return 0;
    const completedTasks = Object.values(user.taskProgress).filter(task => task.completed).length;
    return (completedTasks / 3) * 100; // 3 total tasks
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          الملف الشخصي
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          إدارة معلومات حسابك وعرض الإحصائيات الخاصة بك
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                المعلومات الشخصية
              </h2>
              {!isEditing ? (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  تعديل الملف الشخصي
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    <X className="w-4 h-4 mr-2" />
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleSave}
                    loading={loading}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    حفظ
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Profile Picture Placeholder */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {user?.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    عضو منذ {user?.createdAt ? formatDate(user.createdAt) : 'غير معروف'}
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    label="الاسم الكامل"
                    name="name"
                    value={isEditing ? formData.name : user?.name || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                {/* <div>
                  <Input
                    label="اسم المستخدم"
                    value={user?.username || ''}
                    disabled
                    className="bg-gray-50 dark:bg-gray-700"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    لا يمكن تغيير اسم المستخدم
                  </p>
                </div> */}

                {/* <div>
                  <Input
                    label="عنوان البريد الإلكتروني"
                    name="email"
                    type="email"
                    value={isEditing ? formData.email : user?.email || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div> */}

                {/* <div>
                  <Input
                    label="رقم الهاتف"
                    name="phoneNumber"
                    value={isEditing ? formData.phoneNumber : user?.phoneNumber || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div> */}

                {/* <div>
                  <Input
                    label="نوع الحساب"
                    value={user?.userType === 'admin' ? 'مشرف' : 'مستخدم عادي'}
                    disabled
                    className="bg-gray-50 dark:bg-gray-700"
                  />
                </div> */}

                <div>
                  <Input
                    label="آخر تسجيل دخول"
                    value={user?.lastLogin ? formatDate(user.lastLogin) : 'غير معروف'}
                    disabled
                    className="bg-gray-50 dark:bg-gray-700"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Account Statistics */}
          <Card className="p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              إحصائيات الحساب
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm text-green-700 dark:text-green-300">إجمالي الأرباح</p>
                    <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                      {user?.totalEarned?.toLocaleString() || 0} دينار عراقي
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">الرصيد الحالي</p>
                    <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                      {user?.balance?.toLocaleString() || 0} دينار عراقي
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Video className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  <div>
                    <p className="text-sm text-purple-700 dark:text-purple-300">الفيديوهات المشاهدة</p>
                    <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                      {user?.videoViews?.length || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Settings className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                  <div>
                    <p className="text-sm text-orange-700 dark:text-orange-300">تقدم المهام</p>
                    <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                      {getTaskProgressPercentage().toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              إجراءات سريعة
            </h3>
            <div className="space-y-3">
              <Link
                to="/tasks"
                className="w-full flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-700 dark:text-blue-300 font-medium">مشاهدة الفيديوهات</span>
              </Link>

              <Link
                to="/withdrawal"
                className="w-full flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-green-700 dark:text-green-300 font-medium">سحب الأموال</span>
              </Link>

              <Link
                to="/withdrawal-history"
                className="w-full flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-purple-700 dark:text-purple-300 font-medium">عرض السجل</span>
              </Link>
            </div>
          </Card>

          {/* Account Security */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                أمان الحساب
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-sm text-green-700 dark:text-green-300">
                  حالة الحساب
                </span>
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  {user?.isActive ? 'مفعل' : 'غير مفعل'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  البريد الإلكتروني موثق
                </span>
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  نعم
                </span>
              </div>
            </div>
          </Card>

          {/* Task Progress */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              تقدم المهام
            </h3>
            <div className="space-y-3">
              {[1, 2, 3].map((taskNum) => {
                const task = user?.taskProgress?.[`task${taskNum}`];
                const isCompleted = task?.completed;
                const isUnlocked = task?.unlockedAt !== null;

                return (
                  <div key={taskNum} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      المهمة {taskNum}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${isCompleted
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : isUnlocked
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                        : 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                      }`}>
                      {isCompleted ? 'مكتملة' : isUnlocked ? 'متاحة' : 'مقفلة'}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Notifications Page Component
export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [markingRead, setMarkingRead] = useState(false);

  React.useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: 1,
        limit: 50,
        type: filter
      });

      const response = await axios.get(`/users/notifications?${params}`);

      if (response.data.success) {
        setNotifications(response.data.notifications);
      } else {
        toast.error('فشل في تحميل الإشعارات');
      }
    } catch (error) {
      console.error('Fetch notifications error:', error);
      toast.error('فشل في تحميل الإشعارات');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await axios.put(`/users/notifications/${notificationId}/read`);

      if (response.data.success) {
        setNotifications(prev =>
          prev.map(n =>
            n._id === notificationId ? { ...n, read: true } : n
          )
        );
        toast.success('تم التأشير كمقروء');
      }
    } catch (error) {
      console.error('Mark as read error:', error);
      toast.error('فشل في التأشير كمقروء');
    }
  };

  const markAllAsRead = async () => {
    try {
      setMarkingRead(true);
      const response = await axios.put('/users/notifications/mark-all-read');

      if (response.data.success) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, read: true }))
        );
        toast.success('تم تأشير جميع الإشعارات كمقروءة');
      }
    } catch (error) {
      console.error('Mark all as read error:', error);
      toast.error('فشل في تأشير جميع الإشعارات كمقروءة');
    } finally {
      setMarkingRead(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'withdrawal':
        return <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'task':
        return <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'earning':
        return <DollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case 'general':
        return <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
      default:
        return <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - notificationDate) / 1000);

    if (diffInSeconds < 60) {
      return 'الآن';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} دقيقة${minutes > 1 ? 'ات' : ''} مضت`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ساعة${hours > 1 ? 'ات' : ''} مضت`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} يوم${days > 1 ? 'ات' : ''} مضت`;
    } else {
      return formatDate(dateString);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            الإشعارات
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            كن على اطلاع دائم بنشاط حسابك
          </p>
        </div>

        <Button
          variant="outline"
          onClick={markAllAsRead}
          disabled={notifications.every(n => n.read) || markingRead}
          loading={markingRead}
        >
          تأشير الكل كمقروء
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <span className="mb-2 sm:mb-0 text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
            تصفية:
          </span>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:space-x-2 sm:grid-cols-auto w-full max-w-md">
            {['all', 'withdrawal', 'task', 'earning', 'general'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`w-full sm:w-auto px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors duration-200
            ${filter === type
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
          `}
                aria-pressed={filter === type}
              >
                {type === 'all' ? 'الكل' :
                  type === 'withdrawal' ? 'سحب' :
                    type === 'task' ? 'مهمة' :
                      type === 'earning' ? 'أرباح' : 'عام'}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Refresh Button */}
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={fetchNotifications}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          تحديث
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <Card
              key={notification._id}
              className={`p-6 cursor-pointer transition-all hover:shadow-md ${notification.read
                ? 'bg-white dark:bg-gray-800'
                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                }`}
              onClick={() => !notification.read && markAsRead(notification._id)}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-full ${notification.read
                  ? 'bg-gray-100 dark:bg-gray-700'
                  : 'bg-blue-100 dark:bg-blue-900'
                  }`}>
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold ${notification.read
                      ? 'text-gray-900 dark:text-white'
                      : 'text-blue-900 dark:text-blue-100'
                      }`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {getTimeAgo(notification.createdAt)}
                      </span>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                  </div>

                  <p className={`text-sm ${notification.read
                    ? 'text-gray-600 dark:text-gray-400'
                    : 'text-blue-700 dark:text-blue-300'
                    } mb-2`}>
                    {notification.message}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${notification.type === 'withdrawal' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      notification.type === 'task' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                        notification.type === 'earning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                      {notification.type === 'withdrawal' ? 'سحب' :
                        notification.type === 'task' ? 'مهمة' :
                          notification.type === 'earning' ? 'أرباح' : 'عام'}
                    </span>

                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              لا توجد إشعارات
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              أنت محدث بالكامل! ستظهر الإشعارات الجديدة هنا.
            </p>
            <Button
              variant="outline"
              onClick={fetchNotifications}
              disabled={loading}
            >
              تحقق مرة أخرى
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;