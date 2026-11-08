import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '20mb' }));

// Shared Google GenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Helper to check AI availability
function ensureAI(res: express.Response) {
  if (!ai || !apiKey) {
    res.status(503).json({
      error: 'GEMINI_API_KEY is not configured. Please verify your API key in Settings > Secrets.',
    });
    return false;
  }
  return true;
}

// 1. Cross-Platform Content Generation Endpoint
app.post('/api/generate-content', async (req, res) => {
  try {
    const {
      idea,
      tone = 'professional',
      industry = 'Technology & AI',
      targetAudience = 'Professionals & Decision Makers',
      keyPoints = '',
      includeThread = true,
      includeCarousel = true,
    } = req.body;

    if (!idea || typeof idea !== 'string') {
      return res.status(400).json({ error: 'Please provide an idea to generate content.' });
    }

    if (!ensureAI(res)) return;

    const systemPrompt = `You are OmniPost AI, an elite social media strategist and content copywriter specializing in high-performing cross-platform campaigns.
You are tasked with taking an idea, tone, industry, and target audience, and simultaneously drafting tailored posts for:
1. LinkedIn (long-form thought leadership, clean spacing, magnetic hook, structured takeaways, thought-provoking conversation starter)
2. Twitter/X (short & punchy single tweet under 280 characters, plus an engaging 3-tweet thread breakdown)
3. Instagram (high-engagement caption, hook, clear value, call-to-action, structured hashtag bundle, and 3-slide visual carousel script)

For each platform, provide an explicit, highly detailed image generation prompt tailored to that platform's visual identity and optimal aspect ratio:
- LinkedIn: 4:3 or 1:1 professional editorial visual, clean minimalist diagram, executive concept art, or modern business aesthetic.
- Twitter/X: 16:9 punchy, cinematic, high-contrast, attention-grabbing banner graphic.
- Instagram: 1:1 or 9:16 aesthetic, lifestyle/studio photography, vibrant lighting, modern 3D or editorial visual.

Respond strictly in valid JSON matching the requested schema.`;

    const userPrompt = `Input Idea: "${idea}"
Tone: ${tone}
Industry: ${industry}
Target Audience: ${targetAudience}
${keyPoints ? `Key Points / Highlights: ${keyPoints}` : ''}
Include Thread for Twitter: ${includeThread}
Include Carousel for Instagram: ${includeCarousel}

Create high-impact, platform-optimized copy and tailored image prompts for LinkedIn, Twitter/X, and Instagram.`;

    // Use gemini-3.8-flash for general multi-platform generation (or gemini-4-argon for complex tasks)
    const response = await ai!.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strategySummary: {
              type: Type.STRING,
              description: 'A 2-sentence summary of the positioning strategy across platforms.',
            },
            linkedin: {
              type: Type.OBJECT,
              properties: {
                hook: { type: Type.STRING },
                body: { type: Type.STRING, description: 'Complete LinkedIn post with line breaks and formatting' },
                callToAction: { type: Type.STRING },
                hashtags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '3-5 targeted hashtags',
                },
                optimalAspectRatio: { type: Type.STRING, description: 'e.g. 4:3' },
                imagePrompt: { type: Type.STRING, description: 'Detailed prompt for LinkedIn image' },
                estimatedReadTime: { type: Type.STRING },
              },
              required: ['hook', 'body', 'callToAction', 'hashtags', 'optimalAspectRatio', 'imagePrompt'],
            },
            twitter: {
              type: Type.OBJECT,
              properties: {
                singlePost: { type: Type.STRING, description: 'Under 280 characters hook + takeaway + CTA' },
                thread: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '3 sequential tweets expanding on the idea',
                },
                hashtags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '1-2 high-impact hashtags',
                },
                optimalAspectRatio: { type: Type.STRING, description: 'e.g. 16:9' },
                imagePrompt: { type: Type.STRING, description: 'Detailed prompt for Twitter/X image' },
                hookRating: { type: Type.STRING, description: 'Score out of 10 with brief rationale' },
              },
              required: ['singlePost', 'thread', 'hashtags', 'optimalAspectRatio', 'imagePrompt'],
            },
            instagram: {
              type: Type.OBJECT,
              properties: {
                openingHook: { type: Type.STRING },
                caption: { type: Type.STRING, description: 'Full Instagram caption with line breaks and emojis' },
                callToAction: { type: Type.STRING },
                carouselSlides: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      slideNumber: { type: Type.INTEGER },
                      headline: { type: Type.STRING },
                      subtext: { type: Type.STRING },
                    },
                    required: ['slideNumber', 'headline', 'subtext'],
                  },
                },
                hashtagBundle: {
                  type: Type.OBJECT,
                  properties: {
                    broad: { type: Type.ARRAY, items: { type: Type.STRING } },
                    niche: { type: Type.ARRAY, items: { type: Type.STRING } },
                    trending: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['broad', 'niche', 'trending'],
                },
                optimalAspectRatio: { type: Type.STRING, description: 'e.g. 1:1 or 9:16' },
                imagePrompt: { type: Type.STRING, description: 'Detailed prompt for Instagram visual' },
              },
              required: ['openingHook', 'caption', 'callToAction', 'hashtagBundle', 'optimalAspectRatio', 'imagePrompt'],
            },
            recommendedPostTimes: {
              type: Type.OBJECT,
              properties: {
                linkedin: { type: Type.STRING },
                twitter: { type: Type.STRING },
                instagram: { type: Type.STRING },
                rationale: { type: Type.STRING },
              },
              required: ['linkedin', 'twitter', 'instagram', 'rationale'],
            },
          },
          required: ['strategySummary', 'linkedin', 'twitter', 'instagram', 'recommendedPostTimes'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate cross-platform content.' });
  }
});

