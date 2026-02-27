/**
 * RSS Feed Configuration
 * Education-focused sources from top-tier institutions
 * Strictly filtered for K-12 education, pedagogy, and learning science relevance
 */

export interface RSSFeedConfig {
  name: string;
  url: string;
  category: string;
  language: "en" | "zh";
  enabled: boolean;
  educationFocused: boolean; // Whether this source is primarily education-focused
  contentType?: "news" | "research"; // Type of content: news articles or research papers
}

export const RSS_FEEDS: RSSFeedConfig[] = [
  // === EDUCATION-FIRST SOURCES (High Priority) ===
  
  // K-12 Education Media (100% education-focused)
  {
    name: "EdSurge",
    url: "https://www.edsurge.com/news.rss",
    category: "AI Education",
    language: "en",
    enabled: true,
    educationFocused: true,
  },
  {
    name: "eSchool News",
    url: "https://www.eschoolnews.com/feed/",
    category: "AI Education",
    language: "en",
    enabled: true,
    educationFocused: true,
  },
  {
    name: "THE Journal",
    url: "https://thejournal.com/rss-feeds/news.aspx",
    category: "AI Education",
    language: "en",
    enabled: true,
    educationFocused: true,
  },
  {
    name: "Edutopia",
    url: "https://www.edutopia.org/rss.xml",
    category: "Human Skills",
    language: "en",
    enabled: true,
    educationFocused: true,
  },
  {
    name: "TeachThought",
    url: "https://www.teachthought.com/feed/",
    category: "Human Skills",
    language: "en",
    enabled: true,
    educationFocused: true,
  },
  {
    name: "Cult of Pedagogy",
    url: "https://www.cultofpedagogy.com/feed/",
    category: "Human Skills",
    language: "en",
    enabled: true,
    educationFocused: true,
  },
  
  // Education Organizations
  {
    name: "ISTE",
    url: "https://www.iste.org/feed",
    category: "AI Education",
    language: "en",
    enabled: true,
    educationFocused: true,
  },
  {
    name: "ASCD",
    url: "https://www.ascd.org/rss",
    category: "Human Skills",
    language: "en",
    enabled: true,
    educationFocused: true,
  },
  
  // STEM Education Platforms
  {
    name: "Code.org",
    url: "https://code.org/feed.xml",
    category: "AI Education",
    language: "en",
    enabled: true,
    educationFocused: true,
  },
  {
    name: "Khan Academy Blog",
    url: "https://blog.khanacademy.org/rss/",
    category: "AI Education",
    language: "en",
    enabled: true,
    educationFocused: true,
  },
  
  // Education Policy & Research
  {
    name: "Education Week",
    url: "https://www.edweek.org/rss/blogs.xml",
    category: "Policy & Ethics",
    language: "en",
    enabled: true,
    educationFocused: true,
  },
  {
    name: "Brookings Education",
    url: "https://www.brookings.edu/topic/education/feed/",
    category: "Policy & Ethics",
    language: "en",
    enabled: true,
    educationFocused: true,
  },
  
  // === UNIVERSITIES (Education Schools & Research) ===
  
  // Harvard Graduate School of Education
  {
    name: "Harvard GSE",
    url: "https://www.gse.harvard.edu/news/rss.xml",
    category: "AI Education",
    language: "en",
    enabled: true,
    educationFocused: true,
  },
  
  // Stanford HAI (Human-Centered AI Institute - has education focus)
  {
    name: "Stanford HAI",
    url: "https://hai.stanford.edu/news/rss.xml",
    category: "AI Education",
    language: "en",
    enabled: true,
    educationFocused: false, // Mixed content, will need filtering
  },
  
  // MIT News - AI (some education content)
  {
    name: "MIT News - AI",
    url: "https://news.mit.edu/topic/mitartificial-intelligence2-rss.xml",
    category: "AI Education",
    language: "en",
    enabled: true,
    educationFocused: false, // Mixed content, will need filtering
  },
  
  // CMU Robotics (some education applications)
  {
    name: "CMU Robotics Institute",
    url: "https://www.ri.cmu.edu/feed/",
    category: "Robotics",
    language: "en",
    enabled: true,
    educationFocused: false, // Mixed content, will need filtering
  },
  
  // === AI COMPANIES (Filtered for education applications) ===
  
  // OpenAI (has education initiatives)
  {
    name: "OpenAI Blog",
    url: "https://openai.com/blog/rss.xml",
    category: "AI Education",
    language: "en",
    enabled: true,
    educationFocused: false, // Mixed content, will need filtering
  },
  
  // === CHINESE SOURCES ===
  
  // Chinese Universities
  // Chinese Universities (Disabled - RSS feeds not working)
  {
    name: "清华大学新闻网",
    url: "https://news.tsinghua.edu.cn/rss/yw.xml",
    category: "AI Education",
    language: "zh",
    enabled: false, // RSS feed not working
    educationFocused: false,
  },
  {
    name: "北京大学新闻网",
    url: "https://news.pku.edu.cn/rss.jsp",
    category: "AI Education",
    language: "zh",
    enabled: false, // RSS feed not working
    educationFocused: false,
  },
  {
    name: "复旦大学新闻网",
    url: "https://news.fudan.edu.cn/rss/",
    category: "AI Education",
    language: "zh",
    enabled: false, // RSS feed not working
    educationFocused: false,
  },
  {
    name: "上海交通大学新闻网",
    url: "https://news.sjtu.edu.cn/rss.xml",
    category: "AI Education",
    language: "zh",
    enabled: false, // RSS feed not working
    educationFocused: false,
  },
  
  // Chinese Education Media (100% education-focused)
  {
    name: "中国教育新闻网",
    url: "http://www.jyb.cn/rss/jyb.xml",
    category: "AI Education",
    language: "zh",
    enabled: true,
    educationFocused: true,
    contentType: "news",
  },
  {
    name: "芥末堆",
    url: "https://www.jiemodui.com/feed",
    category: "AI Education",
    language: "zh",
    enabled: false, // Disabled due to 404 error
    educationFocused: true,
  },
  {
    name: "多知网",
    url: "https://www.duozhi.com/rss.xml",
    category: "AI Education",
    language: "zh",
    enabled: false, // Disabled due to connection error
    educationFocused: true,
  },
  
  // === DISABLED SOURCES (Not education-focused enough) ===
  
  // Pure tech research - disabled
  {
    name: "Berkeley AI Research",
    url: "https://bair.berkeley.edu/blog/feed.xml",
    category: "AI Education",
    language: "en",
    enabled: false, // Pure research, rarely education-related
    educationFocused: false,
  },
  {
    name: "Google DeepMind",
    url: "https://deepmind.google/blog/rss.xml",
    category: "AI Education",
    language: "en",
    enabled: false, // Pure research, rarely education-related
    educationFocused: false,
  },
  {
    name: "Anthropic News",
    url: "https://www.anthropic.com/news/rss.xml",
    category: "AI Education",
    language: "en",
    enabled: false, // Company news, not education-focused
    educationFocused: false,
  },
  {
    name: "Meta AI Research",
    url: "https://ai.meta.com/blog/rss/",
    category: "AI Education",
    language: "en",
    enabled: false, // Pure research, rarely education-related
    educationFocused: false,
  },
  {
    name: "Microsoft Research",
    url: "https://www.microsoft.com/en-us/research/feed/",
    category: "AI Education",
    language: "en",
    enabled: false, // Pure research, rarely education-related
    educationFocused: false,
  },
  {
    name: "Google AI Blog",
    url: "https://blog.google/technology/ai/rss/",
    category: "AI Education",
    language: "en",
    enabled: false, // Product announcements, not education-focused
    educationFocused: false,
  },
  {
    name: "IBM Research",
    url: "https://research.ibm.com/blog/rss",
    category: "AI Education",
    language: "en",
    enabled: false, // Pure research, rarely education-related
    educationFocused: false,
  },
  {
    name: "NVIDIA AI",
    url: "https://blogs.nvidia.com/feed/",
    category: "AI Education",
    language: "en",
    enabled: false, // Product/business news, not education-focused
    educationFocused: false,
  },
  
  // Pure robotics business - disabled
  {
    name: "IEEE Spectrum Robotics",
    url: "https://spectrum.ieee.org/feeds/robotics.rss",
    category: "Robotics",
    language: "en",
    enabled: false, // Industry news, rarely education-related
    educationFocused: false,
  },
  {
    name: "Robotics Business Review",
    url: "https://www.roboticsbusinessreview.com/feed/",
    category: "Robotics",
    language: "en",
    enabled: false, // Business news, not education-focused
    educationFocused: false,
  },
  
  // Chinese tech media - disabled (not education-focused)
  {
    name: "机器之心",
    url: "https://www.jiqizhixin.com/rss",
    category: "AI Education",
    language: "zh",
    enabled: false, // AI tech news, rarely education-related
    educationFocused: false,
  },
  {
    name: "量子位",
    url: "https://www.qbitai.com/feed",
    category: "AI Education",
    language: "zh",
    enabled: false, // AI tech news, rarely education-related
    educationFocused: false,
  },
  {
    name: "AI科技评论",
    url: "https://www.leiphone.com/category/ai/feed",
    category: "AI Education",
    language: "zh",
    enabled: false, // Tech reviews, not education-focused
    educationFocused: false,
  },
  {
    name: "36氪教育",
    url: "https://36kr.com/feed/education",
    category: "AI Education",
    language: "zh",
    enabled: false, // Business/startup news, disabled due to 404
    educationFocused: false,
  },
  
  // === RESEARCH PAPER SOURCES (Frontier Research) ===
  
  // arXiv preprints
  {
    name: "arXiv - AI",
    url: "http://export.arxiv.org/rss/cs.AI",
    category: "AI Education",
    language: "en",
    enabled: false, // Disabled: unpublished preprints, quality varies
    educationFocused: false,
    contentType: "research",
  },
  {
    name: "arXiv - Machine Learning",
    url: "http://export.arxiv.org/rss/cs.LG",
    category: "AI Education",
    language: "en",
    enabled: false, // Disabled: unpublished preprints, quality varies
    educationFocused: false,
    contentType: "research",
  },
  {
    name: "arXiv - Human-Computer Interaction",
    url: "http://export.arxiv.org/rss/cs.HC",
    category: "Human Skills",
    language: "en",
    enabled: false, // Disabled: unpublished preprints, quality varies
    educationFocused: false,
    contentType: "research",
  },
  {
    name: "arXiv - Robotics",
    url: "http://export.arxiv.org/rss/cs.RO",
    category: "Robotics",
    language: "en",
    enabled: false, // Disabled: unpublished preprints, quality varies
    educationFocused: false,
    contentType: "research",
  },
  
  // US News Education Top 30 Universities Research
  {
    name: "Stanford HAI Research",
    url: "https://hai.stanford.edu/news/rss.xml",
    category: "AI Education",
    language: "en",
    enabled: true,
    educationFocused: false,
    contentType: "research",
  },
  {
    name: "Harvard GSE Research",
    url: "https://www.gse.harvard.edu/news/rss.xml",
    category: "AI Education",
    language: "en",
    enabled: true,
    educationFocused: false,
    contentType: "research",
  },
  {
    name: "UPenn GSE Research",
    url: "https://www.gse.upenn.edu/news/rss",
    category: "AI Education",
    language: "en",
    enabled: true,
    educationFocused: false,
    contentType: "research",
  },
  {
    name: "Berkeley AI Research",
    url: "https://bair.berkeley.edu/blog/feed.xml",
    category: "AI Education",
    language: "en",
    enabled: true,
    educationFocused: false,
    contentType: "research",
  },
  {
    name: "Columbia Teachers College",
    url: "https://www.tc.columbia.edu/news/rss.xml",
    category: "AI Education",
    language: "en",
    enabled: true,
    educationFocused: false,
    contentType: "research",
  },
  {
    name: "Northwestern Learning Sciences",
    url: "https://www.sesp.northwestern.edu/news/rss.xml",
    category: "AI Education",
    language: "en",
    enabled: true,
    educationFocused: false,
    contentType: "research",
  },
  {
    name: "Vanderbilt Peabody College",
    url: "https://peabody.vanderbilt.edu/news/rss.xml",
    category: "AI Education",
    language: "en",
    enabled: true,
    educationFocused: false,
    contentType: "research",
  },
  {
    name: "Johns Hopkins Education",
    url: "https://education.jhu.edu/news/rss",
    category: "AI Education",
    language: "en",
    enabled: true,
    educationFocused: false,
    contentType: "research",
  },
  {
    name: "NYU Steinhardt",
    url: "https://steinhardt.nyu.edu/news/rss",
    category: "AI Education",
    language: "en",
    enabled: true,
    educationFocused: false,
    contentType: "research",
  },
  {
    name: "Wisconsin-Madison Education",
    url: "https://education.wisc.edu/news/feed/",
    category: "AI Education",
    language: "en",
    enabled: true,
    educationFocused: false,
    contentType: "research",
  },
  {
    name: "Michigan Education",
    url: "https://soe.umich.edu/news-events/news/rss.xml",
    category: "AI Education",
    language: "en",
    enabled: true,
    educationFocused: false,
    contentType: "research",
  },
];

