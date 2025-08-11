import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Badge, Modal } from '../../components/UI/LoadingSpinner';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import {
  Users,
  Search,
  Filter,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  Mail,
  Phone,
  MoreVertical,
  Plus,
  Download,
  RefreshCw,
  Unlock,
  Lock
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    balance: 0,
    isActive: true
  });

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        search: searchTerm,
        status: statusFilter
      });

      const response = await axios.get(`/admin/users?${params}`);

      if (response.data.success) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Fetch users error:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      balance: user.balance,
      isActive: user.isActive
    });
    setShowEditModal(true);
  };

  const handleTaskManagement = (user) => {
    setSelectedUser(user);
    setShowTaskModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      const response = await axios.put(`/admin/users/${selectedUser._id}`, editFormData);

      if (response.data.success) {
        toast.success('User updated successfully');
        setShowEditModal(false);
        fetchUsers();
      }
    } catch (error) {
      console.error('Update user error:', error);
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleToggleTask = async (taskNumber, unlock) => {
    try {
      const response = await axios.post(
        `/admin/users/${selectedUser._id}/task/${taskNumber}/toggle`,
        { unlock }
      );

      if (response.data.success) {
        toast.success(`Task ${taskNumber} ${unlock ? 'unlocked' : 'locked'} successfully`);
        fetchUsers();
      }
    } catch (error) {
      console.error('Toggle task error:', error);
      toast.error('Failed to toggle task');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (isActive) => {
    return isActive
      ? <Badge variant="success">Active</Badge>
      : <Badge variant="danger">Inactive</Badge>;
  };

  const isTaskUnlocked = (user, taskNumber) => {
    return user.taskProgress?.[`task${taskNumber}`]?.unlockedAt !== null;
  };

  const isTaskCompleted = (user, taskNumber) => {
    return user.taskProgress?.[`task${taskNumber}`]?.completed === true;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage user accounts, balances, and task access
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={fetchUsers}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Users</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400 py-2">
              {pagination.total || 0} total users
            </p>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8">
            <LoadingSpinner text="Loading users..." />
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
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tasks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            @{user.username}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center space-x-1 mb-1">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-500 dark:text-gray-400">{user.phoneNumber}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <div className="font-medium">{user.balance?.toLocaleString() || 0} IQD</div>
                        <div className="text-gray-500 dark:text-gray-400">
                          Total: {user.totalEarned?.toLocaleString() || 0} IQD
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-1">
                        {[1, 2, 3].map((taskNum) => (
                          <span
                            key={taskNum}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isTaskCompleted(user, taskNum)
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : isTaskUnlocked(user, taskNum)
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                              }`}
                          >
                            T{taskNum}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.isActive)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTaskManagement(user)}
                        >
                          <Unlock className="w-3 h-3 mr-1" />
                          Tasks
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <div className="py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Users Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  No users match your current filters.
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

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit User"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={editFormData.name}
            onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
          />

          <Input
            label="Email Address"
            type="email"
            value={editFormData.email}
            onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
          />

          <Input
            label="Balance (IQD)"
            type="number"
            value={editFormData.balance}
            onChange={(e) => setEditFormData(prev => ({ ...prev, balance: parseFloat(e.target.value) || 0 }))}
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={editFormData.isActive}
              onChange={(e) => setEditFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Account Active
            </label>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <Button
            variant="outline"
            onClick={() => setShowEditModal(false)}
            fullWidth
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateUser}
            fullWidth
          >
            Save Changes
          </Button>
        </div>
      </Modal>

      {/* Task Management Modal */}
      <Modal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        title={`Task Management - ${selectedUser?.name}`}
        size="lg"
      >
        <div className="space-y-4">
          {[1, 2, 3].map((taskNum) => {
            const isUnlocked = selectedUser ? isTaskUnlocked(selectedUser, taskNum) : false;
            const isCompleted = selectedUser ? isTaskCompleted(selectedUser, taskNum) : false;

            return (
              <div key={taskNum} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Task {taskNum}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Status: {isCompleted ? 'Completed' : isUnlocked ? 'Unlocked' : 'Locked'}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  {isCompleted ? (
                    <Badge variant="success">Completed</Badge>
                  ) : (
                    <Button
                      variant={isUnlocked ? "danger" : "success"}
                      size="sm"
                      onClick={() => handleToggleTask(taskNum, !isUnlocked)}
                    >
                      {isUnlocked ? (
                        <>
                          <Lock className="w-3 h-3 mr-1" />
                          Lock
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3 h-3 mr-1" />
                          Unlock
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <Button
            variant="outline"
            onClick={() => setShowTaskModal(false)}
            fullWidth
          >
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsers;