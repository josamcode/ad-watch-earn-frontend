import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card, Button, Input } from '../../components/UI/LoadingSpinner';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import {
  DollarSign,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  Phone,
  User,
  Building
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Withdrawal = () => {
  const { user, deductBalance } = useAuth();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    accountNumber16: '',
    accountNumber10: '',
    accountHolderName: '',
    whatsappNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [pendingWithdrawal, setPendingWithdrawal] = useState(null);

  useEffect(() => {
    fetchSettings();
    checkPendingWithdrawal();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/auth/settings');
      if (response.data.success) {
        setSettings(response.data.settings);
      }
    } catch (error) {
      console.error('Fetch settings error:', error);
    }
  };

  const checkPendingWithdrawal = async () => {
    try {
      const response = await axios.get('/withdrawals/history?limit=1');
      if (response.data.success && response.data.withdrawals.length > 0) {
        const latestWithdrawal = response.data.withdrawals[0];
        if (latestWithdrawal.status === 'pending') {
          setPendingWithdrawal(latestWithdrawal);
        }
      }
    } catch (error) {
      console.error('Check pending withdrawal error:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Amount validation
    const amount = parseFloat(formData.amount);
    if (!formData.amount) {
      newErrors.amount = 'المبلغ مطلوب';
    } else if (isNaN(amount) || amount <= 0) {
      newErrors.amount = 'يجب أن يكون المبلغ رقمًا موجبًا';
    } else if (amount > user?.balance) {
      newErrors.amount = 'الرصيد غير كافٍ';
    } else if (settings && amount < settings.minimumWithdrawal) {
      newErrors.amount = `الحد الأدنى للسحب هو ${settings.minimumWithdrawal} دينار عراقي`;
    }

    // Account number validation
    if (!formData.accountNumber16) {
      newErrors.accountNumber16 = 'رقم الحساب المكون من 16 رقمًا مطلوب';
    } else if (!/^\d{16}$/.test(formData.accountNumber16.replace(/\s/g, ''))) {
      newErrors.accountNumber16 = 'يجب أن يكون مكونًا من 16 رقمًا بالضبط';
    }

    if (!formData.accountNumber10) {
      newErrors.accountNumber10 = 'رقم الحساب المكون من 10 أرقام مطلوب';
    } else if (!/^\d{10}$/.test(formData.accountNumber10.replace(/\s/g, ''))) {
      newErrors.accountNumber10 = 'يجب أن يكون مكونًا من 10 أرقام بالضبط';
    }

    // Account holder name validation
    if (!formData.accountHolderName.trim()) {
      newErrors.accountHolderName = 'اسم صاحب الحساب مطلوب';
    } else if (formData.accountHolderName.trim().length < 2) {
      newErrors.accountHolderName = 'يجب أن يكون الاسم مكونًا من حرفين على الأقل';
    }

    // WhatsApp number validation
    if (!formData.whatsappNumber) {
      newErrors.whatsappNumber = 'رقم واتساب مطلوب';
    } else if (!/^\d{10,15}$/.test(formData.whatsappNumber.replace(/\D/g, ''))) {
      newErrors.whatsappNumber = 'يجب أن يتكون رقم واتساب من 10 إلى 15 رقمًا';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post('/withdrawals/request', {
        amount: parseFloat(formData.amount),
        bankDetails: {
          accountNumber16: formData.accountNumber16.replace(/\s/g, ''),
          accountNumber10: formData.accountNumber10.replace(/\s/g, ''),
          accountHolderName: formData.accountHolderName.trim(),
          whatsappNumber: formData.whatsappNumber.replace(/\D/g, '')
        }
      });

      if (response.data.success) {
        // Update local balance
        deductBalance(parseFloat(formData.amount));
        setPendingWithdrawal(response.data.withdrawal);

        toast.success('تم تقديم طلب السحب بنجاح!');

        // Reset form
        setFormData({
          amount: '',
          accountNumber16: '',
          accountNumber10: '',
          accountHolderName: '',
          whatsappNumber: ''
        });
      }
    } catch (error) {
      const message = error.response?.data?.message || 'فشل في تقديم طلب السحب';
      toast.error(message);
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  const formatAccountNumber = (value, maxLength) => {
    const numbers = value.replace(/\D/g, '');
    const limited = numbers.slice(0, maxLength);
    return limited.replace(/(\d{4})/g, '$1 ').trim();
  };

  const handleAccountNumberChange = (e, fieldName, maxLength) => {
    const formatted = formatAccountNumber(e.target.value, maxLength);
    setFormData(prev => ({ ...prev, [fieldName]: formatted }));

    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  if (!user) {
    return <LoadingSpinner text="جاري تحميل بيانات المستخدم..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          سحب الأرباح
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          اطلب سحب أرباحك إلى حسابك البنكي
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Withdrawal Form */}
        <div className="lg:col-span-2">
          {pendingWithdrawal ? (
            <Card className="p-6 mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start space-x-3">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    طلب سحب معلق
                  </h3>
                  <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                    لديك طلب سحب بقيمة {pendingWithdrawal.amount.toLocaleString()} دينار عراقي قيد الانتظار للموافقة.
                    يرجى الانتظار 24 ساعة للمعالجة.
                  </p>
                  <div className="text-sm text-yellow-600 dark:text-yellow-400">
                    <p><strong>تم الطلب:</strong> {new Date(pendingWithdrawal.createdAt).toLocaleString()}</p>
                    <p><strong>الحالة:</strong> قيد المراجعة</p>
                  </div>
                  <Link
                    to="/withdrawal-history"
                    className="inline-block mt-4 text-yellow-700 dark:text-yellow-300 hover:text-yellow-600 dark:hover:text-yellow-400 font-medium"
                  >
                    عرض سجل السحوبات →
                  </Link>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.general && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
                  </div>
                )}

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    مبلغ السحب (دينار عراقي) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="أدخل المبلغ"
                      className={`pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.amount ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.amount}</p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    الرصيد المتاح: {user.balance?.toLocaleString() || 0} دينار عراقي
                    {settings && (
                      <span className="ml-2">
                        (الحد الأدنى: {settings.minimumWithdrawal.toLocaleString()} دينار عراقي)
                      </span>
                    )}
                  </p>
                </div>

                {/* 16-digit Account Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    رقم الحساب المكون من 16 رقمًا <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="accountNumber16"
                      value={formData.accountNumber16}
                      onChange={(e) => handleAccountNumberChange(e, 'accountNumber16', 16)}
                      placeholder="1234 5678 9012 3456"
                      className={`pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.accountNumber16 ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.accountNumber16 && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.accountNumber16}</p>
                  )}
                </div>

                {/* 10-digit Account Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    رقم الحساب المكون من 10 أرقام <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="accountNumber10"
                      value={formData.accountNumber10}
                      onChange={(e) => handleAccountNumberChange(e, 'accountNumber10', 10)}
                      placeholder="1234 5678 90"
                      className={`pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.accountNumber10 ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.accountNumber10 && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.accountNumber10}</p>
                  )}
                </div>

                {/* Account Holder Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    اسم صاحب الحساب <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="accountHolderName"
                      value={formData.accountHolderName}
                      onChange={handleChange}
                      placeholder="الاسم الكامل كما في الحساب البنكي"
                      className={`pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.accountHolderName ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.accountHolderName && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.accountHolderName}</p>
                  )}
                </div>

                {/* WhatsApp Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    رقم واتساب <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      +964
                    </span>
                    <input
                      type="tel"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleChange}
                      placeholder="7501234567"
                      className={`flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.whatsappNumber ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.whatsappNumber && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.whatsappNumber}</p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    تُستخدم للتأكيد والتحديثات الخاصة بالسحب
                  </p>
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  disabled={!user.balance || user.balance <= 0}
                  fullWidth
                  size="lg"
                >
                  تقديم طلب السحب
                </Button>
              </form>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Balance Summary */}
          <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                الرصيد المتاح
              </h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {user.balance?.toLocaleString() || 0} دينار عراقي
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                الإجمالي المكتسب: {user.totalEarned?.toLocaleString() || 0} دينار عراقي
              </p>
            </div>
          </Card>

          {/* Withdrawal Info */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              معلومات السحب
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600 dark:text-gray-400">
                  {settings ? (
                    <>الحد الأدنى للسحب: {settings.minimumWithdrawal.toLocaleString()} دينار عراقي</>
                  ) : (
                    'جاري تحميل الحد الأدنى للسحب...'
                  )}
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600 dark:text-gray-400">
                  وقت المعالجة: 24 ساعة
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600 dark:text-gray-400">
                  يجب أن تكون تفاصيل البنك دقيقة لتجنب التأخير
                </p>
              </div>
            </div>
          </Card>

          {/* Quick Links */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              روابط سريعة
            </h3>
            <div className="space-y-2">
              <Link
                to="/withdrawal-history"
                className="block w-full text-left px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                عرض سجل السحوبات
              </Link>
              <Link
                to="/tasks"
                className="block w-full text-left px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                اكسب المزيد من المال
              </Link>
              <Link
                to="/dashboard"
                className="block w-full text-left px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                العودة إلى لوحة التحكم
              </Link>
            </div>
          </Card>

          {/* Support */}
          {settings?.supportWhatsapp && (
            <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="text-center">
                <Phone className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  تحتاج مساعدة؟
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  اتصل بفريق الدعم لدينا عبر واتساب
                </p>
                <a
                  href={`https://wa.me/${settings.supportWhatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Phone className="w-4 h-4" />
                  <span>اتصل بالدعم</span>
                </a>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Withdrawal;