// Education-related keywords for content filtering
export const EDUCATION_KEYWORDS = {
  en: [
    "education", "learning", "teaching", "teacher", "student", "classroom", 
    "school", "university", "college", "curriculum", "pedagogy", "k-12", 
    "k12", "edtech", "educational", "instruction", "training", "course",
    "lesson", "academic", "literacy", "skills development", "stem education",
    "coding education", "robotics education", "ai literacy", "digital literacy",
    "personalized learning", "adaptive learning", "learning science",
    "educational technology", "instructional design", "assessment",
    "homework", "exam", "grade", "professor", "faculty", "campus"
  ],
  zh: [
    "教育", "学习", "教学", "教师", "学生", "课堂", "学校", "大学", 
    "课程", "教学法", "基础教育", "高等教育", "职业教育", "在线教育",
    "教育科技", "智慧教育", "个性化学习", "自适应学习", "教学设计",
    "教学研究", "教育改革", "素质教育", "创新教育", "实践教学",
    "教育信息化", "数字化教学", "混合式教学", "翻转课堂", "慕课",
    "教育资源", "教学质量", "人才培养", "教育公平", "教育评价",
    "作业", "考试", "成绩", "教授", "师生", "校园", "育人"
  ]
};

export function getEnabledFeeds(): RSSFeedConfig[] {
  return RSS_FEEDS.filter(feed => feed.enabled);
}

export function getFeedCount(): number {
  return RSS_FEEDS.filter(feed => feed.enabled).length;
}

export function getFeedsByLanguage(language: "en" | "zh"): RSSFeedConfig[] {
  return RSS_FEEDS.filter(feed => feed.enabled && feed.language === language);
}

export function getFeedsByCategory(category: string): RSSFeedConfig[] {
  return RSS_FEEDS.filter(feed => feed.enabled && feed.category === category);
}

export function isEducationRelated(title: string, description: string, language: "en" | "zh"): boolean {
  const text = `${title} ${description}`.toLowerCase();
  const keywords = EDUCATION_KEYWORDS[language];
  
  // Check if any education keyword is present
  return keywords.some(keyword => text.includes(keyword.toLowerCase()));
}
