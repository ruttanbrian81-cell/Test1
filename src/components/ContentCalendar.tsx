import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  Loader2,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  ArrowRight,
  TrendingUp,
  Tag,
  Clock,
  Send,
  Check,
  Copy,
  Lightbulb,
} from 'lucide-react';
import { ContentCalendarData, CalendarTheme, ScheduledPost } from '../types';

interface ContentCalendarProps {
  calendarData: ContentCalendarData;
  setCalendarData: React.Dispatch<React.SetStateAction<ContentCalendarData>>;
  onLoadThemeIntoStudio: (idea: string) => void;
  onSchedulePost: (post: Omit<ScheduledPost, 'id'>) => void;
}

export const ContentCalendar: React.FC<ContentCalendarProps> = ({
  calendarData,
  setCalendarData,
  onLoadThemeIntoStudio,
  onSchedulePost,
}) => {
  const [industry, setIndustry] = useState('Technology & AI');
  const [targetAudience, setTargetAudience] = useState('Tech Founders, Marketers & Creators');
  const [timeframe, setTimeframe] = useState<'weekly' | 'bi-weekly'>('weekly');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedDayTheme, setSelectedDayTheme] = useState<number>(0);
  const [activePlatformFilter, setActivePlatformFilter] = useState<'all' | 'linkedin' | 'twitter' | 'instagram' | 'facebook'>('all');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateCalendar = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-content-calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry,
          targetAudience,
          timeframe,
        }),
      });

      const res = await response.json();
      if (res.success && res.data) {
        setCalendarData(res.data);
        setSelectedDayTheme(0);
      }
    } catch (e) {
      console.error('Error generating calendar:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const currentTheme = calendarData.themes[selectedDayTheme] || calendarData.themes[0];

  return (
    <div className="space-y-8">
      {/* Calendar Header */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400">
                <Calendar className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                AI Strategic Content Calendar
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Gemini analyzes upcoming holidays, industry events, and macro trends to suggest high-impact daily themes and tailored ideas for LinkedIn, Twitter, Instagram, and Facebook.
            </p>
          </div>

          <button
            onClick={handleGenerateCalendar}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm disabled:opacity-50 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Forecasting Calendar...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Regenerate AI Calendar</span>
              </>
            )}
          </button>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="calendar-industry" className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
              Industry Focus
            </label>
            <input
              id="calendar-industry"
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. Technology & AI"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="calendar-audience" className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
              Target Audience
            </label>
            <input
              id="calendar-audience"
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Founders, Marketers, Product Teams"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
              Planning Horizon
            </label>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setTimeframe('weekly')}
                className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  timeframe === 'weekly'
                    ? 'bg-white text-indigo-600 dark:bg-slate-700 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                7-Day Sprint
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('bi-weekly')}
                className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  timeframe === 'bi-weekly'
                    ? 'bg-white text-indigo-600 dark:bg-slate-700 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                14-Day Cycle
              </button>
            </div>
          </div>
        </div>

        {/* Narrative & Overview Banner */}
        <div className="mt-5 p-4 rounded-xl bg-violet-50/70 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <TrendingUp className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-violet-900 dark:text-violet-200">Current Trending Discourse: </span>
              <span className="text-violet-700 dark:text-violet-300">{calendarData.trendingNarrative}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Theme Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {calendarData.themes.map((theme, idx) => {
          const isSelected = selectedDayTheme === idx;
          return (
            <button
              key={idx}
              onClick={() => setSelectedDayTheme(idx)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20 ring-2 ring-indigo-500/30'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider ${isSelected ? 'text-indigo-200' : 'text-indigo-600 dark:text-indigo-400'}`}>
                    {theme.day}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-slate-300 dark:bg-slate-700'}`} />
                </div>
                <h4 className="text-xs font-bold line-clamp-1">{theme.themeTitle}</h4>
              </div>
              <p className={`text-[10px] mt-2 line-clamp-1 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                {theme.triggerEvent}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Theme Details & Cross-Platform Ideas */}
      {currentTheme && (
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm space-y-6">
          {/* Day & Event Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                  {currentTheme.day} Theme
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-amber-500" />
                  {currentTheme.triggerEvent}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                {currentTheme.themeTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
                {currentTheme.overarchingConcept}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const combinedIdea = `${currentTheme.themeTitle}: ${currentTheme.overarchingConcept}. Specifically inspired by ${currentTheme.triggerEvent}.`;
                onLoadThemeIntoStudio(combinedIdea);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all shrink-0 cursor-pointer"
            >
              <span>Load Theme Into Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Platform Ideas 4-Way Grid (LinkedIn, Twitter, Instagram, Facebook) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. LinkedIn Idea */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-[#0077B5]/10 text-[#0077B5]">
                    <Linkedin className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">LinkedIn Angle</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(currentTheme.platformIdeas.linkedin.textHook, 'cal-li-hook')}
                  className="text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  {copiedId === 'cal-li-hook' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>

              <div className="text-xs">
                <span className="font-semibold text-slate-500 block mb-0.5">Recommended Hook:</span>
                <p className="font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                  "{currentTheme.platformIdeas.linkedin.textHook}"
                </p>
              </div>

              <div className="text-xs">
                <span className="font-semibold text-slate-500 block mb-0.5">Core Thought Angle:</span>
                <p className="text-slate-600 dark:text-slate-300">{currentTheme.platformIdeas.linkedin.coreAngle}</p>
              </div>

              <div className="p-2 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/40 text-[11px] text-indigo-900 dark:text-indigo-200">
                <span className="font-bold block mb-0.5">Visual Asset Concept:</span>
                <span>{currentTheme.platformIdeas.linkedin.visualConcept}</span>
              </div>
            </div>

            {/* 2. Twitter / X Idea */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-black/10 text-black dark:bg-white/10 dark:text-white">
                    <Twitter className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Twitter / X Tweet</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(currentTheme.platformIdeas.twitter.tweetText, 'cal-tw-tweet')}
                  className="text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  {copiedId === 'cal-tw-tweet' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>

              <div className="text-xs">
                <span className="font-semibold text-slate-500 block mb-0.5">Punchy Tweet Draft:</span>
                <p className="font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60 whitespace-pre-line">
                  {currentTheme.platformIdeas.twitter.tweetText}
                </p>
              </div>

              <div className="p-2 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/40 text-[11px] text-indigo-900 dark:text-indigo-200">
                <span className="font-bold block mb-0.5">16:9 Banner Concept:</span>
                <span>{currentTheme.platformIdeas.twitter.visualConcept}</span>
              </div>
            </div>

            {/* 3. Instagram Idea */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-pink-100 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400">
                    <Instagram className="w-4 h-4" />
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Instagram Idea</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-pink-50 text-pink-700 dark:bg-pink-900/60 dark:text-pink-300">
                      {currentTheme.platformIdeas.instagram.format}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(currentTheme.platformIdeas.instagram.captionHook, 'cal-ig-hook')}
                  className="text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  {copiedId === 'cal-ig-hook' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>

              <div className="text-xs">
                <span className="font-semibold text-slate-500 block mb-0.5">Caption Hook:</span>
                <p className="font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                  "{currentTheme.platformIdeas.instagram.captionHook}"
                </p>
              </div>

              <div className="p-2 rounded-lg bg-pink-50/60 dark:bg-pink-950/40 text-[11px] text-pink-900 dark:text-pink-200">
                <span className="font-bold block mb-0.5">Visual Scene Direction:</span>
                <span>{currentTheme.platformIdeas.instagram.visualConcept}</span>
              </div>
            </div>

            {/* 4. Facebook Idea */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-[#1877F2]/10 text-[#1877F2]">
                    <Facebook className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Facebook Community</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(currentTheme.platformIdeas.facebook.postCopy, 'cal-fb-copy')}
                  className="text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  {copiedId === 'cal-fb-copy' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>

              <div className="text-xs">
                <span className="font-semibold text-slate-500 block mb-0.5">Post Copy & Discussion Prompt:</span>
                <p className="font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                  {currentTheme.platformIdeas.facebook.postCopy}
                </p>
              </div>

              <div className="p-2 rounded-lg bg-blue-50/60 dark:bg-blue-950/40 text-[11px] text-blue-900 dark:text-blue-200">
                <span className="font-bold block mb-0.5">Community Discussion Trigger:</span>
                <span>{currentTheme.platformIdeas.facebook.communityDiscussionPrompt}</span>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