// 2. Image Generation Endpoint with model selection & size affordance
app.post('/api/generate-image', async (req, res) => {
  try {
    const {
      prompt,
      aspectRatio = '1:1',
      imageSize = '1K', // "1K", "2K", "4K"
      model = 'gemini-3-pro-image-preview', // User text block requirement: gemini-3-pro-image-preview or gemini-nano-banana-2.1
    } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Please provide an image prompt.' });
    }

    if (!ensureAI(res)) return;

    // Supported aspect ratios in GenAI SDK: "1:1", "3:4", "4:3", "9:16", "16:9", plus "1:4", "1:8", "4:1", "8:1"
    // Normalize custom ratios if needed
    const validRatios = ['1:1', '3:4', '4:3', '9:16', '16:9', '1:4', '1:8', '4:1', '8:1'];
    let chosenRatio = aspectRatio;
    if (aspectRatio === '2:3') chosenRatio = '3:4';
    if (aspectRatio === '3:2') chosenRatio = '4:3';
    if (aspectRatio === '21:9') chosenRatio = '16:9';
    if (!validRatios.includes(chosenRatio)) chosenRatio = '1:1';

    // Model selection preference
    const candidateModels = [
      model,
      'gemini-3-pro-image-preview',
      'gemini-3-pro-image',
      'gemini-nano-banana-2.1',
      'gemini-3.1-flash-lite-image',
    ];

    // Remove duplicates
    const uniqueModels = Array.from(new Set(candidateModels));

    let lastError: any = null;
    let generatedImageUrl = '';
    let usedModel = '';

    for (const modelToTry of uniqueModels) {
      try {
        console.log(`Attempting image generation with model: ${modelToTry}, ratio: ${chosenRatio}, size: ${imageSize}`);
        
        const config: any = {
          imageConfig: {
            aspectRatio: chosenRatio,
          },
        };

        // Nano banana and pro image support imageSize ("1K", "2K", "4K")
        if (modelToTry !== 'gemini-3.1-flash-lite-image') {
          config.imageConfig.imageSize = imageSize;
        }

        const response = await ai!.models.generateContent({
          model: modelToTry,
          contents: {
            parts: [{ text: prompt }],
          },
          config,
        });

        const parts = response.candidates?.[0]?.content?.parts ?? [];
        for (const part of parts) {
          if (part.inlineData?.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
            usedModel = modelToTry;
            break;
          }
        }

        if (generatedImageUrl) {
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${modelToTry} image generation attempt failed:`, err?.message);
        lastError = err;
      }
    }

    if (generatedImageUrl) {
      return res.json({
        success: true,
        imageUrl: generatedImageUrl,
        modelUsed: usedModel,
        aspectRatio: chosenRatio,
        imageSize,
      });
    }

    // If API returned no image (e.g. rate limit, preview region issue), return a fallback high-quality placeholder with notice
    return res.status(500).json({
      error: lastError?.message || 'Failed to generate image with Gemini models.',
      details: lastError?.toString(),
    });
  } catch (error: any) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: error?.message || 'Image generation failed.' });
  }
});

// 3. Hashtag Research Tool Endpoint with Trending Data
app.post('/api/hashtag-research', async (req, res) => {
  try {
    const { industry = 'Technology & AI', niche = '', keyword = '' } = req.body;
    if (!ensureAI(res)) return;

    const prompt = `Act as an expert social media discoverability algorithm researcher.
Analyze current trending hashtags, competition levels, and search volume for:
Industry: "${industry}"
${niche ? `Specific Niche: "${niche}"` : ''}
${keyword ? `Seed Keyword: "${keyword}"` : ''}

Provide a curated list of 16-24 top hashtags categorized into:
- Breakout & High-Growth (fast-rising)
- Industry Core (steady high volume)
- Niche Authority (low competition, high conversion)
- Platform-Specific recommendations (LinkedIn vs Instagram vs Twitter)

For each hashtag provide:
- tag (including '#')
- platform: "linkedin" | "twitter" | "instagram" | "all"
- volume: estimate label (e.g. "1.4M posts", "480K posts", "85K posts")
- competitionScore: number 1-100 (100 = saturated, 20 = easy to rank)
- trendingVelocity: number 1-100 (% weekly growth)
- bestFor: "Broad Reach" | "Lead Gen" | "Engagement" | "Community Building" | "Niche Discovery"
- category: "breakout" | "industry_core" | "niche_authority"`;

    const response = await ai!.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            industryOverview: { type: Type.STRING },
            topTrendingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            hashtags: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  tag: { type: Type.STRING },
                  platform: { type: Type.STRING },
                  volume: { type: Type.STRING },
                  competitionScore: { type: Type.INTEGER },
                  trendingVelocity: { type: Type.INTEGER },
                  bestFor: { type: Type.STRING },
                  category: { type: Type.STRING },
                },
                required: ['tag', 'platform', 'volume', 'competitionScore', 'trendingVelocity', 'bestFor', 'category'],
              },
            },
            nicheRecommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  platform: { type: Type.STRING },
                  bestPractice: { type: Type.STRING },
                  recommendedCount: { type: Type.STRING },
                },
                required: ['platform', 'bestPractice', 'recommendedCount'],
              },
            },
          },
          required: ['industryOverview', 'topTrendingKeywords', 'hashtags', 'nicheRecommendations'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error in hashtag research:', error);
    res.status(500).json({ error: error?.message || 'Hashtag research failed.' });
  }
});

// 4. AI-Powered Content Calendar (Themes, Holidays, Industry Events, Cross-Platform Post Ideas)
app.post('/api/generate-content-calendar', async (req, res) => {
  try {
    const { industry = 'Technology & AI', timeframe = 'weekly', targetAudience = 'Tech enthusiasts and B2B leaders' } = req.body;
    if (!ensureAI(res)) return;

    const prompt = `You are a visionary content planner and trend forecaster.
Current date reference: November 2026.
Generate a structured ${timeframe} AI Content Calendar for the "${industry}" sector targeting "${targetAudience}".

Analyze:
1. Upcoming holidays, seasonal milestones, and cultural moments.
2. Relevant industry events, conferences, product release seasons, and macro market cycles.
3. Current trending discourse and themes.

For each day/theme (generate 5-7 distinct day themes), provide:
- day: e.g. "Monday", "Tuesday", etc.
- themeTitle: Catchy theme (e.g. "Tech Teardown Tuesday", "Contrarian Industry Insights", "Founder Lessons")
- triggerEvent: Specific holiday, upcoming event, or industry trend backing this theme
- overarchingConcept: The strategic narrative
- platformIdeas:
  - linkedin: { textHook: string, coreAngle: string, visualConcept: string }
  - twitter: { tweetText: string, visualConcept: string }
  - instagram: { captionHook: string, visualConcept: string, format: "Reels / Story" | "Carousel" | "Static Shot" }
  - facebook: { postCopy: string, communityDiscussionPrompt: string, visualConcept: string }`;

    const response = await ai!.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            calendarOverview: { type: Type.STRING },
            trendingNarrative: { type: Type.STRING },
            themes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  themeTitle: { type: Type.STRING },
                  triggerEvent: { type: Type.STRING },
                  overarchingConcept: { type: Type.STRING },
                  platformIdeas: {
                    type: Type.OBJECT,
                    properties: {
                      linkedin: {
                        type: Type.OBJECT,
                        properties: {
                          textHook: { type: Type.STRING },
                          coreAngle: { type: Type.STRING },
                          visualConcept: { type: Type.STRING },
                        },
                        required: ['textHook', 'coreAngle', 'visualConcept'],
                      },
                      twitter: {
                        type: Type.OBJECT,
                        properties: {
                          tweetText: { type: Type.STRING },
                          visualConcept: { type: Type.STRING },
                        },
                        required: ['tweetText', 'visualConcept'],
                      },
                      instagram: {
                        type: Type.OBJECT,
                        properties: {
                          captionHook: { type: Type.STRING },
                          visualConcept: { type: Type.STRING },
                          format: { type: Type.STRING },
                        },
                        required: ['captionHook', 'visualConcept', 'format'],
                      },
                      facebook: {
                        type: Type.OBJECT,
                        properties: {
                          postCopy: { type: Type.STRING },
                          communityDiscussionPrompt: { type: Type.STRING },
                          visualConcept: { type: Type.STRING },
                        },
                        required: ['postCopy', 'communityDiscussionPrompt', 'visualConcept'],
                      },
                    },
                    required: ['linkedin', 'twitter', 'instagram', 'facebook'],
                  },
                },
                required: ['day', 'themeTitle', 'triggerEvent', 'overarchingConcept', 'platformIdeas'],
              },
            },
          },
          required: ['calendarOverview', 'trendingNarrative', 'themes'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating content calendar:', error);
    res.status(500).json({ error: error?.message || 'Content calendar generation failed.' });
  }
});

// 5. AI Post Scheduler & Optimal Audience Activity Analysis
app.post('/api/schedule-analysis', async (req, res) => {
  try {
    const { industry = 'Technology & AI', timezone = 'UTC-5 (EST)' } = req.body;
    if (!ensureAI(res)) return;

    const prompt = `Analyze peak audience engagement patterns and optimal publishing windows for the "${industry}" sector in the "${timezone}" timezone.
Generate a daily engagement heat map (Monday through Sunday, morning, afternoon, evening windows) and concrete recommended time slots for LinkedIn, Twitter/X, and Instagram.`;

    const response = await ai!.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            bestDaysOverall: { type: Type.ARRAY, items: { type: Type.STRING } },
            platformSchedules: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  platform: { type: Type.STRING },
                  primaryWindow: { type: Type.STRING },
                  secondaryWindow: { type: Type.STRING },
                  peakDay: { type: Type.STRING },
                  expectedLift: { type: Type.STRING },
                  reasoning: { type: Type.STRING },
                },
                required: ['platform', 'primaryWindow', 'secondaryWindow', 'peakDay', 'expectedLift', 'reasoning'],
              },
            },
            upcomingSlots: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING },
                  time: { type: Type.STRING },
                  platform: { type: Type.STRING },
                  confidenceScore: { type: Type.INTEGER },
                  contextNote: { type: Type.STRING },
                },
                required: ['date', 'time', 'platform', 'confidenceScore', 'contextNote'],
              },
            },
          },
          required: ['summary', 'bestDaysOverall', 'platformSchedules', 'upcomingSlots'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error in schedule analysis:', error);
    res.status(500).json({ error: error?.message || 'Schedule analysis failed.' });
  }
});

// 5. Quick AI Refinement (using fast model gemini-3.1-flash-lite)
app.post('/api/refine-text', async (req, res) => {
  try {
    const { text, instruction = 'make it punchier', platform = 'linkedin' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required.' });
    }
    if (!ensureAI(res)) return;

    // Use fast model gemini-3.1-flash-lite for rapid text edits
    const response = await ai!.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: `You are an expert social media editor for ${platform}.
Instruction: "${instruction}"
Current text:
"""
${text}
"""
Rewrite the text to fulfill the instruction while maintaining brand voice and formatting. Return ONLY the rewritten text with no introductory pleasantries or meta commentary.`,
    });

    res.json({ success: true, text: response.text?.trim() || text });
  } catch (error: any) {
    console.error('Error refining text:', error);
    res.status(500).json({ error: error?.message || 'Refinement failed.' });
  }
});

// 6. Deep Content Optimization / Complex Analysis (gemini-4-argon)
app.post('/api/deep-analysis', async (req, res) => {
  try {
    const { content, platform = 'linkedin', industry = 'Tech' } = req.body;
    if (!content) return res.status(400).json({ error: 'Content is required.' });
    if (!ensureAI(res)) return;

    const prompt = `Perform an advanced behavioral psychology and algorithm audit on this ${platform} post for the ${industry} industry:
"""
${content}
"""
Analyze:
1. Hook magnetism score (1-100) and cognitive trigger breakdown
2. Dwell-time optimization (formatting, scroll-stopping rhythm)
3. Shareability coefficient (why people will repost or save)
4. Weak sentence flags and concrete higher-converting rewrites
5. Predicted viral potential rating (Low / Moderate / High / Viral Breakthrough)`;

    const response = await ai!.models.generateContent({
      model: 'gemini-4-argon',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hookScore: { type: Type.INTEGER },
            dwellTimeScore: { type: Type.INTEGER },
            shareabilityScore: { type: Type.INTEGER },
            viralPotential: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvementSuggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  improved: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ['original', 'improved', 'reason'],
              },
            },
            finalRecommendation: { type: Type.STRING },
          },
          required: ['hookScore', 'dwellTimeScore', 'shareabilityScore', 'viralPotential', 'strengths', 'improvementSuggestions', 'finalRecommendation'],
        },
      },
    });

    res.json({ success: true, data: JSON.parse(response.text || '{}') });
  } catch (error: any) {
    console.error('Error in deep analysis:', error);
    res.status(500).json({ error: error?.message || 'Deep analysis failed.' });
  }
});

// Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 OmniPost AI Server running on port ${PORT}`);
  });
}

startServer();
