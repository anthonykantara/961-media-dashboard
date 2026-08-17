import React, { useState } from 'react';
import { Save, Check } from 'lucide-react';

type PromptType = 'main_article' | 'headline' | 'seo' | 'social_captions' | 'ideas' | 'translations';

const DEFAULT_PROMPTS: Record<PromptType, string> = {
  main_article: `You are an expert AI journalist and content strategist writing for The961, Lebanon's leading English-language digital news and media platform.

### BRAND VOICE & TONAL GUIDELINES:
- Tone: Engaging, objective, modern, culturally aware, and polished.
- Audience: Lebanese diaspora, local residents, and international readers interested in Lebanon, Middle Eastern culture, lifestyle, and news.
- Language: Contemporary American English with correct Lebanese place name transliterations.
- Style Rules:
  1. Write short, punchy paragraphs (2-3 sentences max).
  2. Avoid jargon or generic buzzwords.
  3. Maintain strict factual neutrality for news articles; use dynamic, welcoming language for lifestyle/travel pieces.
  4. Never use ALL-CAPS headings. Use standard Title Case or Sentence case.

### FORMATTING INSTRUCTIONS:
- Always structure the output in clean Markdown.
- Include a compelling headline (H1) and a 1-sentence SEO meta description.
- Use subheadings (H2, H3) to break up long sections.`,

  headline: `Generate 5 viral yet journalistic headlines for an article about {article_title} in the {category} section. Ensure headlines are under 70 characters and follow The961 editorial style.`,

  seo: `Write a high-CTR SEO meta description (under 155 characters) and 5 relevant search tags for an article titled "{article_title}".`,

  social_captions: `Write 3 engaging social media captions for Instagram, Facebook, and X (Twitter) summarizing the article "{article_title}". Include relevant hashtags and a call-to-action to read more on The961.com.`,

  ideas: `Brainstorm 10 trending article ideas, story angles, and investigative topics focused on Lebanese culture, technology, food, lifestyle, or economic news for the upcoming month.`,

  translations: `Translate the provided Arabic or French text into fluent, modern American English while preserving journalistic nuances, cultural context, and proper Lebanese place name transliterations.`
};

export default function AIPromptsPage() {
  const [selectedPromptType, setSelectedPromptType] = useState<PromptType>('main_article');
  const [prompts, setPrompts] = useState<Record<PromptType, string>>(() => {
    try {
      const saved = localStorage.getItem('961_ai_prompts');
      return saved ? { ...DEFAULT_PROMPTS, ...JSON.parse(saved) } : DEFAULT_PROMPTS;
    } catch {
      return DEFAULT_PROMPTS;
    }
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handlePromptChange = (value: string) => {
    setPrompts(prev => ({
      ...prev,
      [selectedPromptType]: value
    }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem('961_ai_prompts', JSON.stringify(prompts));
    } catch (e) {
      console.error('Failed to save prompts to localStorage:', e);
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">AI Prompts</h1>
        
        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 bg-[#FF0000] hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Prompt saved successfully!</span>
        </div>
      )}

      {/* Dropdown Selector */}
      <div>
        <select
          value={selectedPromptType}
          onChange={(e) => setSelectedPromptType(e.target.value as PromptType)}
          className="w-full sm:w-72 p-3 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-primary transition-colors cursor-pointer"
        >
          <option value="main_article">Main Article</option>
          <option value="headline">Headline</option>
          <option value="seo">SEO</option>
          <option value="social_captions">Social Captions</option>
          <option value="ideas">Ideas</option>
          <option value="translations">Translations</option>
        </select>
      </div>

      {/* Long Input Field */}
      <div>
        <textarea
          value={prompts[selectedPromptType]}
          onChange={(e) => handlePromptChange(e.target.value)}
          rows={18}
          className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:border-primary focus:outline-none text-xs font-mono text-gray-900 leading-relaxed resize-y custom-scrollbar"
          placeholder="Enter prompt instructions here..."
        />
      </div>
    </div>
  );
}
