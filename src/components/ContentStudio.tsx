import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Linkedin,
  Twitter,
  Instagram,
  Copy,
  Check,
  Calendar,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Sliders,
  Maximize2,
  Download,
  AlertCircle,
  Lightbulb,
  Zap,
  TrendingUp,
  BrainCircuit,
  Settings2,
} from 'lucide-react';
import {
  GeneratedCampaign,
  ToneType,
  ImageAspectRatio,
  ImageSize,
  ImageModel,
  ScheduledPost,
} from '../types';

interface ContentStudioProps {
  campaign: GeneratedCampaign;
  setCampaign: React.Dispatch<React.SetStateAction<GeneratedCampaign>>;
  onSchedulePost: (post: Omit<ScheduledPost, 'id'>) => void;
  onDeepAudit: (content: string, platform: string) => void;
}

const TONES: { id: ToneType; label: string; description: string; emoji: string }[] = [
  { id: 'professional', label: 'Professional', description: 'Data-driven, authoritative, executive', emoji: '👔' },
  { id: 'witty', label: 'Witty', description: 'Sharp, clever, counter-intuitive hook', emoji: '💡' },
  { id: 'urgent', label: 'Urgent', description: 'Breaking development, high FOMO, decisive', emoji: '⚡️' },
  { id: 'conversational', label: 'Conversational', description: 'Candid, approachable, community-first', emoji: '☕️' },
  { id: 'inspirational', label: 'Inspirational', description: 'Visionary, storytelling, motivational', emoji: '🚀' },
  { id: 'authoritative', label: 'Authoritative', description: 'Masterclass, deep teardown, high rigor', emoji: '🏛️' },
];

const INDUSTRIES = [
  'Technology & AI',
  'B2B SaaS & Cloud',
  'E-commerce & Retail',
  'Fintech & Web3',
  'Creator Economy',
  'Health & Wellness',
  'Marketing & Growth',
  'Venture Capital & Startups',
];

const QUICK_INSPIRATIONS = [
  'Launching an AI customer support copilot that slashes response times by 70%',
  'Why most founders burn $50K on paid ads before building organic distribution',
  '3 non-obvious lessons from bootstrapping our SaaS to $100K MRR in 12 months',
  'The hidden cost of multitasking: how our engineering team regained 15 hrs/week',
];

export const ContentStudio: React.FC<ContentStudioProps> = ({
  campaign,
  setCampaign,
  onSchedulePost,
  onDeepAudit,
}) => {
  // Input state
  const [idea, setIdea] = useState(campaign.idea);
  const [tone, setTone] = useState<ToneType>(campaign.tone);
  const [industry, setIndustry] = useState(campaign.industry);
  const [targetAudience, setTargetAudience] = useState(campaign.targetAudience);
  const [keyPoints, setKeyPoints] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Platform tab view on smaller screens / selection
  const [activePlatformTab, setActivePlatformTab] = useState<'all' | 'linkedin' | 'twitter' | 'instagram'>('all');
  const [twitterFormat, setTwitterFormat] = useState<'single' | 'thread'>('single');

  // Copy feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Image Generation settings per platform
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [imageModel, setImageModel] = useState<ImageModel>('gemini-3-pro-image-preview');
  const [generatingImageFor, setGeneratingImageFor] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // Quick Refine state
  const [refiningKey, setRefiningKey] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateCampaign = async () => {
    if (!idea.trim()) {
      setErrorMessage('Please describe your idea or topic first.');
      return;
    }
    setErrorMessage('');
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea,
          tone,
          industry,
          targetAudience,
          keyPoints,
          includeThread: true,
          includeCarousel: true,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to generate content.');
      }

      const data = result.data;
      setCampaign({
        id: `camp-${Date.now()}`,
        createdAt: new Date().toISOString(),
        idea,
        tone,
        industry,
        targetAudience,
        strategySummary: data.strategySummary || '',
        linkedin: {
          ...data.linkedin,
          generatedImageUrl: campaign.linkedin.generatedImageUrl, // preserve if already had
        },
        twitter: {
          ...data.twitter,
          generatedImageUrl: campaign.twitter.generatedImageUrl,
        },
        instagram: {
          ...data.instagram,
          generatedImageUrl: campaign.instagram.generatedImageUrl,
        },
        recommendedPostTimes: data.recommendedPostTimes,
      });
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error communicating with Gemini service.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = async (
    platform: 'linkedin' | 'twitter' | 'instagram',
    customRatio?: ImageAspectRatio
  ) => {
    const platformData = campaign[platform];
    const prompt = platformData.imagePrompt;
    let ratio: ImageAspectRatio = '1:1';

    if (customRatio) {
      ratio = customRatio;
    } else if (platform === 'twitter') {
      ratio = '16:9';
    } else if (platform === 'linkedin') {
      ratio = '4:3';
    } else if (platform === 'instagram') {
      ratio = '1:1';
    }

    setGeneratingImageFor(platform);
    setImageError(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          aspectRatio: ratio,
          imageSize,
          model: imageModel,
        }),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Image generation failed.');
      }

      setCampaign((prev) => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          generatedImageUrl: resData.imageUrl,
        },
      }));
    } catch (err: any) {
      console.error(err);
      setImageError(`Image generation notice: ${err.message}`);
    } finally {
      setGeneratingImageFor(null);
    }
  };

  const handleQuickRefine = async (
    platform: 'linkedin' | 'twitter' | 'instagram',
    field: string,
    currentText: string,
    instruction: string
  ) => {
    const key = `${platform}-${field}-${instruction}`;
    setRefiningKey(key);

    try {
      const response = await fetch('/api/refine-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: currentText,
          instruction,
          platform,
        }),
      });

      const res = await response.json();
      if (res.success && res.text) {
        setCampaign((prev) => {
          if (platform === 'linkedin') {
            return {
              ...prev,
              linkedin: { ...prev.linkedin, body: res.text },
            };
          } else if (platform === 'twitter') {
            return {
              ...prev,
              twitter: { ...prev.twitter, singlePost: res.text },
            };
          } else if (platform === 'instagram') {
            return {
              ...prev,
              instagram: { ...prev.instagram, caption: res.text },
            };
          }
          return prev;
        });
      }
    } catch (e) {
      console.error('Refine failed', e);
    } finally {
      setRefiningKey(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Studio Header & Input Form */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Multi-Platform Content Studio
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Input 1 core idea. Gemini simultaneously produces tailored posts & optimal aspect ratio visuals for LinkedIn, Twitter/X, and Instagram.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>Dual-Engine: Gemini 3.8 Flash & 3-Pro Image</span>
          </div>
        </div>

        {/* Input Form */}
        <div className="space-y-6">
          {/* Idea Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="idea-input" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                What is your core idea or campaign topic?
              </label>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {idea.length} characters
              </span>
            </div>
            <textarea
              id="idea-input"
              rows={3}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g. Announcing our 2.0 release: AI-powered cross-platform publishing that eliminates 15 hours of manual work every week..."
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-y"
            />

            {/* Quick Inspiration Pills */}
            <div className="mt-2.5 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                Prompt ideas:
              </span>
              {QUICK_INSPIRATIONS.map((promptText, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setIdea(promptText)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors truncate max-w-[280px] text-left cursor-pointer"
                >
                  {promptText}
                </button>
              ))}
            </div>
          </div>

          {/* Tone Selector */}
          <div>
            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 block mb-2.5">
              Desired Tone of Voice
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {TONES.map((t) => {
                const isSelected = tone === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTone(t.id)}
                    className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 dark:border-indigo-500 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-base">{t.emoji}</span>
                      <span className={`text-xs font-bold ${isSelected ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-800 dark:text-slate-200'}`}>
                        {t.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
                      {t.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Industry & Target Audience Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="industry-select" className="text-sm font-semibold text-slate-800 dark:text-slate-200 block mb-1.5">
                Industry / Niche
              </label>
              <select
                id="industry-select"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="audience-input" className="text-sm font-semibold text-slate-800 dark:text-slate-200 block mb-1.5">
                Primary Target Audience
              </label>
              <input
                id="audience-input"
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Early-stage Founders, Growth Strategists, Creators"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Key highlights (optional) */}
          <div>
            <label htmlFor="highlights-input" className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Key Stats or Proof Points (Optional)
            </label>
            <input
              id="highlights-input"
              type="text"
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              placeholder="e.g. 70% reduction in response time, 250,000 users, backed by Sequoia"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Error notice */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 text-xs border border-red-200 dark:border-red-800">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Generation Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Zap className="w-4 h-4 text-indigo-500" />
              <span>One click drafts 3 tailored platform posts & visual prompts simultaneously</span>
            </div>

            <button
              type="button"
              onClick={handleGenerateCampaign}
              disabled={isGenerating}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md shadow-indigo-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Drafting Across Platforms...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Cross-Platform Content</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Global Image Configuration Affordances Bar */}
      <section className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Gemini Studio Image Generation Controls
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-950/80 dark:text-violet-300">
                gemini-3-pro-image-preview
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure resolution and model quality for generated social imagery.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Image Size Affordance (1K, 2K, 4K) */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-400">Size:</span>
            {(['1K', '2K', '4K'] as ImageSize[]).map((sz) => (
              <button
                key={sz}
                onClick={() => setImageSize(sz)}
                className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                  imageSize === sz
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          {/* Model Affordance */}
          <select
            value={imageModel}
            onChange={(e) => setImageModel(e.target.value as ImageModel)}
            aria-label="Image generation model"
            className="bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="gemini-3-pro-image-preview">Studio (gemini-3-pro-image-preview)</option>
            <option value="gemini-nano-banana-2.1">High-Res (gemini-nano-banana-2.1)</option>
            <option value="gemini-3.1-flash-lite-image">Fast (gemini-3.1-flash-lite-image)</option>
          </select>
        </div>
      </section>

      {imageError && (
        <div className="p-3 rounded-xl bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 text-xs border border-amber-200 dark:border-amber-800 flex items-center justify-between">
          <span>{imageError}</span>
          <button onClick={() => setImageError(null)} className="font-bold underline text-xs cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Cross-Platform Strategic Summary Banner */}
      {campaign.strategySummary && (
        <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-pink-950/40 border border-indigo-200/60 dark:border-indigo-800/60 rounded-2xl p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-indigo-600 text-white shrink-0 mt-0.5">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                Cross-Platform Positioning Strategy
              </h2>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-1 leading-relaxed">
                {campaign.strategySummary}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Platform Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActivePlatformTab('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activePlatformTab === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All 3 Side-by-Side
        </button>
        <button
          onClick={() => setActivePlatformTab('linkedin')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activePlatformTab === 'linkedin'
              ? 'bg-[#0077B5] text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Linkedin className="w-3.5 h-3.5" />
          <span>LinkedIn (Long-Form)</span>
        </button>
        <button
          onClick={() => setActivePlatformTab('twitter')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activePlatformTab === 'twitter'
              ? 'bg-black text-white dark:bg-slate-800 dark:text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Twitter className="w-3.5 h-3.5" />
          <span>Twitter / X (Punchy & Thread)</span>
        </button>
        <button
          onClick={() => setActivePlatformTab('instagram')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activePlatformTab === 'instagram'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Instagram className="w-3.5 h-3.5" />
          <span>Instagram (Visual & Hashtags)</span>
        </button>
      </div>

      {/* Main 3-Column / Tab Grid */}
      <div
        className={`grid gap-6 ${
          activePlatformTab === 'all'
            ? 'grid-cols-1 lg:grid-cols-3'
            : 'grid-cols-1 max-w-3xl mx-auto'
        }`}
      >
        {/* ==================== 1. LINKEDIN CARD ==================== */}
        {(activePlatformTab === 'all' || activePlatformTab === 'linkedin') && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col shadow-sm transition-all">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#0077B5]/10 text-[#0077B5] dark:bg-[#0077B5]/20">
                  <Linkedin className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">LinkedIn Post</h3>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Long-Form • {campaign.linkedin.estimatedReadTime || '2 min read'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onDeepAudit(campaign.linkedin.body, 'LinkedIn')}
                  title="Deep virality audit with Gemini 4 Argon"
                  className="p-1.5 rounded-lg text-xs font-semibold bg-violet-50 text-violet-700 hover:bg-violet-100 dark:bg-violet-950/50 dark:text-violet-300 dark:hover:bg-violet-900/60 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <BrainCircuit className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Audit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(campaign.linkedin.body, 'linkedin-copy')}
                  aria-label="Copy LinkedIn post"
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {copiedId === 'linkedin-copy' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Hook Badge */}
            {campaign.linkedin.hook && (
              <div className="mb-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-0.5">Opening Hook:</span>
                <span className="text-slate-700 dark:text-slate-300 italic">{campaign.linkedin.hook}</span>
              </div>
            )}

            {/* Post Content */}
            <div className="flex-1 bg-slate-50/50 dark:bg-slate-800/30 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-sans max-h-72 overflow-y-auto">
              {campaign.linkedin.body}
            </div>

            {/* Hashtags */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {campaign.linkedin.hashtags?.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Tailored Image Section */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    LinkedIn Visual Asset
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                    Aspect Ratio {campaign.linkedin.optimalAspectRatio || '4:3'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleGenerateImage('linkedin', '4:3')}
                  disabled={generatingImageFor === 'linkedin'}
                  className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 cursor-pointer"
                >
                  {generatingImageFor === 'linkedin' ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-3 h-3" />
                      <span>Generate Image</span>
                    </>
                  )}
                </button>
              </div>

              {campaign.linkedin.generatedImageUrl ? (
                <div className="relative rounded-xl overflow-hidden group aspect-[4/3] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <img
                    src={campaign.linkedin.generatedImageUrl}
                    alt="LinkedIn Generated Visual"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <a
                      href={campaign.linkedin.generatedImageUrl}
                      download="linkedin-visual.png"
                      className="p-2 rounded-lg bg-white/90 text-slate-800 hover:bg-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleGenerateImage('linkedin', '4:3')}
                      className="p-2 rounded-lg bg-white/90 text-slate-800 hover:bg-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Regen</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-semibold block mb-0.5 text-slate-700 dark:text-slate-300">
                    Prompt Blueprint:
                  </span>
                  <span className="line-clamp-2 italic">{campaign.linkedin.imagePrompt}</span>
                </div>
              )}
            </div>

            {/* Quick AI Refine Chips (gemini-3.1-flash-lite) */}
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Refine:</span>
              {[
                { label: 'Punchier', inst: 'make the sentences punchier and cut filler words' },
                { label: 'Add Data Hooks', inst: 'add specific percentages and quantified proof points' },
                { label: 'Executive Tone', inst: 'rewrite with C-suite authority and strategic depth' },
              ].map((rf, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleQuickRefine('linkedin', 'body', campaign.linkedin.body, rf.inst)}
                  disabled={!!refiningKey}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  {refiningKey === `linkedin-body-${rf.inst}` ? 'Refining...' : rf.label}
                </button>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  onSchedulePost({
                    platform: 'linkedin',
                    content: campaign.linkedin.body,
                    scheduledTime: campaign.recommendedPostTimes?.linkedin || 'Tomorrow, 8:15 AM EST',
                    status: 'scheduled',
                    imageUrl: campaign.linkedin.generatedImageUrl,
                    optimalTimeReason: 'Tuesday/Thursday morning executive reading peak',
                  })
                }
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>Schedule LinkedIn</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================== 2. TWITTER / X CARD ==================== */}
        {(activePlatformTab === 'all' || activePlatformTab === 'twitter') && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col shadow-sm transition-all">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-black/10 text-black dark:bg-white/10 dark:text-white">
                  <Twitter className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Twitter / X Post</h3>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Hook Rating: {campaign.twitter.hookRating || '9.2/10'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Single Tweet vs Thread Toggle */}
                <div className="bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg flex text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setTwitterFormat('single')}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                      twitterFormat === 'single'
                        ? 'bg-white text-slate-900 dark:bg-slate-700 dark:text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    }`}
                  >
                    Tweet
                  </button>
                  <button
                    type="button"
                    onClick={() => setTwitterFormat('thread')}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                      twitterFormat === 'thread'
                        ? 'bg-white text-slate-900 dark:bg-slate-700 dark:text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    }`}
                  >
                    Thread ({campaign.twitter.thread?.length || 3})
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      twitterFormat === 'single'
                        ? campaign.twitter.singlePost
                        : campaign.twitter.thread?.join('\n\n') || '',
                      'twitter-copy'
                    )
                  }
                  aria-label="Copy Twitter content"
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {copiedId === 'twitter-copy' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Character meter for single tweet */}
            {twitterFormat === 'single' && (
              <div className="mb-2 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-500">Character Counter</span>
                <span
                  className={`font-bold ${
                    campaign.twitter.singlePost.length > 280 ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {campaign.twitter.singlePost.length} / 280
                </span>
              </div>
            )}

            {/* Post Content */}
            {twitterFormat === 'single' ? (
              <div className="flex-1 bg-slate-50/50 dark:bg-slate-800/30 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed max-h-72 overflow-y-auto">
                {campaign.twitter.singlePost}
              </div>
            ) : (
              <div className="flex-1 space-y-2 max-h-72 overflow-y-auto pr-1">
                {campaign.twitter.thread?.map((tweet, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200"
                  >
                    <span className="text-[10px] font-bold text-indigo-500 block mb-0.5">Tweet #{idx + 1}</span>
                    <p className="whitespace-pre-line">{tweet}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Hashtags */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {campaign.twitter.hashtags?.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Tailored Image Section (16:9 Optimal) */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Twitter / X Widescreen Asset
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                    16:9 Optimal
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleGenerateImage('twitter', '16:9')}
                  disabled={generatingImageFor === 'twitter'}
                  className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 cursor-pointer"
                >
                  {generatingImageFor === 'twitter' ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-3 h-3" />
                      <span>Generate 16:9</span>
                    </>
                  )}
                </button>
              </div>

              {campaign.twitter.generatedImageUrl ? (
                <div className="relative rounded-xl overflow-hidden group aspect-[16/9] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <img
                    src={campaign.twitter.generatedImageUrl}
                    alt="Twitter Generated Visual"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <a
                      href={campaign.twitter.generatedImageUrl}
                      download="twitter-banner.png"
                      className="p-2 rounded-lg bg-white/90 text-slate-800 hover:bg-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleGenerateImage('twitter', '16:9')}
                      className="p-2 rounded-lg bg-white/90 text-slate-800 hover:bg-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Regen</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-semibold block mb-0.5 text-slate-700 dark:text-slate-300">
                    Prompt Blueprint:
                  </span>
                  <span className="line-clamp-2 italic">{campaign.twitter.imagePrompt}</span>
                </div>
              )}
            </div>

            {/* Quick AI Refine Chips */}
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Refine:</span>
              {[
                { label: 'Under 240 chars', inst: 'make it under 240 characters while keeping punchiness' },
                { label: 'More Contrarian', inst: 'frame as a high-stakes counter-intuitive opinion' },
                { label: 'Add Viral Hook', inst: 'rewrite tweet opening to maximize quote tweets' },
              ].map((rf, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleQuickRefine('twitter', 'singlePost', campaign.twitter.singlePost, rf.inst)}
                  disabled={!!refiningKey}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  {refiningKey === `twitter-singlePost-${rf.inst}` ? 'Refining...' : rf.label}
                </button>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  onSchedulePost({
                    platform: 'twitter',
                    content:
                      twitterFormat === 'single'
                        ? campaign.twitter.singlePost
                        : campaign.twitter.thread?.join('\n\n') || '',
                    scheduledTime: campaign.recommendedPostTimes?.twitter || 'Wednesday, 11:30 AM EST',
                    status: 'scheduled',
                    imageUrl: campaign.twitter.generatedImageUrl,
                    optimalTimeReason: 'Midday tech discourse & breaking cycle peak',
                  })
                }
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>Schedule Twitter</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================== 3. INSTAGRAM CARD ==================== */}
        {(activePlatformTab === 'all' || activePlatformTab === 'instagram') && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col shadow-sm transition-all">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white">
                  <Instagram className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Instagram Post</h3>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Visual-First • 1:1 / 9:16 Square/Story
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleCopy(campaign.instagram.caption, 'instagram-copy')}
                  aria-label="Copy Instagram caption"
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {copiedId === 'instagram-copy' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Opening Hook */}
            {campaign.instagram.openingHook && (
              <div className="mb-2 p-2 rounded-xl bg-pink-50/60 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-900/40 text-xs">
                <span className="font-bold text-pink-600 dark:text-pink-400 block mb-0.5">Caption Hook:</span>
                <span className="text-slate-700 dark:text-slate-300 italic">{campaign.instagram.openingHook}</span>
              </div>
            )}

            {/* Caption Content */}
            <div className="flex-1 bg-slate-50/50 dark:bg-slate-800/30 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed max-h-56 overflow-y-auto">
              {campaign.instagram.caption}
            </div>

            {/* 3-Slide Carousel Script (if available) */}
            {campaign.instagram.carouselSlides && campaign.instagram.carouselSlides.length > 0 && (
              <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block mb-1">
                  Carousel Visual Breakdown:
                </span>
                <div className="space-y-1.5">
                  {campaign.instagram.carouselSlides.map((slide, i) => (
                    <div key={i} className="text-[11px] text-slate-700 dark:text-slate-300">
                      <span className="font-bold text-slate-900 dark:text-white">Slide {slide.slideNumber}:</span>{' '}
                      {slide.headline} — <span className="text-slate-500">{slide.subtext}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Structured Hashtag Bundle */}
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Hashtag Bundle (Broad + Niche + Trending):
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const allTags = [
                      ...(campaign.instagram.hashtagBundle?.broad || []),
                      ...(campaign.instagram.hashtagBundle?.niche || []),
                      ...(campaign.instagram.hashtagBundle?.trending || []),
                    ].join(' ');
                    handleCopy(allTags, 'ig-tags-copy');
                  }}
                  className="text-[10px] text-pink-600 dark:text-pink-400 font-bold hover:underline cursor-pointer"
                >
                  {copiedId === 'ig-tags-copy' ? 'Copied All!' : 'Copy Bundle'}
                </button>
              </div>

              <div className="flex flex-wrap gap-1">
                {campaign.instagram.hashtagBundle?.niche?.map((tag, idx) => (
                  <span
                    key={`n-${idx}`}
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
                  >
                    {tag}
                  </span>
                ))}
                {campaign.instagram.hashtagBundle?.trending?.map((tag, idx) => (
                  <span
                    key={`t-${idx}`}
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-pink-50 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Tailored Image Section (1:1 / 9:16) */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Instagram 1:1 Aesthetic Visual
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                    1:1 Square
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleGenerateImage('instagram', '1:1')}
                  disabled={generatingImageFor === 'instagram'}
                  className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 cursor-pointer"
                >
                  {generatingImageFor === 'instagram' ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-3 h-3" />
                      <span>Generate 1:1</span>
                    </>
                  )}
                </button>
              </div>

              {campaign.instagram.generatedImageUrl ? (
                <div className="relative rounded-xl overflow-hidden group aspect-square bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <img
                    src={campaign.instagram.generatedImageUrl}
                    alt="Instagram Generated Visual"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <a
                      href={campaign.instagram.generatedImageUrl}
                      download="instagram-photo.png"
                      className="p-2 rounded-lg bg-white/90 text-slate-800 hover:bg-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleGenerateImage('instagram', '1:1')}
                      className="p-2 rounded-lg bg-white/90 text-slate-800 hover:bg-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Regen</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-semibold block mb-0.5 text-slate-700 dark:text-slate-300">
                    Prompt Blueprint:
                  </span>
                  <span className="line-clamp-2 italic">{campaign.instagram.imagePrompt}</span>
                </div>
              )}
            </div>

            {/* Quick AI Refine */}
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Refine:</span>
              {[
                { label: 'Add Emojis', inst: 'add tasteful, relevant emojis and optimize line spacing' },
                { label: 'Drive Saves', inst: 'rewrite caption to maximize saves and bookmark value' },
              ].map((rf, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleQuickRefine('instagram', 'caption', campaign.instagram.caption, rf.inst)}
                  disabled={!!refiningKey}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  {refiningKey === `instagram-caption-${rf.inst}` ? 'Refining...' : rf.label}
                </button>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  onSchedulePost({
                    platform: 'instagram',
                    content: campaign.instagram.caption,
                    scheduledTime: campaign.recommendedPostTimes?.instagram || 'Sunday, 7:00 PM EST',
                    status: 'scheduled',
                    imageUrl: campaign.instagram.generatedImageUrl,
                    optimalTimeReason: 'Sunday evening mobile planning & visual browsing apex',
                  })
                }
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>Schedule Instagram</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Batch Action Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Batch Distribution Sync</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enqueue all 3 platform variations at once into their recommended optimal audience windows.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              onSchedulePost({
                platform: 'linkedin',
                content: campaign.linkedin.body,
                scheduledTime: campaign.recommendedPostTimes?.linkedin || 'Tomorrow, 8:15 AM EST',
                status: 'scheduled',
                imageUrl: campaign.linkedin.generatedImageUrl,
                optimalTimeReason: 'Tuesday B2B morning peak',
              });
              onSchedulePost({
                platform: 'twitter',
                content: campaign.twitter.singlePost,
                scheduledTime: campaign.recommendedPostTimes?.twitter || 'Wednesday, 11:30 AM EST',
                status: 'scheduled',
                imageUrl: campaign.twitter.generatedImageUrl,
                optimalTimeReason: 'Midday tech peak',
              });
              onSchedulePost({
                platform: 'instagram',
                content: campaign.instagram.caption,
                scheduledTime: campaign.recommendedPostTimes?.instagram || 'Sunday, 7:00 PM EST',
                status: 'scheduled',
                imageUrl: campaign.instagram.generatedImageUrl,
                optimalTimeReason: 'Sunday evening visual peak',
              });
              alert('✨ All 3 posts scheduled into their optimal channel windows!');
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Enqueue All 3 to Scheduler</span>
          </button>
        </div>
      </div>
    </div>
  );
};
