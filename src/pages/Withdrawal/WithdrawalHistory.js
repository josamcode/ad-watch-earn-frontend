import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge, Button } from '../../components/UI/LoadingSpinner';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import {
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  ArrowLeft,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const WithdrawalHistory = () => {
  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchWithdrawals();
    fetchStats();
  }, [currentPage, filter]);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/withdrawals/history?page=${currentPage}&limit=10`);

      if (response.data.success) {
        setWithdrawals(response.data.withdrawals);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Fetch withdrawals error:', error);
      toast.error('فشل في تحميل سجل السحوبات');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/withdrawals/stats/summary');
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">⏳ معلق</Badge>;
      case 'approved':
        return <Badge variant="success">✅ معتمد</Badge>;
      case 'rejected':
        return <Badge variant="danger">❌ مرفوض</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\u200F/g, ''); // Remove RTL mark if present
  };

  const cancelWithdrawal = async (withdrawalId) => {
    if (!window.confirm('هل أنت متأكد أنك تريد إلغاء طلب السحب هذا؟')) {
      return;
    }

    try {
      const response = await axios.post(`/withdrawals/${withdrawalId}/cancel`);

      if (response.data.success) {
        toast.success('تم إلغاء السحب بنجاح');
        fetchWithdrawals();
        fetchStats();
      }
    } catch (error) {
      console.error('Cancel withdrawal error:', error);
      toast.error(error.response?.data?.message || 'فشل في إلغاء السحب');
    }
  };

  if (loading && withdrawals.length === 0) {
    return <LoadingSpinner text="جاري تحميل سجل السحوبات..." />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="block sm:flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            to="/withdrawal"
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              سجل السحوبات
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              تتبع جميع طلبات السحب وحالتها
            </p>
          </div>
        </div>

        <div className="flex items-center mt-2 sm:mt-0 sm:justify-normal justify-center space-x-3">
          <Button
            variant="outline"
            onClick={fetchWithdrawals}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>

          <Link to="/withdrawal">
            <Button>
              <DollarSign className="w-4 h-4 mr-2" />
              سحب جديد
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm font-medium">
                  الطلبات المعلقة
                </p>
                <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
                  {stats.pending.count}
                </p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  {stats.pending.totalAmount.toLocaleString()} دينار عراقي
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 dark:text-green-300 text-sm font-medium">
                  معتمد
                </p>
                <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                  {stats.approved.count}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {stats.approved.totalAmount.toLocaleString()} دينار عراقي
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-700 dark:text-red-300 text-sm font-medium">
                  مرفوض
                </p>
                <p className="text-2xl font-bold text-red-800 dark:text-red-200">
                  {stats.rejected.count}
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  {stats.rejected.totalAmount.toLocaleString()} دينار عراقي
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              تصفية حسب الحالة:
            </span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">جميع الطلبات</option>
              <option value="pending">معلق</option>
              <option value="approved">معتمد</option>
              <option value="rejected">مرفوض</option>
            </select>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            {pagination.total || 0} طلبًا إجمالي
          </div>
        </div>
      </Card>

      {/* Withdrawals List */}
      <div className="space-y-4">
        {withdrawals.map((withdrawal) => (
          <Card key={withdrawal._id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                  {getStatusIcon(withdrawal.status)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {withdrawal.amount.toLocaleString()} دينار عراقي
                    </h3>
                    {getStatusBadge(withdrawal.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>تم الطلب: {formatDate(withdrawal.createdAt)}</span>
                    </div>

                    {withdrawal.processedAt && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {withdrawal.status === 'approved' ? 'تمت الموافقة' : 'تمت المعالجة'}: {formatDate(withdrawal.processedAt)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <span>الحساب: ****{withdrawal.bankDetails?.accountNumber16?.slice(-4) || 'غير متاح'}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span>الاسم: {withdrawal.bankDetails?.accountHolderName || 'غير متاح'}</span>
                    </div>
                  </div>

                  {withdrawal.adminNotes && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>ملاحظات الإدارة:</strong> {withdrawal.adminNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="ml-4 flex flex-col space-y-2">
                {withdrawal.status === 'pending' && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => cancelWithdrawal(withdrawal._id)}
                  >
                    إلغاء
                  </Button>
                )}

                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    المعرف: {withdrawal._id.slice(-8)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {withdrawals.length === 0 && !loading && (
          <Card className="p-12 text-center">
            <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              لا توجد طلبات سحب
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              لم تقم بتقديم أي طلبات سحب حتى الآن.
            </p>
            <Link to="/withdrawal">
              <Button>
                <DollarSign className="w-4 h-4 mr-2" />
                قم بسحبك الأول
              </Button>
            </Link>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            السابق
          </Button>

          <div className="flex space-x-1">
            {[...Array(pagination.pages)].map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === pagination.pages}
          >
            التالي
          </Button>
        </div>
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <Card className="p-6">
            <LoadingSpinner size="lg" text="جاري التحديث..." />
          </Card>
        </div>
      )}
    </div>
  );
};

export default WithdrawalHistory;