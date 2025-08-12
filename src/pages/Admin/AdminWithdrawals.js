import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Modal, Input } from '../../components/UI/LoadingSpinner';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import {
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  RefreshCw,
  Eye,
  User,
  Calendar,
  Phone,
  Building,
  CreditCard
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminWithdrawals = () => {
  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [processAction, setProcessAction] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchWithdrawals();
  }, [currentPage, statusFilter]);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        status: statusFilter
      });

      const response = await axios.get(`/admin/withdrawals?${params}`);

      if (response.data.success) {
        setWithdrawals(response.data.withdrawals);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Fetch withdrawals error:', error);
      toast.error('فشل تحميل طلبات السحب');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowDetailsModal(true);
  };

  const handleProcessWithdrawal = (withdrawal, action) => {
    setSelectedWithdrawal(withdrawal);
    setProcessAction(action);
    setAdminNotes('');
    setShowProcessModal(true);
  };

  const submitProcessWithdrawal = async () => {
    try {
      const response = await axios.post(`/admin/withdrawals/${selectedWithdrawal._id}/process`, {
        action: processAction,
        adminNotes
      });

      if (response.data.success) {
        toast.success(`تم ${processAction === 'approve' ? 'اعتماد' : 'رفض'} الطلب بنجاح`);
        setShowProcessModal(false);
        fetchWithdrawals();
      }
    } catch (error) {
      console.error('Process withdrawal error:', error);
      toast.error(error.response?.data?.message || 'فشل في معالجة طلب السحب');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">⏳ بانتظار المراجعة</Badge>;
      case 'approved':
        return <Badge variant="success">✅ معتمد</Badge>;
      case 'rejected':
        return <Badge variant="danger">❌ مرفوض</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAccountNumber = (number) => {
    return number ? `****${number.slice(-4)}` : 'غير متوفر';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            إدارة طلبات السحب
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            راجع وعالج طلبات سحب المستخدمين
          </p>
        </div>

        <Button
          variant="outline"
          onClick={fetchWithdrawals}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
          تحديث
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-reverse space-x-4">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              التصفية حسب الحالة:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">جميع الطلبات</option>
              <option value="pending">بانتظار المراجعة</option>
              <option value="approved">معتمدة</option>
              <option value="rejected">مرفوضة</option>
            </select>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            {pagination.total || 0} طلبًا إجمالي
          </div>
        </div>
      </Card>

      {/* Withdrawals Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8">
            <LoadingSpinner text="جاري تحميل طلبات السحب..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    المستخدم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    المبلغ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    تفاصيل الحساب
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    التاريخ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="mr-4 text-right">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {withdrawal.user?.name || 'غير معروف'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {withdrawal.user?.email || 'غير متوفر'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {withdrawal.amount.toLocaleString()} د.ع
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white text-right">
                        <div className="flex items-center space-x-reverse space-x-1 mb-1">
                          <CreditCard className="w-3 h-3 text-gray-400" />
                          <span>{formatAccountNumber(withdrawal.bankDetails?.accountNumber16)}</span>
                        </div>
                        <div className="flex items-center space-x-reverse space-x-1">
                          <User className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-500 dark:text-gray-400">
                            {withdrawal.bankDetails?.accountHolderName || 'غير متوفر'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(withdrawal.status)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                      <div>{formatDate(withdrawal.createdAt)}</div>
                      {withdrawal.processedAt && (
                        <div className="text-xs">
                          تمت المعالجة: {formatDate(withdrawal.processedAt)}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                      <div className="flex items-center space-x-reverse space-x-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(withdrawal)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          عرض
                        </Button>

                        {withdrawal.status === 'pending' && (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleProcessWithdrawal(withdrawal, 'approve')}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              اعتماد
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleProcessWithdrawal(withdrawal, 'reject')}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              رفض
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {withdrawals.length === 0 && (
              <div className="py-12 text-center">
                <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  لا توجد طلبات سحب
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  لا توجد طلبات سحب مطابقة للتصفية الحالية.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  السابق
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                >
                  التالي
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    عرض من <span className="font-medium">{((currentPage - 1) * 20) + 1}</span> إلى{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * 20, pagination.total)}
                    </span>{' '}
                    من أصل <span className="font-medium">{pagination.total}</span> نتيجة
                  </p>
                </div>
                <div className="flex space-x-reverse space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    السابق
                  </Button>

                  {[...Array(pagination.pages)].map((_, index) => {
                    const page = index + 1;
                    if (page === 1 || page === pagination.pages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 rounded-md text-sm font-medium ${page === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                            }`}
                        >
                          {page}
                        </button>
                      );
                    }
                    return null;
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === pagination.pages}
                  >
                    التالي
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Withdrawal Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="تفاصيل طلب السحب"
        size="lg"
      >
        {selectedWithdrawal && (
          <div className="space-y-6 text-right">
            {/* User Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                معلومات المستخدم
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">الاسم</label>
                  <p className="text-gray-900 dark:text-white">{selectedWithdrawal.user?.name || 'غير متوفر'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">البريد الإلكتروني</label>
                  <p className="text-gray-900 dark:text-white">{selectedWithdrawal.user?.email || 'غير متوفر'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">رقم الهاتف</label>
                  <p className="text-gray-900 dark:text-white">{selectedWithdrawal.user?.phoneNumber || 'غير متوفر'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">اسم المستخدم</label>
                  <p className="text-gray-900 dark:text-white">{selectedWithdrawal.user?.username || 'غير متوفر'}</p>
                </div>
              </div>
            </div>

            {/* Withdrawal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                معلومات السحب
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">المبلغ</label>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {selectedWithdrawal.amount.toLocaleString()} د.ع
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">الحالة</label>
                  <div className="mt-1">{getStatusBadge(selectedWithdrawal.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">تاريخ الطلب</label>
                  <p className="text-gray-900 dark:text-white">{formatDate(selectedWithdrawal.createdAt)}</p>
                </div>
                {selectedWithdrawal.processedAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">تاريخ المعالجة</label>
                    <p className="text-gray-900 dark:text-white">{formatDate(selectedWithdrawal.processedAt)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bank Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                تفاصيل الحساب البنكي
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">اسم صاحب الحساب</label>
                  <p className="text-gray-900 dark:text-white">{selectedWithdrawal.bankDetails?.accountHolderName || 'غير متوفر'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">رقم الحساب (16 رقمًا)</label>
                  <p className="text-gray-900 dark:text-white font-mono">
                    {selectedWithdrawal.bankDetails?.accountNumber16 || 'غير متوفر'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">رقم الحساب (10 أرقام)</label>
                  <p className="text-gray-900 dark:text-white font-mono">
                    {selectedWithdrawal.bankDetails?.accountNumber10 || 'غير متوفر'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">رقم واتساب</label>
                  <p className="text-gray-900 dark:text-white">
                    +964{selectedWithdrawal.bankDetails?.whatsappNumber || 'غير متوفر'}
                  </p>
                </div>
              </div>
            </div>

            {/* Admin Notes */}
            {selectedWithdrawal.adminNotes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  ملاحظات المشرف
                </h3>
                <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  {selectedWithdrawal.adminNotes}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6">
          <Button
            variant="outline"
            onClick={() => setShowDetailsModal(false)}
            fullWidth
          >
            إغلاق
          </Button>
        </div>
      </Modal>

      {/* Process Withdrawal Modal */}
      <Modal
        isOpen={showProcessModal}
        onClose={() => setShowProcessModal(false)}
        title={`${processAction === 'approve' ? 'اعتماد' : 'رفض'} طلب السحب`}
        size="lg"
      >
        {selectedWithdrawal && (
          <div className="space-y-4 text-right">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                ملخص الطلب
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">المستخدم:</span>
                  <span className="mr-2 text-gray-900 dark:text-white">{selectedWithdrawal.user?.name}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">المبلغ:</span>
                  <span className="mr-2 text-gray-900 dark:text-white font-bold">
                    {selectedWithdrawal.amount.toLocaleString()} د.ع
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">الحساب:</span>
                  <span className="mr-2 text-gray-900 dark:text-white">
                    {formatAccountNumber(selectedWithdrawal.bankDetails?.accountNumber16)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">الاسم:</span>
                  <span className="mr-2 text-gray-900 dark:text-white">
                    {selectedWithdrawal.bankDetails?.accountHolderName}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ملاحظات المشرف {processAction === 'reject' && <span className="text-red-500">*</span>}
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder={
                  processAction === 'approve'
                    ? 'ملاحظات اختيارية...'
                    : 'مطلوب: سبب الرفض...'
                }
              />
            </div>

            <div className="flex space-x-reverse space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowProcessModal(false)}
                fullWidth
              >
                إلغاء
              </Button>
              <Button
                variant={processAction === 'approve' ? 'success' : 'danger'}
                onClick={submitProcessWithdrawal}
                disabled={processAction === 'reject' && !adminNotes.trim()}
                fullWidth
              >
                {processAction === 'approve' ? 'اعتماد السحب' : 'رفض السحب'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// Admin Settings Component
export const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    minimumWithdrawal: 10000,
    maxDailyWithdrawals: 3,
    platformCommission: 0,
    maintenanceMode: false,
    welcomeMessage: 'مرحبًا بك في منصتنا لكسب المال من المشاهدات!',
    supportWhatsapp: '+964XXXXXXXXX'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/settings');

      if (response.data.success) {
        setSettings(response.data.settings);
      }
    } catch (error) {
      console.error('Fetch settings error:', error);
      toast.error('فشل تحميل الإعدادات');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await axios.put('/admin/settings', settings);

      if (response.data.success) {
        toast.success('تم تحديث الإعدادات بنجاح');
      }
    } catch (error) {
      console.error('Update settings error:', error);
      toast.error('فشل في تحديث الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="جاري تحميل الإعدادات..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          إعدادات النظام
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          قم بتكوين إعدادات النظام العامة وسياساته
        </p>
      </div>

      <div className="space-y-6">
        {/* Withdrawal Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            إعدادات السحب
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="الحد الأدنى للسحب (د.ع)"
              name="minimumWithdrawal"
              type="number"
              value={settings.minimumWithdrawal}
              onChange={handleChange}
              min="0"
            />

            <Input
              label="الحد الأقصى للسحب اليومي للمستخدم"
              name="maxDailyWithdrawals"
              type="number"
              value={settings.maxDailyWithdrawals}
              onChange={handleChange}
              min="1"
            />

            <Input
              label="عمولة النظام (%)"
              name="platformCommission"
              type="number"
              value={settings.platformCommission}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.1"
            />
          </div>
        </Card>

        {/* Platform Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            إعدادات النظام
          </h2>

          <div className="space-y-6">
            <div className="flex items-center space-x-reverse space-x-3">
              <input
                type="checkbox"
                id="maintenanceMode"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <label htmlFor="maintenanceMode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  وضع الصيانة
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  فعّل هذا الخيار لمنع تسجيلات المستخدمين الجدد والمعاملات
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                رسالة الترحيب
              </label>
              <textarea
                name="welcomeMessage"
                value={settings.welcomeMessage}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="أدخل رسالة ترحيب للمستخدمين الجدد..."
              />
            </div>

            <Input
              label="رقم دعم الواتساب"
              name="supportWhatsapp"
              value={settings.supportWhatsapp}
              onChange={handleChange}
              placeholder="+964XXXXXXXXX"
            />
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-reverse space-x-3">
          <Button
            variant="outline"
            onClick={fetchSettings}
            disabled={saving}
          >
            إعادة التعيين
          </Button>

          <Button
            onClick={handleSave}
            loading={saving}
          >
            حفظ الإعدادات
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminWithdrawals;