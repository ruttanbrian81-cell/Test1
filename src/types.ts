export type ToneType = 'professional' | 'witty' | 'urgent' | 'conversational' | 'inspirational' | 'authoritative';

export type PlatformType = 'linkedin' | 'twitter' | 'instagram';

export type ImageAspectRatio = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';

export type ImageSize = '1K' | '2K' | '4K';

export type ImageModel = 'gemini-3-pro-image-preview' | 'gemini-nano-banana-2.1' | 'gemini-3.1-flash-lite-image';

export interface LinkedInDraft {
  hook: string;
  body: string;
  callToAction: string;
  hashtags: string[];
  optimalAspectRatio: string;
  imagePrompt: string;
  estimatedReadTime?: string;
  generatedImageUrl?: string;
}

export interface TwitterDraft {
  singlePost: string;
  thread: string[];
  hashtags: string[];
  optimalAspectRatio: string;
  imagePrompt: string;
  hookRating?: string;
  generatedImageUrl?: string;
}

export interface InstagramDraft {
  openingHook: string;
  caption: string;
  callToAction: string;
  carouselSlides?: Array<{
    slideNumber: number;
    headline: string;
    subtext: string;
  }>;
  hashtagBundle: {
    broad: string[];
    niche: string[];
    trending: string[];
  };
  optimalAspectRatio: string;
  imagePrompt: string;
  generatedImageUrl?: string;
}

export interface GeneratedCampaign {
  id: string;
  createdAt: string;
  idea: string;
  tone: ToneType;
  industry: string;
  targetAudience: string;
  strategySummary: string;
  linkedin: LinkedInDraft;
  twitter: TwitterDraft;
  instagram: InstagramDraft;
  recommendedPostTimes: {
    linkedin: string;
    twitter: string;
    instagram: string;
    rationale: string;
  };
}

export interface HashtagItem {
  tag: string;
  platform: 'linkedin' | 'twitter' | 'instagram' | 'all';
  volume: string;
  competitionScore: number; // 1 - 100
  trendingVelocity: number; // 1 - 100
  bestFor: string;
  category: 'breakout' | 'industry_core' | 'niche_authority';
}

export interface ScheduledPost {
  id: string;
  platform: PlatformType;
  content: string;
  scheduledTime: string;
  status: 'scheduled' | 'published' | 'draft';
  imageUrl?: string;
  engagementTarget?: string;
  optimalTimeReason?: string;
}

export interface PostAnalytics {
  id: string;
  platform: PlatformType;
  title: string;
  content: string;
  publishedAt: string;
  status: 'published' | 'scheduled';
  impressions: number;
  engagements: number;
  engagementRate: number; // percentage e.g. 4.8
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  topPerforming: boolean;
  imageUrl?: string;
}

export interface ScheduleRecommendation {
  platform: string;
  primaryWindow: string;
  secondaryWindow: string;
  peakDay: string;
  expectedLift: string;
  reasoning: string;
}

export interface CalendarPlatformIdea {
  linkedin: { textHook: string; coreAngle: string; visualConcept: string };
  twitter: { tweetText: string; visualConcept: string };
  instagram: { captionHook: string; visualConcept: string; format: string };
  facebook: { postCopy: string; communityDiscussionPrompt: string; visualConcept: string };
}

export interface CalendarTheme {
  day: string;
  themeTitle: string;
  triggerEvent: string;
  overarchingConcept: string;
  platformIdeas: CalendarPlatformIdea;
}

export interface ContentCalendarData {
  calendarOverview: string;
  trendingNarrative: string;
  themes: CalendarTheme[];
}

