import { GeneratedCampaign, HashtagItem, PostAnalytics, ScheduledPost, ContentCalendarData } from '../types';

export const INITIAL_CAMPAIGN: GeneratedCampaign = {
  id: 'camp-1',
  createdAt: '2026-11-07T14:30:00Z',
  idea: 'Announcing OmniPost AI 2.0: Generative cross-platform storytelling with automated visual composition and real-time algorithmic resonance tracking.',
  tone: 'professional',
  industry: 'Technology & AI',
  targetAudience: 'Growth Marketers, Social Strategists, and Agency Founders',
  strategySummary: 'Position OmniPost AI as the unified operating system for high-velocity multi-channel distribution. Emphasize saved team hours (15+ hrs/week) while maximizing algorithmic reach through tailored formats.',
  linkedin: {
    hook: 'Most social media teams spend 80% of their time reformatting the same message for different feeds. That paradigm ended today.',
    body: `We spent the last 6 months observing how top 1% brands distribute content across LinkedIn, Twitter/X, and Instagram.

The biggest mistake? Treating all platforms as identical copy-paste surfaces.

Here is what actually drives 4x higher algorithmic engagement:

1. LinkedIn demands intellectual depth
Audiences want the raw framework, the counter-intuitive decision, and actionable takeaways that make them look smart in front of their colleagues.

2. Twitter/X demands conversational friction
A single striking thesis under 280 characters that invites debate, backed by an immediate data point.

3. Instagram demands visual stop-power
High-aesthetic graphics, clear typography, and a structured caption that drives saves and shares.

Today, we're introducing OmniPost AI:
One core thesis. Instant, bespoke native assets tailored for every platform's unique algorithm and aspect ratio.

How is your team tackling multi-channel distribution heading into 2027?`,
    callToAction: 'Share your current content workflow in the comments below or join our beta cohort.',
    hashtags: ['#ContentStrategy', '#B2BMarketing', '#ArtificialIntelligence', '#GrowthMarketing', '#SaaS'],
    optimalAspectRatio: '4:3',
    imagePrompt: 'Minimalist editorial graphic showing multi-channel content nodes converging into a sleek digital workspace, dark slate background, holographic emerald accents, professional executive design.',
    estimatedReadTime: '2 min read',
    generatedImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  },
  twitter: {
    singlePost: `Stop copying and pasting your LinkedIn posts to Twitter.

The LinkedIn post wants thoughtful contemplation.
The Twitter feed wants speed, conviction, and a sharp hook.

Tailor the format to the feed. Engagement will 3x. ⚡️`,
    thread: [
      `1/ Stop copying and pasting your LinkedIn posts to Twitter/X. Here is why it kills your reach (and what to do instead): 🧵👇`,
      `2/ LinkedIn's algorithm rewards dwell time and comment depth. Twitter's algorithm rewards fast replies, quote tweets, and bookmarks within the first 15 minutes.`,
      `3/ On X: Strip the intro fluff. Lead with your boldest conclusion. If tweet #1 doesn't spark curiosity or constructive disagreement, nobody clicks "Show more".`,
      `4/ Visual hack: 16:9 widescreen visuals with high contrast and legible typography get 42% higher retweets on mobile feeds compared to square crops.`,
      `5/ Work smarter, not harder. Turn 1 high-conviction idea into 3 native platform masterpieces with @OmniPostAI. What's your biggest channel bottleneck?`,
    ],
    hashtags: ['#MarketingTwitter', '#BuildInPublic'],
    optimalAspectRatio: '16:9',
    imagePrompt: 'High-contrast cinematic wide 16:9 banner with glowing neon typography, sleek data visualization graphs, dynamic lighting, dark cyberpunk tech aesthetic.',
    hookRating: '9.4/10 — High curiosity & direct value proposition',
    generatedImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=675&q=80',
  },
  instagram: {
    openingHook: '✨ The secret to 10x social reach isn’t posting more. It’s formatting natively.',
    caption: `Swipe through to see the 3 golden rules of cross-platform content creation that changed everything for our brand. 📲👉

Rule 1: Never reuse square crops for every platform. Instagram feeds love 1:1 or 4:5 vertical frames that command the viewport.
Rule 2: Front-load value before the fold.
Rule 3: Give people a concrete reason to tap "Save" (checklists, frameworks, workflows).

Which platform is currently driving the highest ROI for your business? Drop a comment below! 👇

🔗 Link in bio to access the complete Cross-Platform Playbook.`,
    callToAction: 'Save this post for your next content batching session! 📌',
    carouselSlides: [
      {
        slideNumber: 1,
        headline: 'Why "Copy-Paste" Kills Your Reach',
        subtext: 'Each algorithm tests your content against distinct engagement triggers.',
      },
      {
        slideNumber: 2,
        headline: 'The 3 Platform Personas',
        subtext: 'LinkedIn = Executive boardroom. Twitter = Coffee shop debate. Instagram = Visual gallery.',
      },
      {
        slideNumber: 3,
        headline: 'Batch 10x Faster with AI',
        subtext: 'Generate native copy, aspect ratios, and tailored hooks in 30 seconds.',
      },
    ],
    hashtagBundle: {
      broad: ['#socialmediamarketing', '#contentcreator', '#marketingdigital', '#digitalstrategy'],
      niche: ['#contentbatching', '#growthhacks2026', '#socialmediatips', '#b2bbranding'],
      trending: ['#aiworkflow', '#creatoreconomy', '#solopreneurship', '#marketingautomation'],
    },
    optimalAspectRatio: '1:1',
    imagePrompt: 'Clean modern 1:1 isometric 3D rendering of creative studio icons, soft studio lighting, glassmorphism card surfaces, vibrant violet and cyan gradient highlights.',
    generatedImageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
  },
  recommendedPostTimes: {
    linkedin: 'Tuesday & Thursday at 8:15 AM EST (Peak executive commute & morning digest)',
    twitter: 'Wednesday at 11:30 AM EST (Midday tech discourse & breaking tech cycles)',
    instagram: 'Sunday at 7:00 PM EST (Relaxed evening mobile browsing & planning)',
    rationale: 'Staggering distribution across peak windows prevents audience fatigue and maximizes cross-channel amplification over 72 hours.',
  },
};

export const INITIAL_ANALYTICS: PostAnalytics[] = [
  {
    id: 'post-101',
    platform: 'linkedin',
    title: 'The death of the copy-paste marketing playbook',
    content: 'Most social media teams spend 80% of their time reformatting the same message for different feeds. That paradigm ended today...',
    publishedAt: '2 days ago',
    status: 'published',
    impressions: 48920,
    engagements: 2940,
    engagementRate: 6.01,
    likes: 1820,
    comments: 342,
    shares: 418,
    clicks: 1240,
    topPerforming: true,
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'post-102',
    platform: 'twitter',
    title: 'Stop copying and pasting to Twitter/X',
    content: 'The LinkedIn post wants thoughtful contemplation. The Twitter feed wants speed, conviction, and a sharp hook...',
    publishedAt: '1 day ago',
    status: 'published',
    impressions: 34150,
    engagements: 1980,
    engagementRate: 5.8,
    likes: 1320,
    comments: 189,
    shares: 471,
    clicks: 890,
    topPerforming: true,
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&h=338&q=80',
  },
  {
    id: 'post-103',
    platform: 'instagram',
    title: '3 Golden Rules of Native Aspect Ratios',
    content: 'Swipe through to see the 3 golden rules of cross-platform content creation that changed everything for our brand...',
    publishedAt: '3 days ago',
    status: 'published',
    impressions: 22400,
    engagements: 1540,
    engagementRate: 6.87,
    likes: 1180,
    comments: 98,
    shares: 262,
    clicks: 420,
    topPerforming: false,
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'post-104',
    platform: 'linkedin',
    title: 'Why AI will not replace marketers, but marketers with AI will',
    content: 'A deep dive into how human curation plus generative velocity creates unstoppable content compounding...',
    publishedAt: '4 days ago',
    status: 'published',
    impressions: 38200,
    engagements: 2100,
    engagementRate: 5.5,
    likes: 1450,
    comments: 215,
    shares: 285,
    clicks: 740,
    topPerforming: false,
  },
  {
    id: 'post-105',
    platform: 'twitter',
    title: 'Prompt engineering vs. Workflow engineering',
    content: 'Writing a good prompt is 10% of the battle. Connecting the LLM to real-time analytics and auto-scheduling is the other 90%...',
    publishedAt: '5 days ago',
    status: 'published',
    impressions: 19800,
    engagements: 920,
    engagementRate: 4.65,
    likes: 640,
    comments: 85,
    shares: 195,
    clicks: 310,
    topPerforming: false,
  },
];

export const INITIAL_SCHEDULED: ScheduledPost[] = [
  {
    id: 'sch-1',
    platform: 'linkedin',
    content: 'The 2027 Social Media Tech Stack: Why single-channel teams are losing market share 3x faster...',
    scheduledTime: 'Tomorrow, 8:15 AM EST',
    status: 'scheduled',
    optimalTimeReason: 'Tuesday peak B2B executive catchup window',
    engagementTarget: '4.5% - 6.0%',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'sch-2',
    platform: 'twitter',
    content: '5 micro-habits that save our content team 15 hours every single week (thread incoming at 11 AM) 👇',
    scheduledTime: 'Wednesday, 11:30 AM EST',
    status: 'scheduled',
    optimalTimeReason: 'Midday tech discussion peak',
    engagementTarget: '5.2%',
  },
  {
    id: 'sch-3',
    platform: 'instagram',
    content: 'Behind the Scenes: How our AI team builds responsive UI systems that never lag...',
    scheduledTime: 'Thursday, 6:45 PM EST',
    status: 'scheduled',
    optimalTimeReason: 'Evening post-work engagement spike',
    engagementTarget: '7.1%',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80',
  },
];

export const INITIAL_HASHTAGS: HashtagItem[] = [
  {
    tag: '#ContentStrategy',
    platform: 'linkedin',
    volume: '2.8M posts',
    competitionScore: 78,
    trendingVelocity: 88,
    bestFor: 'Broad Reach',
    category: 'industry_core',
  },
  {
    tag: '#AIWorkflow',
    platform: 'all',
    volume: '640K posts',
    competitionScore: 42,
    trendingVelocity: 96,
    bestFor: 'Niche Discovery',
    category: 'breakout',
  },
  {
    tag: '#BuildInPublic',
    platform: 'twitter',
    volume: '1.9M posts',
    competitionScore: 84,
    trendingVelocity: 91,
    bestFor: 'Community Building',
    category: 'industry_core',
  },
  {
    tag: '#MarketingAutomation',
    platform: 'linkedin',
    volume: '1.1M posts',
    competitionScore: 65,
    trendingVelocity: 82,
    bestFor: 'Lead Gen',
    category: 'industry_core',
  },
  {
    tag: '#CreatorEconomy',
    platform: 'instagram',
    volume: '3.4M posts',
    competitionScore: 89,
    trendingVelocity: 79,
    bestFor: 'Broad Reach',
    category: 'industry_core',
  },
  {
    tag: '#ContentBatching',
    platform: 'instagram',
    volume: '185K posts',
    competitionScore: 31,
    trendingVelocity: 94,
    bestFor: 'Engagement',
    category: 'breakout',
  },
  {
    tag: '#GenerativeAI',
    platform: 'all',
    volume: '4.2M posts',
    competitionScore: 92,
    trendingVelocity: 98,
    bestFor: 'Broad Reach',
    category: 'industry_core',
  },
  {
    tag: '#B2BSaaS',
    platform: 'linkedin',
    volume: '420K posts',
    competitionScore: 48,
    trendingVelocity: 85,
    bestFor: 'Niche Authority',
    category: 'niche_authority',
  },
  {
    tag: '#GrowthLoops',
    platform: 'twitter',
    volume: '95K posts',
    competitionScore: 26,
    trendingVelocity: 89,
    bestFor: 'Niche Authority',
    category: 'niche_authority',
  },
  {
    tag: '#SocialMediaHacks',
    platform: 'instagram',
    volume: '890K posts',
    competitionScore: 74,
    trendingVelocity: 71,
    bestFor: 'Engagement',
    category: 'industry_core',
  },
  {
    tag: '#PromptEngineering',
    platform: 'all',
    volume: '780K posts',
    competitionScore: 56,
    trendingVelocity: 87,
    bestFor: 'Lead Gen',
    category: 'niche_authority',
  },
  {
    tag: '#FounderLedGrowth',
    platform: 'linkedin',
    volume: '130K posts',
    competitionScore: 29,
    trendingVelocity: 95,
    bestFor: 'Niche Authority',
    category: 'breakout',
  },
];

export const INITIAL_CONTENT_CALENDAR: ContentCalendarData = {
  calendarOverview: 'Weekly editorial plan centered on Q4 innovation sprints, Thanksgiving/Black Friday strategy prep, and executive productivity frameworks.',
  trendingNarrative: 'Audiences are moving away from surface-level AI novelty toward verified operational workflows that protect team margin.',
  themes: [
    {
      day: 'Monday',
      themeTitle: 'Mindset & Workflow Teardown',
      triggerEvent: 'Start-of-week productivity planning & executive roadmapping',
      overarchingConcept: 'Expose time-sink traps in standard social publishing and introduce batching architecture.',
      platformIdeas: {
        linkedin: {
          textHook: 'If your marketing team spent all weekend drafting social posts, your process is burning money.',
          coreAngle: 'Framework for transforming 1 weekly executive meeting into 12 multi-platform assets.',
          visualConcept: 'Executive workflow diagram showing 1 core idea branching into 3 optimized channel nodes.',
        },
        twitter: {
          tweetText: 'Stop multitasking across 4 social tabs. The top 1% content operators build in batch sprints. Here is our 90-minute Monday routine: 👇',
          visualConcept: 'Clean 16:9 infographic of the 90-minute Monday sprint timer.',
        },
        instagram: {
          captionHook: 'Monday Reset: How to plan your entire week’s social content in under 60 minutes. ⚡️ Save this guide!',
          visualConcept: 'Aesthetic minimal desk layout with coffee, tablet showing OmniPost scheduler, and soft morning sunlight.',
          format: 'Carousel',
        },
        facebook: {
          postCopy: 'What is the #1 social channel driving actual revenue for your small business right now? We noticed a massive shift from organic reach to community groups.',
          communityDiscussionPrompt: 'Share your business page below and let’s exchange feedback!',
          visualConcept: 'Warm community graphic with discussion bubble styling.',
        },
      },
    },
    {
      day: 'Tuesday',
      themeTitle: 'Tech Deep Dive & Contrarian Case',
      triggerEvent: 'Industry innovation cycle & tech announcement surge',
      overarchingConcept: 'Challenge common misconceptions around AI slop vs. strategic intelligence.',
      platformIdeas: {
        linkedin: {
          textHook: 'Why 90% of AI-generated content falls flat (and the 10% that generates $1M+ pipeline).',
          coreAngle: 'Deep analysis of algorithmic signal vs. noise in B2B enterprise buying decisions.',
          visualConcept: 'Comparison chart: Generic AI prompt output vs. Context-grounded multi-platform architecture.',
        },
        twitter: {
          tweetText: 'Unpopular opinion: "Prompt engineering" is dead. "Context orchestration" is the only skill that will matter in 2027.',
          visualConcept: 'Bold typography quote card with dark slate gradient background.',
        },
        instagram: {
          captionHook: 'Is AI making social media boring? Not if you use this 3-layer rule. 🧠 Swipe for the breakdown.',
          visualConcept: 'Vibrant neon 3D stack showing Raw Idea -> Model Intelligence -> Platform Adaptation.',
          format: 'Reels / Story',
        },
        facebook: {
          postCopy: 'Are you using AI tools in your business yet? Here are 3 tools that actually cut our team’s workload without losing our human touch.',
          communityDiscussionPrompt: 'Which AI tool has helped your daily workflow the most?',
          visualConcept: 'Crisp product screenshot grid with friendly UI badges.',
        },
      },
    },
    {
      day: 'Wednesday',
      themeTitle: 'Data Storytelling & Benchmark Reveal',
      triggerEvent: 'Midweek engagement apex across LinkedIn & Twitter feeds',
      overarchingConcept: 'Provide proprietary engagement benchmarks by format (carousels vs threads vs text).',
      platformIdeas: {
        linkedin: {
          textHook: 'We analyzed 10,000 corporate posts across 12 sectors. Here is the single highest-converting post length.',
          coreAngle: 'Statistical breakdown of engagement rates: short vs. medium vs. long-form thought leadership.',
          visualConcept: 'Clean bar graph showing engagement rate vs. character count with highlighted sweet spots.',
        },
        twitter: {
          tweetText: 'Data drop: 16:9 images on X generate 42% more bookmark saves than 1:1 square crops. Here’s why visual aspect ratio matters for CTR: 📊',
          visualConcept: 'Side-by-side aspect ratio visual comparison on mobile screen mockup.',
        },
        instagram: {
          captionHook: 'The best time to post on Instagram in 2026 isn’t when you think. Check your analytics against our latest study! 📈',
          visualConcept: 'Heatmap graphic showing peak engagement hours for Monday-Sunday.',
          format: 'Carousel',
        },
        facebook: {
          postCopy: 'Did you know that video posts still reach 2x more followers on Facebook than plain links? Here is a simple formula to turn your customer reviews into engaging visual clips.',
          communityDiscussionPrompt: 'Have you tested short videos on your business page this month?',
          visualConcept: 'Customer testimonial showcase template card.',
        },
      },
    },
    {
      day: 'Thursday',
      themeTitle: 'Tactical Playbook & Template Drop',
      triggerEvent: 'High save/bookmark velocity window',
      overarchingConcept: 'Deliver immediately actionable swipe files and prompts.',
      platformIdeas: {
        linkedin: {
          textHook: 'Steal our 5-part LinkedIn post structure that generated 1.2M impressions in 30 days (zero ad spend).',
          coreAngle: 'Step-by-step breakdown: Hook -> Tension -> Revelation -> Proof -> Invitation.',
          visualConcept: 'Infographic blueprint with color-coded anatomy of a high-performing post.',
        },
        twitter: {
          tweetText: '5 viral hook formulas you can adapt in under 30 seconds for any niche: 1. "Stop doing X..." 2. "Most people think Y, but..." 🧵👇',
          visualConcept: 'Minimalist list graphic showing the 5 hook structures.',
        },
        instagram: {
          captionHook: 'Swipe to steal our 5 favorite caption hooks! 📝 Tap "Save" so you never stare at a blank caption box again.',
          visualConcept: 'Modern pastel typography cards highlighting fill-in-the-blank hook templates.',
          format: 'Carousel',
        },
        facebook: {
          postCopy: 'Free resource for our community members: We put together a complete 7-day social media planning template. Drop "PLAN" in the comments and we’ll send the link!',
          communityDiscussionPrompt: 'Comment below to get the free Google Sheet template!',
          visualConcept: 'Preview mockup of the editorial spreadsheet template.',
        },
      },
    },
    {
      day: 'Friday',
      themeTitle: 'Behind-the-Scenes & Community Wins',
      triggerEvent: 'Casual Friday mindset & weekend wind-down',
      overarchingConcept: 'Showcase human culture, customer spotlights, and milestone celebration.',
      platformIdeas: {
        linkedin: {
          textHook: 'This week our engineering team deployed 14 model updates without a single second of downtime. Here is what we learned.',
          coreAngle: 'Transparent lessons on engineering velocity and customer feedback loops.',
          visualConcept: 'Team workspace photo or stylized illustration of developers shipping in real-time.',
        },
        twitter: {
          tweetText: 'Shipped Friday! 🚢 OmniPost AI now auto-detects trending hashtags for 24+ niches in real-time. Drop your niche and we’ll pull your top 5 tags below:',
          visualConcept: 'Product release badge with glowing emerald particles.',
        },
        instagram: {
          captionHook: 'Friday vibes at the studio! ☕️✨ Celebrating our users crossing 250,000 scheduled posts this month.',
          visualConcept: 'Aesthetic photo of team coffee mug, laptop screen, and milestone graphic.',
          format: 'Static Shot',
        },
        facebook: {
          postCopy: 'Happy Friday! We love seeing our local small business owners crush their goals. Tag a fellow entrepreneur who worked hard this week to show some love! ❤️',
          communityDiscussionPrompt: 'Give a shoutout to an entrepreneur who inspires you!',
          visualConcept: 'Festive community celebration badge.',
        },
      },
    },
  ],
};
