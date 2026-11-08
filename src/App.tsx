import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ContentStudio } from './components/ContentStudio';
import { ContentCalendar } from './components/ContentCalendar';
import { HashtagResearch } from './components/HashtagResearch';
import { SchedulerView } from './components/SchedulerView';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ReportGenerator } from './components/ReportGenerator';
import { DeepAuditModal } from './components/DeepAuditModal';
import {
  INITIAL_CAMPAIGN,
  INITIAL_CONTENT_CALENDAR,
  INITIAL_HASHTAGS,
  INITIAL_SCHEDULED,
  INITIAL_ANALYTICS,
} from './data/mockData';
import { GeneratedCampaign, HashtagItem, ScheduledPost, PostAnalytics, ContentCalendarData } from './types';

export default function App() {
  // Dark mode setup with localStorage persistence
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('omnipost-dark-mode');
      if (stored !== null) return stored === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('omnipost-dark-mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('omnipost-dark-mode', 'false');
    }
  }, [isDarkMode]);

  // Tab navigation
  const [activeTab, setActiveTab] = useState<
    'studio' | 'calendar' | 'hashtags' | 'scheduler' | 'analytics' | 'reports'
  >('studio');

  // Core application data state
  const [campaign, setCampaign] = useState<GeneratedCampaign>(INITIAL_CAMPAIGN);
  const [calendarData, setCalendarData] = useState<ContentCalendarData>(INITIAL_CONTENT_CALENDAR);
  const [hashtags, setHashtags] = useState<HashtagItem[]>(INITIAL_HASHTAGS);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(INITIAL_SCHEDULED);
  const [analytics, setAnalytics] = useState<PostAnalytics[]>(INITIAL_ANALYTICS);

  // Live simulation toggle
  const [isSimulatingLive, setIsSimulatingLive] = useState(true);

  // Deep Audit Modal state (Gemini 4 Argon)
  const [auditModal, setAuditModal] = useState<{
    isOpen: boolean;
    content: string;
    platform: string;
  }>({
    isOpen: false,
    content: '',
    platform: 'LinkedIn',
  });

  // Real-time simulated engagement updates
  useEffect(() => {
    if (!isSimulatingLive) return;

    const interval = setInterval(() => {
      setAnalytics((prev) => {
        // Pick a random post to increment
        const randomIndex = Math.floor(Math.random() * prev.length);
        return prev.map((post, idx) => {
          if (idx === randomIndex) {
            const addedImp = Math.floor(Math.random() * 8) + 3;
            const addedLikes = Math.random() > 0.4 ? Math.floor(Math.random() * 3) + 1 : 0;
            const addedComments = Math.random() > 0.7 ? 1 : 0;
            const addedShares = Math.random() > 0.8 ? 1 : 0;
            const addedClicks = Math.random() > 0.5 ? Math.floor(Math.random() * 2) + 1 : 0;
            const newEng = post.engagements + addedLikes + addedComments + addedShares;
            const newImp = post.impressions + addedImp;
            return {
              ...post,
              impressions: newImp,
              likes: post.likes + addedLikes,
              comments: post.comments + addedComments,
              shares: post.shares + addedShares,
              clicks: post.clicks + addedClicks,
              engagements: newEng,
              engagementRate: (newEng / newImp) * 100,
            };
          }
          return post;
        });
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isSimulatingLive]);

  // Handlers
  const handleSchedulePost = (newPost: Omit<ScheduledPost, 'id'>) => {
    const postWithId: ScheduledPost = {
      ...newPost,
      id: `sch-${Date.now()}`,
    };
    setScheduledPosts((prev) => [postWithId, ...prev]);

    // Also add to analytics tracking list as a scheduled/monitored post
    const analyticsEntry: PostAnalytics = {
      id: `post-${Date.now()}`,
      platform: newPost.platform,
      title: newPost.content.slice(0, 35) + '...',
      content: newPost.content,
      publishedAt: 'Just scheduled',
      status: 'scheduled',
      impressions: 0,
      engagements: 0,
      engagementRate: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      clicks: 0,
      topPerforming: false,
      imageUrl: newPost.imageUrl,
    };
    setAnalytics((prev) => [analyticsEntry, ...prev]);
  };

  const handleLoadThemeIntoStudio = (idea: string) => {
    setCampaign((prev) => ({
      ...prev,
      idea,
    }));
    setActiveTab('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeepAudit = (content: string, platform: string) => {
    setAuditModal({
      isOpen: true,
      content,
      platform,
    });
  };

  const handleNewDraftClick = () => {
    setActiveTab('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onNewDraftClick={handleNewDraftClick}
        isSimulatingLive={isSimulatingLive}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'studio' && (
          <ContentStudio
            campaign={campaign}
            setCampaign={setCampaign}
            onSchedulePost={handleSchedulePost}
            onDeepAudit={handleDeepAudit}
          />
        )}

        {activeTab === 'calendar' && (
          <ContentCalendar
            calendarData={calendarData}
            setCalendarData={setCalendarData}
            onLoadThemeIntoStudio={handleLoadThemeIntoStudio}
            onSchedulePost={handleSchedulePost}
          />
        )}

        {activeTab === 'hashtags' && (
          <HashtagResearch
            hashtags={hashtags}
            setHashtags={setHashtags}
            onInsertTagsIntoStudio={(tags) => {
              setCampaign((prev) => ({
                ...prev,
                linkedin: {
                  ...prev.linkedin,
                  hashtags: [...prev.linkedin.hashtags, ...tags.slice(0, 3)],
                },
              }));
              setActiveTab('studio');
            }}
          />
        )}

        {activeTab === 'scheduler' && (
          <SchedulerView
            scheduledPosts={scheduledPosts}
            setScheduledPosts={setScheduledPosts}
            onSchedulePost={handleSchedulePost}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            analytics={analytics}
            isSimulatingLive={isSimulatingLive}
            setIsSimulatingLive={setIsSimulatingLive}
            onDeepAudit={handleDeepAudit}
          />
        )}

        {activeTab === 'reports' && <ReportGenerator analytics={analytics} />}
      </main>

      {/* Deep Behavioral Audit Modal (Gemini 4 Argon) */}
      <DeepAuditModal
        isOpen={auditModal.isOpen}
        onClose={() => setAuditModal((prev) => ({ ...prev, isOpen: false }))}
        content={auditModal.content}
        platform={auditModal.platform}
      />
    </div>
  );
}
