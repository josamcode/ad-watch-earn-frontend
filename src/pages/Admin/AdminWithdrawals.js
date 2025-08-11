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
      toast.error('Failed to load withdrawals');
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
        toast.success(`Withdrawal ${processAction}d successfully`);
        setShowProcessModal(false);
        fetchWithdrawals();
      }
    } catch (error) {
      console.error('Process withdrawal error:', error);
      toast.error(error.response?.data?.message || 'Failed to process withdrawal');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">⏳ Pending</Badge>;
      case 'approved':
        return <Badge variant="success">✅ Approved</Badge>;
      case 'rejected':
        return <Badge variant="danger">❌ Rejected</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
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

  const formatAccountNumber = (number) => {
    return number ? `****${number.slice(-4)}` : 'N/A';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Withdrawal Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review and process user withdrawal requests
          </p>
        </div>

        <Button
          variant="outline"
          onClick={fetchWithdrawals}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            {pagination.total || 0} total requests
          </div>
        </div>
      </Card>

      {/* Withdrawals Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8">
            <LoadingSpinner text="Loading withdrawals..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Bank Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
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
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {withdrawal.user?.name || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {withdrawal.user?.email || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {withdrawal.amount.toLocaleString()} IQD
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center space-x-1 mb-1">
                          <CreditCard className="w-3 h-3 text-gray-400" />
                          <span>{formatAccountNumber(withdrawal.bankDetails?.accountNumber16)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-500 dark:text-gray-400">
                            {withdrawal.bankDetails?.accountHolderName || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(withdrawal.status)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div>{formatDate(withdrawal.createdAt)}</div>
                      {withdrawal.processedAt && (
                        <div className="text-xs">
                          Processed: {formatDate(withdrawal.processedAt)}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(withdrawal)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>

                        {withdrawal.status === 'pending' && (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleProcessWithdrawal(withdrawal, 'approve')}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleProcessWithdrawal(withdrawal, 'reject')}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Reject
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
              <div className="py-12">
                <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Withdrawal Requests
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  No withdrawal requests match your current filters.
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
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing <span className="font-medium">{((currentPage - 1) * 20) + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * 20, pagination.total)}
                    </span>{' '}
                    of <span className="font-medium">{pagination.total}</span> results
                  </p>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  {[...Array(pagination.pages)].map((_, index) => {
                    const page = index + 1;
                    if (page === 1 || page === pagination.pages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 text-sm rounded-md ${page === currentPage
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
                    Next
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
        title="Withdrawal Details"
        size="lg"
      >
        {selectedWithdrawal && (
          <div className="space-y-6">
            {/* User Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                User Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Name</label>
                  <p className="text-gray-900 dark:text-white">{selectedWithdrawal.user?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                  <p className="text-gray-900 dark:text-white">{selectedWithdrawal.user?.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone</label>
                  <p className="text-gray-900 dark:text-white">{selectedWithdrawal.user?.phoneNumber || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Username</label>
                  <p className="text-gray-900 dark:text-white">{selectedWithdrawal.user?.username || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Withdrawal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Withdrawal Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Amount</label>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {selectedWithdrawal.amount.toLocaleString()} IQD
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedWithdrawal.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Requested Date</label>
                  <p className="text-gray-900 dark:text-white">{formatDate(selectedWithdrawal.createdAt)}</p>
                </div>
                {selectedWithdrawal.processedAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Processed Date</label>
                    <p className="text-gray-900 dark:text-white">{formatDate(selectedWithdrawal.processedAt)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bank Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Bank Details
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Account Holder Name</label>
                  <p className="text-gray-900 dark:text-white">{selectedWithdrawal.bankDetails?.accountHolderName || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">16-Digit Account Number</label>
                  <p className="text-gray-900 dark:text-white font-mono">
                    {selectedWithdrawal.bankDetails?.accountNumber16 || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">10-Digit Account Number</label>
                  <p className="text-gray-900 dark:text-white font-mono">
                    {selectedWithdrawal.bankDetails?.accountNumber10 || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">WhatsApp Number</label>
                  <p className="text-gray-900 dark:text-white">
                    +964{selectedWithdrawal.bankDetails?.whatsappNumber || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Admin Notes */}
            {selectedWithdrawal.adminNotes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Admin Notes
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
            Close
          </Button>
        </div>
      </Modal>

      {/* Process Withdrawal Modal */}
      <Modal
        isOpen={showProcessModal}
        onClose={() => setShowProcessModal(false)}
        title={`${processAction === 'approve' ? 'Approve' : 'Reject'} Withdrawal`}
        size="lg"
      >
        {selectedWithdrawal && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Withdrawal Summary
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">User:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{selectedWithdrawal.user?.name}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="ml-2 text-gray-900 dark:text-white font-bold">
                    {selectedWithdrawal.amount.toLocaleString()} IQD
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Account:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {formatAccountNumber(selectedWithdrawal.bankDetails?.accountNumber16)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Name:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {selectedWithdrawal.bankDetails?.accountHolderName}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Admin Notes {processAction === 'reject' && <span className="text-red-500">*</span>}
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder={
                  processAction === 'approve'
                    ? 'Optional approval notes...'
                    : 'Required: Reason for rejection...'
                }
              />
            </div>

            <div className="flex space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowProcessModal(false)}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant={processAction === 'approve' ? 'success' : 'danger'}
                onClick={submitProcessWithdrawal}
                disabled={processAction === 'reject' && !adminNotes.trim()}
                fullWidth
              >
                {processAction === 'approve' ? 'Approve Withdrawal' : 'Reject Withdrawal'}
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
    welcomeMessage: 'Welcome to our video earnings platform!',
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
      toast.error('Failed to load settings');
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
        toast.success('Settings updated successfully');
      }
    } catch (error) {
      console.error('Update settings error:', error);
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading settings..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Platform Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure global platform settings and policies
        </p>
      </div>

      <div className="space-y-6">
        {/* Withdrawal Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Withdrawal Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Minimum Withdrawal Amount (IQD)"
              name="minimumWithdrawal"
              type="number"
              value={settings.minimumWithdrawal}
              onChange={handleChange}
              min="0"
            />

            <Input
              label="Maximum Daily Withdrawals per User"
              name="maxDailyWithdrawals"
              type="number"
              value={settings.maxDailyWithdrawals}
              onChange={handleChange}
              min="1"
            />

            <Input
              label="Platform Commission (%)"
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
            Platform Settings
          </h2>

          <div className="space-y-6">
            <div className="flex items-center space-x-3">
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
                  Maintenance Mode
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Enable to prevent new user registrations and transactions
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Welcome Message
              </label>
              <textarea
                name="welcomeMessage"
                value={settings.welcomeMessage}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter welcome message for new users..."
              />
            </div>

            <Input
              label="Support WhatsApp Number"
              name="supportWhatsapp"
              value={settings.supportWhatsapp}
              onChange={handleChange}
              placeholder="+964XXXXXXXXX"
            />
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={fetchSettings}
            disabled={saving}
          >
            Reset Changes
          </Button>

          <Button
            onClick={handleSave}
            loading={saving}
          >
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminWithdrawals;