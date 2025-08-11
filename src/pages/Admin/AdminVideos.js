import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Badge, Modal } from '../../components/UI/LoadingSpinner';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import {
  Video,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  DollarSign,
  Play,
  Pause,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminVideos = () => {
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [taskFilter, setTaskFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    duration: '',
    earningsPerView: '',
    taskNumber: 1,
    thumbnailUrl: ''
  });

  useEffect(() => {
    fetchVideos();
  }, [currentPage, taskFilter]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        taskNumber: taskFilter
      });

      const response = await axios.get(`/admin/videos?${params}`);

      if (response.data.success) {
        setVideos(response.data.videos);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Fetch videos error:', error);
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      url: '',
      duration: '',
      earningsPerView: '',
      taskNumber: 1,
      thumbnailUrl: ''
    });
  };

  const handleAddVideo = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEditVideo = (video) => {
    setSelectedVideo(video);
    setFormData({
      title: video.title,
      description: video.description || '',
      url: video.url,
      duration: video.duration.toString(),
      earningsPerView: video.earningsPerView.toString(),
      taskNumber: video.taskNumber,
      thumbnailUrl: video.thumbnailUrl || ''
    });
    setShowEditModal(true);
  };

  const handleSubmit = async (isEdit = false) => {
    try {
      const payload = {
        ...formData,
        duration: parseInt(formData.duration),
        earningsPerView: parseFloat(formData.earningsPerView),
        taskNumber: parseInt(formData.taskNumber)
      };

      let response;
      if (isEdit) {
        response = await axios.put(`/admin/videos/${selectedVideo._id}`, payload);
      } else {
        response = await axios.post('/admin/videos', payload);
      }

      if (response.data.success) {
        toast.success(`Video ${isEdit ? 'updated' : 'added'} successfully`);
        setShowAddModal(false);
        setShowEditModal(false);
        resetForm();
        fetchVideos();
      }
    } catch (error) {
      console.error('Submit video error:', error);
      toast.error(error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'add'} video`);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      const response = await axios.delete(`/admin/videos/${videoId}`);

      if (response.data.success) {
        toast.success('Video deleted successfully');
        fetchVideos();
      }
    } catch (error) {
      console.error('Delete video error:', error);
      toast.error('Failed to delete video');
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTaskBadge = (taskNumber) => {
    const colors = {
      1: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      2: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      3: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[taskNumber] || colors[1]}`}>
        Task {taskNumber}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Video Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage videos, earnings, and task assignments
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={fetchVideos}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button onClick={handleAddVideo}>
            <Plus className="w-4 h-4 mr-2" />
            Add Video
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by task:
            </span>
            <select
              value={taskFilter}
              onChange={(e) => setTaskFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Tasks</option>
              <option value="1">Task 1</option>
              <option value="2">Task 2</option>
              <option value="3">Task 3</option>
            </select>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            {pagination.total || 0} total videos
          </div>
        </div>
      </Card>

      {/* Videos Grid */}
      {loading ? (
        <div className="p-8">
          <LoadingSpinner text="Loading videos..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video._id} className="overflow-hidden">
              {/* Video Thumbnail */}
              <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="w-16 h-16 text-gray-400" />
                  </div>
                )}

                <div className="absolute top-2 left-2">
                  {getTaskBadge(video.taskNumber)}
                </div>

                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                  {formatDuration(video.duration)}
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {video.title}
                </h3>

                {video.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {video.description}
                  </p>
                )}

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                    <Eye className="w-4 h-4" />
                    <span>{video.totalViews} views</span>
                  </div>

                  <div className="flex items-center space-x-1 text-sm text-green-600 dark:text-green-400">
                    <DollarSign className="w-4 h-4" />
                    <span>{video.earningsPerView} IQD</span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                  Added: {formatDate(video.createdAt)}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditVideo(video)}
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteVideo(video._id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {videos.length === 0 && (
            <div className="col-span-full">
              <Card className="p-12 text-center">
                <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Videos Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start by adding your first video to the platform.
                </p>
                <Button onClick={handleAddVideo}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Video
                </Button>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
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
            Next
          </Button>
        </div>
      )}

      {/* Add Video Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Video"
        size="xl"
      >
        <VideoForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={() => handleSubmit(false)}
          onCancel={() => setShowAddModal(false)}
          submitText="Add Video"
        />
      </Modal>

      {/* Edit Video Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Video"
        size="xl"
      >
        <VideoForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={() => handleSubmit(true)}
          onCancel={() => setShowEditModal(false)}
          submitText="Update Video"
        />
      </Modal>
    </div>
  );
};

// Video Form Component
const VideoForm = ({ formData, setFormData, onSubmit, onCancel, submitText }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Video Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Enter video title"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Task Number <span className="text-red-500">*</span>
          </label>
          <select
            name="taskNumber"
            value={formData.taskNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value={1}>Task 1</option>
            <option value={2}>Task 2</option>
            <option value={3}>Task 3</option>
          </select>
        </div>
      </div>

      <Input
        label="Video URL"
        name="url"
        type="url"
        value={formData.url}
        onChange={handleChange}
        required
        placeholder="https://www.youtube.com/watch?v=..."
      />

      <Input
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Brief description of the video"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Duration (seconds)"
          name="duration"
          type="number"
          value={formData.duration}
          onChange={handleChange}
          required
          placeholder="30"
          min="1"
        />

        <Input
          label="Earnings per View (IQD)"
          name="earningsPerView"
          type="number"
          value={formData.earningsPerView}
          onChange={handleChange}
          required
          placeholder="1000"
          min="0"
          step="0.01"
        />
      </div>

      <Input
        label="Thumbnail URL (Optional)"
        name="thumbnailUrl"
        type="url"
        value={formData.thumbnailUrl}
        onChange={handleChange}
        placeholder="https://example.com/thumbnail.jpg"
      />

      <div className="flex space-x-3 mt-6">
        <Button
          variant="outline"
          onClick={onCancel}
          fullWidth
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          fullWidth
        >
          {submitText}
        </Button>
      </div>
    </div>
  );
};

export default AdminVideos;