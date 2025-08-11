import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card, Badge } from '../../components/UI/LoadingSpinner';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import {
  Play,
  Lock,
  CheckCircle,
  Clock,
  DollarSign,
  Video,
  ArrowRight,
  Star,
  Gift
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Tasks = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/tasks');

      if (response.data.success) {
        setTasks(response.data.tasks);
      }
    } catch (error) {
      console.error('Fetch tasks error:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const getTaskStatusIcon = (task) => {
    if (!task.isUnlocked) {
      return <Lock className="w-6 h-6 text-gray-400" />;
    }
    if (task.completed) {
      return <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />;
    }
    return <Play className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
  };

  const getTaskStatusBadge = (task) => {
    if (!task.isUnlocked) {
      return <Badge variant="default">🔒 Locked</Badge>;
    }
    if (task.completed) {
      return <Badge variant="success">✅ Completed</Badge>;
    }
    return <Badge variant="info">▶️ Available</Badge>;
  };

  const calculateTotalEarnings = (task) => {
    if (!task.videos) return 0;
    return task.videos.reduce((total, video) => total + video.earningsPerView, 0);
  };

  const getUnlockRequirement = (taskNumber) => {
    switch (taskNumber) {
      case 1:
        return 'Available for all new users';
      case 2:
        return 'Complete Task 1 and make a withdrawal';
      case 3:
        return 'Complete Task 2 and make a withdrawal';
      default:
        return 'Requirements unknown';
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading tasks..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Available Tasks
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Complete tasks by watching videos to earn money. Each task must be completed fully to unlock the next one.
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your Progress
          </h2>
          <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
            <DollarSign className="w-5 h-5" />
            <span className="font-bold">{user?.balance?.toLocaleString() || 0} IQD</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {[1, 2, 3].map((taskNum) => {
            const task = tasks.find(t => t.taskNumber === taskNum);
            const isCompleted = task?.completed;
            const isUnlocked = task?.isUnlocked;

            return (
              <div
                key={taskNum}
                className={`p-4 rounded-lg border-2 ${isCompleted
                  ? 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
                  : isUnlocked
                    ? 'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
                    : 'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700'
                  }`}
              >
                <div className="text-2xl mb-2">
                  {isCompleted ? '✅' : isUnlocked ? '▶️' : '🔒'}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Task {taskNum}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isCompleted ? 'Completed' : isUnlocked ? 'Available' : 'Locked'}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Tasks List */}
      <div className="space-y-6">
        {tasks.map((task) => (
          <Card key={task._id} className="p-6 hover:shadow-lg transition-all duration-200">
            <div className="block items-start justify-between sm:flex">
              <div className="block items-start space-x-4 flex-1 sm:flex">
                {/* Task Icon */}
                <div className={`p-3 mb-1 sm:mb-0 rounded-full inline-block ${task.isUnlocked
                  ? task.completed
                    ? 'bg-green-100 dark:bg-green-900'
                    : 'bg-blue-100 dark:bg-blue-900'
                  : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                  {getTaskStatusIcon(task)}
                </div>

                {/* Task Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Task {task.taskNumber}: {task.title}
                    </h3>
                    {getTaskStatusBadge(task)}
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {task.description}
                  </p>

                  {/* Task Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Video className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {task.videos?.length || 0} Videos
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Up to {calculateTotalEarnings(task).toLocaleString()} IQD
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {task.videos?.reduce((total, video) => total + video.duration, 0) || 0}s total
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {task.isUnlocked && task.videos && task.videos.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Progress
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {task.videosWatched?.length || 0}/{task.videos.length} videos
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${((task.videosWatched?.length || 0) / task.videos.length) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Unlock Requirements */}
                  {!task.isUnlocked && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
                      <div className="flex items-center space-x-2">
                        <Lock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                        <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                          Unlock Requirements:
                        </span>
                      </div>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        {getUnlockRequirement(task.taskNumber)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="ml-4">
                {task.isUnlocked ? (
                  task.completed ? (
                    <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium">Completed</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => navigate(`/tasks/${task.taskNumber}`)}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                    >
                      <Play className="w-4 h-4" />
                      <span>Start Task</span>
                    </button>
                  )
                ) : (
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg">
                    <Lock className="w-4 h-4" />
                    <span className="font-medium">Locked</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}

        {tasks.length === 0 && (
          <Card className="p-12 text-center">
            <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Tasks Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Check back later for new earning opportunities!
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
          </Card>
        )}
      </div>

      {/* Tips Section */}
      <Card className="p-6 mt-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <div className="flex items-center space-x-3 mb-4">
          <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tips to Maximize Your Earnings
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">1</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Watch Completely</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Make sure to watch each video from start to finish to earn money.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">2</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Complete Tasks in Order</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Finish all videos in Task 1 before Task 2 becomes available.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Tasks;