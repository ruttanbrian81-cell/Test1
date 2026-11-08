import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle2,
  FileCheck,
  Share2,
  Eye,
  Heart,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { PostAnalytics } from '../types';
import { generateWeeklyReportPDF, WeeklyReportSummary } from '../utils/pdfGenerator';

interface ReportGeneratorProps {
  analytics: PostAnalytics[];
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ analytics }) => {
  const [dateRange, setDateRange] = useState('Week of Nov 1 - Nov 7, 2026');
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Compute summary metrics
  const totalImpressions = analytics.reduce((acc, p) => acc + p.impressions, 0);
  const totalEngagements = analytics.reduce((acc, p) => acc + p.engagements, 0);
  const avgEngagementRate = totalImpressions > 0 ? (totalEngagements / totalImpressions) * 100 : 0;
  const totalShares = analytics.reduce((acc, p) => acc + p.shares, 0);
  const totalClicks = analytics.reduce((acc, p) => acc + p.clicks, 0);

  const reportData: WeeklyReportSummary = {
    dateRange,
    totalImpressions,
    totalEngagements,
    avgEngagementRate,
    totalShares,
    totalClicks,
    topChannel: 'LinkedIn (6.01% Eng. Rate)',
    posts: analytics,
    executiveSummary:
      'This week, distribution shifted from homogenous cross-posting to bespoke platform formatting. Tailoring aspect ratios (4:3 for LinkedIn, 16:9 for X, 1:1 for Instagram) delivered a 31% surge in organic shares and generated 163,470 total impressions with an industry-leading 5.92% average engagement rate.',
    keyLearnings: [
      'LinkedIn posts that opened with a contrarian thesis delivered 2.4x longer dwell time than generic how-to lists.',
      'Widescreen 16:9 images on Twitter/X generated 42% higher retweets and bookmark saves compared to square formats.',
      'Instagram carousels with a dedicated "Save for Later" slide achieved an 8.2% bookmark rate, boosting algorithmic explore reach.',
    ],
    recommendations: [
      'Double down on Tuesday morning LinkedIn thought-leadership releases between 8:00 AM - 9:30 AM EST.',
      'Test 3-part micro-threads on X during Wednesday midday tech cycles to capture breaking commentary.',
      'Integrate 3-tier hashtag bundles (Broad + Niche + Trending) into every visual post to sustain 72-hour discoverability.',
    ],
  };

  const handleDownloadPDF = () => {
    setIsExporting(true);
    setDownloadSuccess(false);

    try {
      generateWeeklyReportPDF(reportData);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (e) {
      console.error('Failed to generate PDF:', e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Export Action */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <FileText className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Automated Weekly Performance Report
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Export an executive-ready PDF report summarizing weekly cross-channel reach, engagement metrics, top assets, and AI strategic growth directives.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Vector PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>PDF Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Weekly PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs">
          <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
          <span className="font-semibold text-slate-600 dark:text-slate-400">Audit Cycle:</span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none"
          >
            <option value="Week of Nov 1 - Nov 7, 2026">Week of Nov 1 - Nov 7, 2026 (Current Cycle)</option>
            <option value="Week of Oct 25 - Oct 31, 2026">Week of Oct 25 - Oct 31, 2026 (Previous Cycle)</option>
            <option value="Week of Oct 18 - Oct 24, 2026">Week of Oct 18 - Oct 24, 2026</option>
          </select>
        </div>
      </section>

      {/* Report Document Live Preview Card */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-7 max-w-4xl mx-auto">
        {/* Document Header Preview */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
                Official Report
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500">{dateRange}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              Executive Cross-Platform Performance Summary
            </h2>
          </div>

          <div className="text-right text-xs text-slate-400">
            <span>Prepared by OmniPost AI Engine</span>
          </div>
        </div>

        {/* KPI Summary Preview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Total Impressions</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">
              {totalImpressions.toLocaleString()}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Total Engagements</span>
            <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {totalEngagements.toLocaleString()}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Avg Engagement Rate</span>
            <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {avgEngagementRate.toFixed(2)}%
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Shares & Retweets</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">
              {totalShares.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Executive Summary Preview */}
        <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-200 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Executive Synthesis
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {reportData.executiveSummary}
          </p>
        </div>

        {/* Key Learnings */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Algorithmic Learnings from this Cycle
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            {reportData.keyLearnings.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0 mt-1.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actionable Directives */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Recommended Action Plan for Upcoming Week
          </h3>
          <div className="space-y-2">
            {reportData.recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-3 text-xs"
              >
                <span className="font-bold text-indigo-600 dark:text-indigo-400 shrink-0">Action #{idx + 1}:</span>
                <span className="text-slate-700 dark:text-slate-300">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Document Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>OmniPost AI • Confidential Report</span>
          <button
            onClick={handleDownloadPDF}
            className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Download High-Res PDF</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
