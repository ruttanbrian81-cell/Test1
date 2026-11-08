import React, { useState } from 'react';
import {
  Hash,
  Search,
  Sparkles,
  TrendingUp,
  Copy,
  Check,
  Filter,
  BarChart2,
  CheckSquare,
  Square,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Zap,
  Loader2,
} from 'lucide-react';
import { HashtagItem } from '../types';

interface HashtagResearchProps {
  hashtags: HashtagItem[];
  setHashtags: React.Dispatch<React.SetStateAction<HashtagItem[]>>;
  onInsertTagsIntoStudio?: (tags: string[]) => void;
}

const PRESET_NICHES = [
  'Artificial Intelligence & Workflows',
  'B2B SaaS & Growth Hacking',
  'Creator Economy & Personal Branding',
  'E-commerce & DTC Brands',
  'Fintech & Web3 Infrastructure',
  'Healthtech & Longevity',
];

export const HashtagResearch: React.FC<HashtagResearchProps> = ({
  hashtags,
  setHashtags,
  onInsertTagsIntoStudio,
}) => {
  const [industryInput, setIndustryInput] = useState('Technology & AI');
  const [nicheInput, setNicheInput] = useState('Content Strategy & SaaS');
  const [seedKeyword, setSeedKeyword] = useState('AI Automation');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<'all' | 'breakout' | 'industry_core' | 'niche_authority'>('all');
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  const handleResearch = async (industryToSearch = industryInput, nicheToSearch = nicheInput) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/hashtag-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry: industryToSearch,
          niche: nicheToSearch,
          keyword: seedKeyword,
        }),
      });

      const res = await response.json();
      if (res.success && res.data?.hashtags) {
        setHashtags(res.data.hashtags);
        setSelectedTags([]);
      }
    } catch (e) {
      console.error('Error conducting hashtag research:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelectTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const selectAllFiltered = () => {
    const filtered = getFilteredTags().map((h) => h.tag);
    setSelectedTags(Array.from(new Set([...selectedTags, ...filtered])));
  };

  const deselectAll = () => {
    setSelectedTags([]);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotification(label);
    setTimeout(() => setCopiedNotification(null), 2500);
  };

  const getFilteredTags = () => {
    if (filterCategory === 'all') return hashtags;
    return hashtags.filter((h) => h.category === filterCategory);
  };

  const filteredTags = getFilteredTags();

  return (
    <div className="space-y-8">
      {/* Header & Search */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400">
                <Hash className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Niche Hashtag Intelligence Lab
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Optimize discoverability and rank higher in algorithmic feeds by identifying breakout tags, competition ratios, and search volume in your niche.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleResearch()}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-700 hover:to-indigo-700 text-white shadow-sm disabled:opacity-50 transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Scanning Niche Velocity...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Find Trending Hashtags</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="hashtag-industry" className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Industry Domain
            </label>
            <input
              id="hashtag-industry"
              type="text"
              value={industryInput}
              onChange={(e) => setIndustryInput(e.target.value)}
              placeholder="e.g. Technology & AI"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label htmlFor="hashtag-niche" className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Target Sub-Niche
            </label>
            <input
              id="hashtag-niche"
              type="text"
              value={nicheInput}
              onChange={(e) => setNicheInput(e.target.value)}
              placeholder="e.g. Content Automation & B2B"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label htmlFor="hashtag-keyword" className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Seed Keyword / Topic
            </label>
            <input
              id="hashtag-keyword"
              type="text"
              value={seedKeyword}
              onChange={(e) => setSeedKeyword(e.target.value)}
              placeholder="e.g. AI Workflow"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>

        {/* Preset Niche Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Popular Niche Queries:</span>
          {PRESET_NICHES.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setNicheInput(preset);
                handleResearch(industryInput, preset);
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              {preset}
            </button>
          ))}
        </div>
      </section>

      {/* Filter Tabs & Batch Selection Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: `All Tags (${hashtags.length})` },
            { id: 'breakout', label: '🔥 Breakout & Fast-Rising' },
            { id: 'industry_core', label: '🏛️ Industry Core' },
            { id: 'niche_authority', label: '🎯 Niche Authority (Low Comp)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterCategory === cat.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Selected Tags Actions */}
        <div className="flex items-center gap-2">
          {selectedTags.length > 0 ? (
            <>
              <button
                onClick={() => copyToClipboard(selectedTags.join(' '), `Copied ${selectedTags.length} tags!`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-pink-600 hover:bg-pink-700 text-white shadow-xs cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Selected ({selectedTags.length})</span>
              </button>

              <button
                onClick={deselectAll}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 cursor-pointer"
              >
                Clear
              </button>
            </>
          ) : (
            <button
              onClick={selectAllFiltered}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Select All Filtered</span>
            </button>
          )}

          {copiedNotification && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>{copiedNotification}</span>
            </span>
          )}
        </div>
      </div>

      {/* Hashtag Cards / Table Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTags.map((h, idx) => {
          const isSelected = selectedTags.includes(h.tag);
          const isLowCompetition = h.competitionScore < 45;
          const isHighVelocity = h.trendingVelocity >= 85;

          return (
            <div
              key={idx}
              onClick={() => toggleSelectTag(h.tag)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-pink-500 bg-pink-50/40 dark:bg-pink-950/30 ring-2 ring-pink-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                {/* Top Row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelectTag(h.tag);
                      }}
                      className="text-pink-600 dark:text-pink-400"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 fill-pink-600 text-white dark:text-slate-900" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">{h.tag}</span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      h.category === 'breakout'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                        : h.category === 'niche_authority'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {h.category.replace('_', ' ')}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Est. Volume:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{h.volume}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Competition Score:</span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-bold ${
                          isLowCompetition
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : h.competitionScore > 75
                            ? 'text-red-500'
                            : 'text-amber-500'
                        }`}
                      >
                        {h.competitionScore}/100
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {isLowCompetition ? '(Easy rank)' : '(Competitive)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trending Velocity Progress */}
                <div className="mb-2">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-500 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-pink-500" />
                      Weekly Velocity
                    </span>
                    <span className="font-bold text-pink-600 dark:text-pink-400">+{h.trendingVelocity}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full"
                      style={{ width: `${Math.min(h.trendingVelocity, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Details */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">
                  Best For: <strong className="text-slate-700 dark:text-slate-200">{h.bestFor}</strong>
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(h.tag, `Copied ${h.tag}`);
                  }}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  title="Copy Tag"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Algorithmic Guidelines Card */}
      <section className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-indigo-500" />
          Cross-Platform Discoverability Playbook
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <span className="font-bold text-[#0077B5] block mb-1">LinkedIn Strategy</span>
            <p className="text-slate-600 dark:text-slate-300">
              Stick to 3-5 high-signal tags. Place them at the very bottom of the post. Avoid using more than 5 as LinkedIn's spam filter dampens impressions.
            </p>
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">Twitter / X Strategy</span>
            <p className="text-slate-600 dark:text-slate-300">
              Use 1-2 focused hashtags only, or weave them naturally into sentences. Tweets with 3+ hashtags get 17% less engagement on mobile feeds.
            </p>
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <span className="font-bold text-pink-600 dark:text-pink-400 block mb-1">Instagram 3-Tier Rule</span>
            <p className="text-slate-600 dark:text-slate-300">
              Combine 5 broad tags (1M+), 5 niche community tags (100K-500K), and 5 hyper-targeted breakout tags (under 50K) for compounding feed explore distribution.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
