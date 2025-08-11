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
      newErrors.amount = 'Amount is required';
    } else if (isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    } else if (amount > user?.balance) {
      newErrors.amount = 'Insufficient balance';
    } else if (settings && amount < settings.minimumWithdrawal) {
      newErrors.amount = `Minimum withdrawal amount is ${settings.minimumWithdrawal} IQD`;
    }

    // Account number validation
    if (!formData.accountNumber16) {
      newErrors.accountNumber16 = '16-digit account number is required';
    } else if (!/^\d{16}$/.test(formData.accountNumber16.replace(/\s/g, ''))) {
      newErrors.accountNumber16 = 'Must be exactly 16 digits';
    }

    if (!formData.accountNumber10) {
      newErrors.accountNumber10 = '10-digit account number is required';
    } else if (!/^\d{10}$/.test(formData.accountNumber10.replace(/\s/g, ''))) {
      newErrors.accountNumber10 = 'Must be exactly 10 digits';
    }

    // Account holder name validation
    if (!formData.accountHolderName.trim()) {
      newErrors.accountHolderName = 'Account holder name is required';
    } else if (formData.accountHolderName.trim().length < 2) {
      newErrors.accountHolderName = 'Name must be at least 2 characters';
    }

    // WhatsApp number validation
    if (!formData.whatsappNumber) {
      newErrors.whatsappNumber = 'WhatsApp number is required';
    } else if (!/^\d{10,15}$/.test(formData.whatsappNumber.replace(/\D/g, ''))) {
      newErrors.whatsappNumber = 'WhatsApp number must be 10-15 digits';
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

        toast.success('Withdrawal request submitted successfully!');

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
      const message = error.response?.data?.message || 'Failed to submit withdrawal request';
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
    return <LoadingSpinner text="Loading user data..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Withdraw Earnings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Request to withdraw your earned money to your bank account
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
                    Pending Withdrawal Request
                  </h3>
                  <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                    You have a withdrawal request of {pendingWithdrawal.amount.toLocaleString()} IQD pending approval.
                    Please wait 24 hours for processing.
                  </p>
                  <div className="text-sm text-yellow-600 dark:text-yellow-400">
                    <p><strong>Requested:</strong> {new Date(pendingWithdrawal.createdAt).toLocaleString()}</p>
                    <p><strong>Status:</strong> Under Review</p>
                  </div>
                  <Link
                    to="/withdrawal-history"
                    className="inline-block mt-4 text-yellow-700 dark:text-yellow-300 hover:text-yellow-600 dark:hover:text-yellow-400 font-medium"
                  >
                    View withdrawal history →
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
                    Withdrawal Amount (IQD) <span className="text-red-500">*</span>
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
                      placeholder="Enter amount"
                      className={`pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.amount ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.amount}</p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Available balance: {user.balance?.toLocaleString() || 0} IQD
                    {settings && (
                      <span className="ml-2">
                        (Minimum: {settings.minimumWithdrawal.toLocaleString()} IQD)
                      </span>
                    )}
                  </p>
                </div>

                {/* 16-digit Account Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    16-Digit Account Number <span className="text-red-500">*</span>
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
                    10-Digit Account Number <span className="text-red-500">*</span>
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
                    Account Holder Name <span className="text-red-500">*</span>
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
                      placeholder="Full name as on bank account"
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
                    WhatsApp Number <span className="text-red-500">*</span>
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
                    Used for withdrawal confirmation and updates
                  </p>
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  disabled={!user.balance || user.balance <= 0}
                  fullWidth
                  size="lg"
                >
                  Submit Withdrawal Request
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
                Available Balance
              </h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {user.balance?.toLocaleString() || 0} IQD
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Earned: {user.totalEarned?.toLocaleString() || 0} IQD
              </p>
            </div>
          </Card>

          {/* Withdrawal Info */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Withdrawal Information
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600 dark:text-gray-400">
                  {settings ? (
                    <>Minimum withdrawal: {settings.minimumWithdrawal.toLocaleString()} IQD</>
                  ) : (
                    'Loading minimum withdrawal amount...'
                  )}
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600 dark:text-gray-400">
                  Processing time: 24 hours
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600 dark:text-gray-400">
                  Bank details must be accurate to avoid delays
                </p>
              </div>
            </div>
          </Card>

          {/* Quick Links */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <div className="space-y-2">
              <Link
                to="/withdrawal-history"
                className="block w-full text-left px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                View Withdrawal History
              </Link>
              <Link
                to="/tasks"
                className="block w-full text-left px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                Earn More Money
              </Link>
              <Link
                to="/dashboard"
                className="block w-full text-left px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </Card>

          {/* Support */}
          {settings?.supportWhatsapp && (
            <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="text-center">
                <Phone className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Need Help?
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  Contact our support team on WhatsApp
                </p>
                <a
                  href={`https://wa.me/${settings.supportWhatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Phone className="w-4 h-4" />
                  <span>Contact Support</span>
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