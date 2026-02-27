/**
 * RSS Feed Configuration
 * Top-tier research institutions and industry leaders
 */

export interface RSSFeedConfig {
  name: string;
  url: string;
  category: string;
  language: "en" | "zh";
  enabled: boolean;
}

export const RSS_FEEDS: RSSFeedConfig[] = [
  // Stanford University
  {
    name: "Stanford HAI",
    url: "https://hai.stanford.edu/news/rss.xml",
    category: "AI Education",
    language: "en",
    enabled: true,
  },
  
  // MIT
  {
    name: "MIT News - AI",
    url: "https://news.mit.edu/topic/mitartificial-intelligence2-rss.xml",
    category: "AI Education",
    language: "en",
    enabled: true,
  },
  {
    name: "MIT CSAIL",
    url: "https://www.csail.mit.edu/news/rss.xml",
    category: "AI Education",
    language: "en",
    enabled: true,
  },
  
  // Harvard
  {
    name: "Harvard GSE",
    url: "https://www.gse.harvard.edu/news/rss.xml",
    category: "AI Education",
    language: "en",
    enabled: true,
  },
  
  // Carnegie Mellon
  {
    name: "CMU Robotics Institute",
    url: "https://www.ri.cmu.edu/feed/",
    category: "Robotics",
    language: "en",
    enabled: true,
  },
  
  // UC Berkeley
  {
    name: "Berkeley AI Research",
    url: "https://bair.berkeley.edu/blog/feed.xml",
    category: "AI Education",
    language: "en",
    enabled: true,
  },
  
  // OpenAI
  {
    name: "OpenAI Blog",
    url: "https://openai.com/blog/rss.xml",
    category: "AI Education",
    language: "en",
    enabled: true,
  },
  
  // DeepMind
  {
    name: "Google DeepMind",
    url: "https://deepmind.google/blog/rss.xml",
    category: "AI Education",
    language: "en",
    enabled: true,
  },
  
  // Anthropic
  {
    name: "Anthropic News",
    url: "https://www.anthropic.com/news/rss.xml",
    category: "AI Education",
    language: "en",
    enabled: true,
  },
  
  // More Universities
  {
    name: "Cornell Tech",
    url: "https://tech.cornell.edu/news/feed/",
    category: "AI Education",
    language: "en",
    enabled: true,
  },
  {
    name: "Princeton AI",
    url: "https://ai.princeton.edu/news/feed",
    category: "AI Education",
    language: "en",
    enabled: true,
  },
  {
    name: "Oxford AI",
    url: "https://www.ox.ac.uk/news/tags/artificial-intelligence/feed",
    category: "AI Education",
    language: "en",
    enabled: true,
  },
  
  // AI Research Institutes
  {
    name: "Allen Institute for AI",
    url: "https://allenai.org/blog/feed.xml",
    category: "AI Education",
    language: "en",
    enabled: true,
  },
  {
    name: "Meta AI Research",
    url: "https://ai.meta.com/blog/rss/",
    category: "AI Education",
    language: "en",
    enabled: true,
  },
  
  // Education Technology Media
  {
    name: "EdSurge",
    url: "https://www.edsurge.com/news.rss",
    category: "AI Education",
    language: "en",
    enabled: true,
  },
  {
    name: "eSchool News",
    url: "https://www.eschoolnews.com/feed/",
    category: "AI Education",
    language: "en",
    enabled: true,
  },
  {
    name: "THE Journal",
    url: "https://thejournal.com/rss-feeds/news.aspx",
    category: "AI Education",
    language: "en",
    enabled: true,
  },
  
  // Robotics Organizations
  {
    name: "IEEE Spectrum Robotics",
    url: "https://spectrum.ieee.org/feeds/robotics.rss",
    category: "Robotics",
    language: "en",
    enabled: true,
  },
  {
    name: "Robotics Business Review",
    url: "https://www.roboticsbusinessreview.com/feed/",
    category: "Robotics",
    language: "en",
    enabled: true,
  },
  
  // Education Organizations
  {
    name: "ISTE",
    url: "https://www.iste.org/feed",
    category: "AI Education",
    language: "en",
    enabled: true,
  },
  {
    name: "ASCD",
    url: "https://www.ascd.org/rss",
    category: "Human Skills",
    language: "en",
    enabled: true,
  },
  
  // Chinese Universities
  {
    name: "清华大学新闻网",
    url: "https://news.tsinghua.edu.cn/rss/yw.xml",
    category: "AI Education",
    language: "zh",
    enabled: true,
  },
  {
    name: "北京大学新闻网",
    url: "https://news.pku.edu.cn/rss.jsp",
    category: "AI Education",
    language: "zh",
    enabled: true,
  },
  {
    name: "复旦大学新闻网",
    url: "https://news.fudan.edu.cn/rss/",
    category: "AI Education",
    language: "zh",
    enabled: true,
  },
  {
    name: "上海交通大学新闻网",
    url: "https://news.sjtu.edu.cn/rss.xml",
    category: "AI Education",
    language: "zh",
    enabled: true,
  },
  {
    name: "浙江大学新闻网",
    url: "https://www.zju.edu.cn/rss/",
    category: "AI Education",
    language: "zh",
    enabled: true,
  },
  
  // More AI Companies
  {
    name: "Microsoft Research",
    url: "https://www.microsoft.com/en-us/research/feed/",
    category: "AI Education",
    language: "en",
    enabled: true,
  },
  {
    name: "Google AI Blog",
    url: "https://blog.google/technology/ai/rss/",
    category: "AI Education",
    language: "en",
    enabled: true,
  },
  {
    name: "IBM Research",
    url: "https://research.ibm.com/blog/rss",
    category: "AI Education",
    language: "en",
    enabled: true,
  },
  {
    name: "NVIDIA AI",
    url: "https://blogs.nvidia.com/feed/",
    category: "AI Education",
    language: "en",
    enabled: true,
  },
  
  // K-12 Education Focus
  {
    name: "Edutopia",
    url: "https://www.edutopia.org/rss.xml",
    category: "AI Education",
    language: "en",
    enabled: true,
  },
  {
    name: "TeachThought",
    url: "https://www.teachthought.com/feed/",
    category: "Human Skills",
    language: "en",
    enabled: true,
  },
  {
    name: "Cult of Pedagogy",
    url: "https://www.cultofpedagogy.com/feed/",
    category: "Human Skills",
    language: "en",
    enabled: true,
  },
  
  // STEM Education
  {
    name: "Code.org",
    url: "https://code.org/feed.xml",
    category: "AI Education",
    language: "en",
    enabled: true,
  },
  {
    name: "Khan Academy Blog",
    url: "https://blog.khanacademy.org/rss/",
    category: "AI Education",
    language: "en",
    enabled: true,
  },
  
  // Education Policy & News
  {
    name: "Education Week",
    url: "https://www.edweek.org/rss/blogs.xml",
    category: "Policy & Ethics",
    language: "en",
    enabled: true,
  },
  {
    name: "Brookings Education",
    url: "https://www.brookings.edu/topic/education/feed/",
    category: "Policy & Ethics",
    language: "en",
    enabled: true,
  },
  
  // More Chinese Universities
  {
    name: "南京大学新闻网",
    url: "https://news.nju.edu.cn/rss.xml",
    category: "AI Education",
    language: "zh",
    enabled: true,
  },
  {
    name: "武汉大学新闻网",
    url: "https://news.whu.edu.cn/rss.xml",
    category: "AI Education",
    language: "zh",
    enabled: true,
  },
  {
    name: "华中科技大学新闻网",
    url: "https://news.hust.edu.cn/rss.xml",
    category: "AI Education",
    language: "zh",
    enabled: true,
  },
  {
    name: "西安交通大学新闻网",
    url: "https://news.xjtu.edu.cn/rss.xml",
    category: "AI Education",
    language: "zh",
    enabled: true,
  },
  
  // Chinese Tech Media
  {
    name: "机器之心",
    url: "https://www.jiqizhixin.com/rss",
    category: "AI Education",
    language: "zh",
    enabled: true,
  },
  {
    name: "量子位",
    url: "https://www.qbitai.com/feed",
    category: "AI Education",
    language: "zh",
    enabled: true,
  },
  {
    name: "AI科技评论",
    url: "https://www.leiphone.com/category/ai/feed",
    category: "AI Education",
    language: "zh",
    enabled: true,
  },
  {
    name: "36氪教育",
    url: "https://36kr.com/feed/education",
    category: "AI Education",
    language: "zh",
    enabled: true,
  },
  {
    name: "芥末堆",
    url: "https://www.jiemodui.com/feed",
    category: "AI Education",
    language: "zh",
    enabled: true,
  },
  {
    name: "多知网",
    url: "https://www.duozhi.com/rss.xml",
    category: "AI Education",
    language: "zh",
    enabled: true,
  },
  
  // Chinese Education Government
  {
    name: "中国教育新闻网",
    url: "http://www.jyb.cn/rss/jyxw.xml",
    category: "Policy & Ethics",
    language: "zh",
    enabled: true,
  },
];

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
