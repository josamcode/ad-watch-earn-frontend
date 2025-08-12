import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card, Button, Badge } from '../../components/UI/LoadingSpinner';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  DollarSign,
  Clock,
  ArrowLeft,
  ArrowRight,
  Gift,
  AlertCircle
} from 'lucide-react';
import ReactPlayer from 'react-player';
import axios from 'axios';
import toast from 'react-hot-toast';

const TaskDetail = () => {
  const { taskNumber } = useParams();
  const { user, addEarnings, updateTaskProgress } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [canEarn, setCanEarn] = useState(false);
  const [hasEarned, setHasEarned] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);

  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchTaskDetails();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [taskNumber]);

  useEffect(() => {
    // Reset video state when changing videos
    setIsPlaying(false);
    setPlayed(0);
    setCanEarn(false);
    setHasEarned(false);
    setPlayerReady(false);
    setTimeLeft(0);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [currentVideoIndex]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/tasks/${taskNumber}`);

      if (response.data.success) {
        const taskData = response.data.task;
        setTask(taskData);

        // Find first unwatched video
        const unwatchedIndex = taskData.videos.findIndex(video =>
          !taskData.videosWatched.includes(video._id)
        );
        setCurrentVideoIndex(unwatchedIndex >= 0 ? unwatchedIndex : 0);
      } else {
        toast.error('المهمة غير موجودة أو مقفلة');
        navigate('/tasks');
      }
    } catch (error) {
      console.error('Fetch task error:', error);
      toast.error('فشل في تحميل المهمة');
      navigate('/tasks');
    } finally {
      setLoading(false);
    }
  };

  const startCountdown = () => {
    if (duration && !intervalRef.current) {
      setTimeLeft(Math.ceil(duration - 1));

      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setCanEarn(true);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
  };

  const handleProgress = (state) => {
    setPlayed(state.played);

    // Start countdown when video starts playing
    if (state.played > 0 && !intervalRef.current && playerReady) {
      startCountdown();
    }
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleReady = () => {
    setPlayerReady(true);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleSeek = () => {
    // Prevent seeking by restarting video
    toast.error('التنقل غير مسموح به. تم إعادة تشغيل الفيديو.');
    setPlayed(0);
    setTimeLeft(duration ? Math.ceil(duration) : 0);
    setCanEarn(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (playerRef.current) {
      playerRef.current.seekTo(0);
    }
  };

  const handleVideoEnd = () => {
    if (played >= 0.95) { // 95% completion required
      setCanEarn(true);
      setTimeLeft(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const submitVideoCompletion = async () => {
    if (!canEarn || hasEarned || submitting || played < 0.9) return;

    try {
      setSubmitting(true);
      const currentVideo = task.videos[currentVideoIndex];

      const response = await axios.post('/tasks/watch-video', {
        videoId: currentVideo._id,
        taskNumber: parseInt(taskNumber),
        watchDuration: played * 100 // Convert to percentage
      });

      if (response.data.success) {
        const earnings = response.data.earnings;
        setHasEarned(true);

        // Update local state
        addEarnings(earnings);
        updateTaskProgress(parseInt(taskNumber), {
          videosWatched: [...(task.videosWatched || []), currentVideo._id]
        });

        toast.success(`تم كسب ${earnings} دينار عراقي! 🎉`);

        // Move to next video or complete task
        setTimeout(() => {
          if (currentVideoIndex < task.videos.length - 1) {
            setCurrentVideoIndex(currentVideoIndex + 1);
          } else {
            // Task completed
            toast.success('تمت المهمة! 🎊');
            if (response.data.nextTaskUnlocked) {
              toast.success('تم فتح المهمة التالية!');
            }
            navigate('/withdrawal');
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Submit video error:', error);
      toast.error(error.response?.data?.message || 'فشل في تقديم إكمال الفيديو');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isVideoWatched = (videoId) => {
    return task?.videosWatched?.includes(videoId);
  };

  if (loading) {
    return <LoadingSpinner text="جاري تحميل المهمة..." />;
  }

  if (!task) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          المهمة غير موجودة
        </h1>
        <Button onClick={() => navigate('/tasks')}>
          العودة إلى المهام
        </Button>
      </div>
    );
  }

  const currentVideo = task.videos[currentVideoIndex];
  const isCurrentVideoWatched = isVideoWatched(currentVideo?._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/tasks')}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              المهمة {task.taskNumber}: {task.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              الفيديو {currentVideoIndex + 1} من أصل {task.videos.length}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="info">
            {task.videos.filter(v => isVideoWatched(v._id)).length}/{task.videos.length} مكتملة
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Player Section */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            {currentVideo ? (
              <>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {currentVideo.title}
                  </h2>
                  {currentVideo.description && (
                    <p className="text-gray-600 dark:text-gray-400">
                      {currentVideo.description}
                    </p>
                  )}
                </div>

                {/* Video Player */}
                <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                  <ReactPlayer
                    ref={playerRef}
                    url={currentVideo.url}
                    width="100%"
                    height="400px"
                    playing={isPlaying}
                    onProgress={handleProgress}
                    onDuration={handleDuration}
                    onReady={handleReady}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onSeek={handleSeek}
                    onEnded={handleVideoEnd}
                    controls={false} // Disable native controls to prevent seeking
                    config={{
                      youtube: {
                        playerVars: {
                          controls: 0,
                          disablekb: 1,
                          fs: 0,
                          modestbranding: 1
                        }
                      }
                    }}
                  />

                  {/* Custom Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex items-center justify-between text-white">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                        disabled={!playerReady}
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </button>

                      <div className="flex items-center space-x-4">
                        {timeLeft > 0 && (
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {formatTime(timeLeft)} متبقية
                            </span>
                          </div>
                        )}

                        <div className="text-sm">
                          {formatTime(played * duration)} / {formatTime(duration)}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-white/20 rounded-full h-1 mt-2">
                      <div
                        className="bg-white h-1 rounded-full transition-all duration-300"
                        style={{ width: `${played * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Video Status */}
                <div className="space-y-4">
                  {isCurrentVideoWatched ? (
                    <div className="flex items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                      <span className="text-green-700 dark:text-green-300 font-medium">
                        تم المشاهدة مسبقاً - تم استلام الأرباح!
                      </span>
                    </div>
                  ) : (
                    <>
                      {!canEarn ? (
                        <div className="flex items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                          <span className="text-blue-700 dark:text-blue-300">
                            {timeLeft > 0
                              ? `شاهد لمدة ${formatTime(timeLeft)} إضافية لكسب المال`
                              : 'شاهد الفيديو بالكامل لكسب المال'
                            }
                          </span>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="flex items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-4">
                            <Gift className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                            <span className="text-green-700 dark:text-green-300 font-medium">
                              مبروك! يمكنك الآن كسب {currentVideo.earningsPerView} دينار عراقي
                            </span>
                          </div>

                          <Button
                            onClick={submitVideoCompletion}
                            loading={submitting}
                            disabled={hasEarned}
                            size="lg"
                            className="min-w-[200px]"
                          >
                            {hasEarned ? 'تم الكسب!' : `استلم ${currentVideo.earningsPerView} دينار عراقي`}
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="py-12">
                <p className="text-gray-600 dark:text-gray-400">لا يوجد فيديو متاح</p>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Task Progress */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              تقدم المهمة
            </h3>

            <div className="space-y-3">
              {task.videos.map((video, index) => (
                <div
                  key={video._id}
                  className={`flex items-center justify-between p-3 rounded-lg ${index === currentVideoIndex
                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                    : 'bg-gray-50 dark:bg-gray-700'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isVideoWatched(video._id)
                      ? 'bg-green-600 text-white'
                      : index === currentVideoIndex
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                      }`}>
                      {isVideoWatched(video._id) ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        الفيديو {index + 1}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {video.earningsPerView} دينار عراقي
                      </p>
                    </div>
                  </div>

                  {index !== currentVideoIndex && !isVideoWatched(video._id) && (
                    <button
                      onClick={() => setCurrentVideoIndex(index)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentVideoIndex(Math.max(0, currentVideoIndex - 1))}
                disabled={currentVideoIndex === 0}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                السابق
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentVideoIndex(Math.min(task.videos.length - 1, currentVideoIndex + 1))}
                disabled={currentVideoIndex === task.videos.length - 1}
                className="flex-1"
              >
                التالي
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Card>

          {/* Earnings Summary */}
          <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <div className="flex items-center space-x-3 mb-4">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                الأرباح
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  الفيديوهات المكتملة
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {task.videos.filter(v => isVideoWatched(v._id)).length}/{task.videos.length}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  أرباح المهمة
                </span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {task.videos
                    .filter(v => isVideoWatched(v._id))
                    .reduce((sum, v) => sum + v.earningsPerView, 0)
                    .toLocaleString()} دينار عراقي
                </span>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">
                    الرصيد الحالي
                  </span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {user?.balance?.toLocaleString() || 0} دينار عراقي
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Important Notice */}
          <Card className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                  قواعد مهمة
                </h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• شاهد الفيديوهات بالكامل من البداية إلى النهاية</li>
                  <li>• ممنوع التخطي أو التمرير السريع أو التنقل</li>
                  <li>• يمكن مشاهدة كل فيديو مرة واحدة فقط للحصول على الأرباح</li>
                  <li>• أكمل جميع الفيديوهات لفتح المهمة التالية</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;