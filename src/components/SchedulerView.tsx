import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  Sparkles,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Plus,
  ArrowRight,
  TrendingUp,
  Linkedin,
  Twitter,
  Instagram,
  Check,
  Send,
  Loader2,
} from 'lucide-react';
import { ScheduledPost, PlatformType } from '../types';

interface SchedulerViewProps {
  scheduledPosts: ScheduledPost[];
  setScheduledPosts: React.Dispatch<React.SetStateAction<ScheduledPost[]>>;
  onSchedulePost: (post: Omit<ScheduledPost, 'id'>) => void;
}

export const SchedulerView: React.FC<SchedulerViewProps> = ({
  scheduledPosts,
  setScheduledPosts,
  onSchedulePost,
}) => {
  const [newPlatform, setNewPlatform] = useState<PlatformType>('linkedin');
  const [newContent, setNewContent] = useState('');
  const [newTime, setNewTime] = useState('Tomorrow, 8:15 AM EST');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Platform peak recommendations
  const PEAK_WINDOWS = [
    {
      platform: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: '#0077B5',
      peakDays: 'Tuesday & Thursday',
      optimalTime: '8:00 AM - 9:30 AM EST',
      expectedLift: '+38% Executive Reach',
      rationale: 'Professionals catch up on industry developments before their first morning meetings.',
    },
    {
      platform: 'twitter',
      name: 'Twitter / X',
      icon: Twitter,
      color: '#000000',
      peakDays: 'Wednesday & Friday',
      optimalTime: '11:30 AM - 1:00 PM EST',
      expectedLift: '+45% Retweets & Bookmarks',
      rationale: 'Midday breaks trigger high conversational volume and breaking industry discourse.',
    },
    {
      platform: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: '#E1306C',
      peakDays: 'Sunday & Wednesday',
      optimalTime: '7:00 PM - 9:00 PM EST',
      expectedLift: '+52% Saves & Story Shares',
      rationale: 'Audiences engage in relaxed mobile browsing and planning for the upcoming work week.',
    },
  ];

  const handlePublishNow = (id: string) => {
    setScheduledPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'published' } : p))
    );
  };

  const handleDelete = (id: string) => {
    setScheduledPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    onSchedulePost({
      platform: newPlatform,
      content: newContent,
      scheduledTime: newTime,
      status: 'scheduled',
      optimalTimeReason: 'Scheduled via AI Smart Slot',
    });

    setNewContent('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Clock className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                AI Publishing Scheduler & Audience Peak Analyzer
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Never guess when to post. Our algorithmic timing engine pinpoints the exact moments your target demographic is most receptive to maximize reach and comments.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Post to Queue</span>
          </button>
        </div>

        {/* AI Peak Recommendation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PEAK_WINDOWS.map((win, idx) => {
            const Icon = win.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-xs">
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{win.name}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                      {win.expectedLift}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Peak Days:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{win.peakDays}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Prime Window:</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{win.optimalTime}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
                    "{win.rationale}"
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setNewPlatform(win.platform as PlatformType);
                    setNewTime(`${win.peakDays.split('&')[0].trim()} at ${win.optimalTime.split('-')[0].trim()}`);
                    setShowAddModal(true);
                  }}
                  className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  <span>Schedule in this slot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Scheduled Queue Section */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Scheduled Publishing Queue</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {scheduledPosts.filter((p) => p.status === 'scheduled').length} posts queued for automated broadcast
            </p>
          </div>
        </div>

        {scheduledPosts.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Clock className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">Your schedule queue is currently empty.</p>
            <p className="text-xs mt-1">Generate a campaign in Content Studio or click "Add Post to Queue" above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {scheduledPosts.map((post) => {
              const isPublished = post.status === 'published';
              const PlatformIcon =
                post.platform === 'linkedin' ? Linkedin : post.platform === 'twitter' ? Twitter : Instagram;

              return (
                <div
                  key={post.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isPublished
                      ? 'bg-slate-50/60 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 opacity-75'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`p-2 rounded-xl text-white shrink-0 ${
                        post.platform === 'linkedin'
                          ? 'bg-[#0077B5]'
                          : post.platform === 'twitter'
                          ? 'bg-black'
                          : 'bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600'
                      }`}
                    >
                      <PlatformIcon className="w-4 h-4" />
                    </span>

                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt="Post media"
                        className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                      />
                    )}

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs uppercase text-slate-700 dark:text-slate-300">
                          {post.platform}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.scheduledTime}
                        </span>
                        {post.optimalTimeReason && (
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            {post.optimalTimeReason}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-800 dark:text-slate-200 line-clamp-2 max-w-2xl">
                        {post.content}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {isPublished ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Published</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handlePublishNow(post.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>Publish Now</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(post.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                      title="Remove from queue"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Add to Queue Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-lg w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Schedule Custom Post</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNew} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Target Platform
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['linkedin', 'twitter', 'instagram'] as PlatformType[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPlatform(p)}
                      className={`py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                        newPlatform === p
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Post Content
                </label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste or write your post copy..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Scheduled Time Slot
                </label>
                <input
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder="e.g. Tuesday at 8:15 AM EST"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm cursor-pointer"
                >
                  Add to Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
