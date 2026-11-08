import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Radio,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  MousePointerClick,
  Award,
  Filter,
  ArrowUpRight,
  BrainCircuit,
  Linkedin,
  Twitter,
  Instagram,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { PostAnalytics, PlatformType } from '../types';

interface AnalyticsDashboardProps {
  analytics: PostAnalytics[];
  isSimulatingLive: boolean;
  setIsSimulatingLive: (val: boolean) => void;
  onDeepAudit: (content: string, platform: string) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  analytics,
  isSimulatingLive,
  setIsSimulatingLive,
  onDeepAudit,
}) => {
  const [platformFilter, setPlatformFilter] = useState<'all' | PlatformType>('all');
  const [sortBy, setSortBy] = useState<'impressions' | 'engagements' | 'rate'>('impressions');

  // Aggregated totals
  const totalImpressions = analytics.reduce((acc, p) => acc + p.impressions, 0);
  const totalEngagements = analytics.reduce((acc, p) => acc + p.engagements, 0);
  const avgEngagementRate = totalImpressions > 0 ? (totalEngagements / totalImpressions) * 100 : 0;
  const totalShares = analytics.reduce((acc, p) => acc + p.shares, 0);
  const totalClicks = analytics.reduce((acc, p) => acc + p.clicks, 0);

  // Platform aggregations
  const platformStats = (['linkedin', 'twitter', 'instagram'] as PlatformType[]).map((plat) => {
    const list = analytics.filter((p) => p.platform === plat);
    const imp = list.reduce((a, b) => a + b.impressions, 0);
    const eng = list.reduce((a, b) => a + b.engagements, 0);
    const rate = imp > 0 ? (eng / imp) * 100 : 0;
    return {
      platform: plat,
      impressions: imp,
      engagements: eng,
      rate,
      shareOfVoice: totalImpressions > 0 ? (imp / totalImpressions) * 100 : 0,
    };
  });

  const filteredPosts = analytics
    .filter((p) => (platformFilter === 'all' ? true : p.platform === platformFilter))
    .sort((a, b) => {
      if (sortBy === 'impressions') return b.impressions - a.impressions;
      if (sortBy === 'engagements') return b.engagements - a.engagements;
      return b.engagementRate - a.engagementRate;
    });

  return (
    <div className="space-y-8">
      {/* Header & Live Stream Controls */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <BarChart3 className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Unified Cross-Channel Analytics
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Real-time telemetry measuring impressions, comments, bookmark saves, and engagement conversion across LinkedIn, Twitter/X, and Instagram.
            </p>
          </div>

          {/* Live Simulator Toggle */}
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/80 p-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-2 text-xs">
              <span className={`w-2.5 h-2.5 rounded-full ${isSimulatingLive ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {isSimulatingLive ? 'Live Auto-Sync Active' : 'Live Sync Paused'}
              </span>
            </div>
            <button
              onClick={() => setIsSimulatingLive(!isSimulatingLive)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isSimulatingLive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
              }`}
            >
              {isSimulatingLive ? 'Disable' : 'Enable Live Feed'}
            </button>
          </div>
        </div>

        {/* Executive KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-500">TOTAL IMPRESSIONS</span>
              <Eye className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {totalImpressions.toLocaleString()}
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+18.4% vs last week</span>
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-500">ENGAGEMENTS</span>
              <Heart className="w-4 h-4 text-pink-500" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {totalEngagements.toLocaleString()}
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+24.1% vs last week</span>
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-500">AVG ENGAGEMENT RATE</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {avgEngagementRate.toFixed(2)}%
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">Benchmark: &gt; 3.5%</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-500">SHARES & REPOSTS</span>
              <Share2 className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {totalShares.toLocaleString()}
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+31.0% virality lift</span>
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-500">LINK CLICKS (CTR)</span>
              <MousePointerClick className="w-4 h-4 text-violet-500" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {totalClicks.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">
              {totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : 0}% Click rate
            </span>
          </div>
        </div>
      </section>

      {/* Platform Comparison Matrix */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Cross-Platform Reach & Engagement Efficiency
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {platformStats.map((st) => {
            const isLinkedin = st.platform === 'linkedin';
            const isTwitter = st.platform === 'twitter';
            const Icon = isLinkedin ? Linkedin : isTwitter ? Twitter : Instagram;
            const brandColor = isLinkedin ? 'bg-[#0077B5]' : isTwitter ? 'bg-black' : 'bg-pink-600';

            return (
              <div
                key={st.platform}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`p-1.5 rounded-lg text-white ${brandColor}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white uppercase">
                      {st.platform}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {st.rate.toFixed(2)}% Eng. Rate
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Impressions:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{st.impressions.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Engagements:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{st.engagements.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Share of Total Reach:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{st.shareOfVoice.toFixed(1)}%</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${brandColor} rounded-full`}
                    style={{ width: `${Math.min(st.shareOfVoice, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Post-Level Performance Table */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Post-Level Performance Breakdown</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Granular metrics per asset with live simulated engagement tracking and AI virality audits.
            </p>
          </div>

          {/* Filters & Sorting */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
              {(['all', 'linkedin', 'twitter', 'instagram'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatformFilter(p)}
                  className={`px-2.5 py-1 rounded-lg transition-all capitalize cursor-pointer ${
                    platformFilter === p
                      ? 'bg-white text-indigo-600 dark:bg-slate-700 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort analytics by"
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="impressions">Sort: Highest Impressions</option>
              <option value="engagements">Sort: Highest Engagements</option>
              <option value="rate">Sort: Highest Engagement Rate</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                <th className="pb-3 pl-2">Asset / Post Title</th>
                <th className="pb-3">Platform</th>
                <th className="pb-3 text-right">Impressions</th>
                <th className="pb-3 text-right">Engagements</th>
                <th className="pb-3 text-right">Eng. Rate</th>
                <th className="pb-3 text-right">Likes</th>
                <th className="pb-3 text-right">Comments</th>
                <th className="pb-3 text-right">Shares</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredPosts.map((post) => {
                const Icon =
                  post.platform === 'linkedin' ? Linkedin : post.platform === 'twitter' ? Twitter : Instagram;

                return (
                  <tr key={post.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 pl-2 max-w-xs sm:max-w-md">
                      <div className="flex items-center gap-2.5">
                        {post.imageUrl && (
                          <img
                            src={post.imageUrl}
                            alt=""
                            className="w-9 h-9 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                          />
                        )}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 dark:text-white line-clamp-1">
                              {post.title}
                            </span>
                            {post.topPerforming && (
                              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                                Top Asset
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">{post.publishedAt}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                        <Icon className="w-3.5 h-3.5" />
                        <span>{post.platform}</span>
                      </span>
                    </td>

                    <td className="py-3.5 text-right font-semibold text-slate-800 dark:text-slate-200">
                      {post.impressions.toLocaleString()}
                    </td>

                    <td className="py-3.5 text-right font-bold text-indigo-600 dark:text-indigo-400">
                      {post.engagements.toLocaleString()}
                    </td>

                    <td className="py-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {post.engagementRate.toFixed(2)}%
                    </td>

                    <td className="py-3.5 text-right text-slate-600 dark:text-slate-300">
                      {post.likes.toLocaleString()}
                    </td>

                    <td className="py-3.5 text-right text-slate-600 dark:text-slate-300">
                      {post.comments.toLocaleString()}
                    </td>

                    <td className="py-3.5 text-right text-slate-600 dark:text-slate-300">
                      {post.shares.toLocaleString()}
                    </td>

                    <td className="py-3.5 text-right pr-2">
                      <button
                        type="button"
                        onClick={() => onDeepAudit(post.content, post.platform)}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-violet-50 text-violet-700 hover:bg-violet-100 dark:bg-violet-950/60 dark:text-violet-300 dark:hover:bg-violet-900/60 transition-colors inline-flex items-center gap-1 cursor-pointer"
                        title="Audit behavioral virality with Gemini 4 Argon"
                      >
                        <BrainCircuit className="w-3 h-3" />
                        <span>AI Audit</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
