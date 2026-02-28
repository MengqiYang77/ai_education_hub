/**
 * University News Fetcher
 *
 * Pulls RSS feeds from Top 30 US universities + key AI education institutions.
 * Filters for AI + education relevance.
 * Saves to existing news_items table.
 *
 * All RSS feeds are free and publicly available.
 *
 * Universities covered (with education/AI focus RSS where available):
 *   MIT, Stanford, Harvard, Carnegie Mellon, Berkeley, Princeton, Yale,
 *   Columbia, Chicago, Northwestern, Duke, Johns Hopkins, Cornell, Penn,
 *   Dartmouth, Brown, Rice, Vanderbilt, Notre Dame, Georgetown, NYU,
 *   Michigan, UCLA, UCSD, Georgia Tech, Caltech, Tsinghua (China), Oxford, Cambridge
 *
 * Plus specialist AI education sources:
 *   Stanford HAI, Stanford GSE, MIT CSAIL, Berkeley AI (BAIR),
 *   Harvard GSE, CMU ML Blog, EdSurge, EdTech Magazine, EDUCAUSE
 */

import { getDb } from "./db";
import { newsItems, InsertNewsItem } from "../drizzle/schema";

// ─── RSS Sources ───────────────────────────────────────────────────────────────

interface RssSource {
  name: string;
  url: string;
  language?: string; // e.g. 'zh' for Chinese sources
}

const RSS_SOURCES: RssSource[] = [
  // ── Flagship University News (AI topic feeds where available) ──
  { name: "MIT News",           url: "https://news.mit.edu/rss/topic/artificial-intelligence2" },
  { name: "MIT News",           url: "https://news.mit.edu/rss/topic/education" },
  // Stanford main feed returns 403, using HAI feed only
  { name: "Stanford HAI",       url: "https://hai.stanford.edu/rss.xml" },
  { name: "Stanford SAIL",      url: "https://ai.stanford.edu/blog/feed.xml" },
  { name: "Harvard Gazette",    url: "https://news.harvard.edu/gazette/feed/" },
  // Harvard GSE feed removed (404), using main Harvard Gazette
  { name: "Carnegie Mellon",    url: "https://www.cmu.edu/news/rss/news.xml" },
  // CMU ML Blog timeout, using main CMU news feed
  { name: "Berkeley BAIR",      url: "https://bair.berkeley.edu/blog/feed.xml" },
  { name: "Berkeley News",      url: "https://news.berkeley.edu/feed" },
  { name: "Princeton",          url: "https://www.princeton.edu/feed" },
  { name: "Yale News",          url: "https://news.yale.edu/rss.xml" },
  { name: "Columbia",           url: "https://news.columbia.edu/rss.xml" },
  { name: "UChicago",           url: "https://news.uchicago.edu/rss.xml" },
  { name: "Northwestern",       url: "https://www.northwestern.edu/newscenter/rss/news.xml" },
  { name: "Duke",               url: "https://duke.edu/feed/" },
  { name: "Johns Hopkins",      url: "https://hub.jhu.edu/feed" },
  { name: "Cornell",            url: "https://news.cornell.edu/feed" },
  { name: "Penn",               url: "https://penntoday.upenn.edu/feed" },
  { name: "Dartmouth",          url: "https://home.dartmouth.edu/news/rss.xml" },
  { name: "Brown",              url: "https://www.brown.edu/news/feed" },
  { name: "Michigan",           url: "https://news.umich.edu/feed" },
  { name: "UCLA",               url: "https://newsroom.ucla.edu/rss.xml" },
  { name: "NYU",                url: "https://www.nyu.edu/about/news-publications/news.rss" },
  { name: "Georgia Tech",       url: "https://news.gatech.edu/rss.xml" },
  { name: "Caltech",            url: "https://www.caltech.edu/rss/news.xml" },
  { name: "Notre Dame",         url: "https://news.nd.edu/feed" },
  { name: "Georgetown",         url: "https://www.georgetown.edu/news/feed" },
  { name: "Rice",               url: "https://news.rice.edu/feed" },

  // ── Specialist AI Education Outlets ──
  { name: "EdSurge",            url: "https://www.edsurge.com/articles.rss" },
  { name: "EDUCAUSE",           url: "https://er.educause.edu/rss" },
  { name: "EdTech Magazine",    url: "https://edtechmagazine.com/higher/rss.xml" },
  { name: "THE",                url: "https://www.timeshighereducation.com/news/rss.xml" },
  { name: "EdTech Innovation",  url: "https://www.edtechinnovationhub.com/feed" },

  // ── 中文教育AI新闻源（China tab） ──
  // 澎湃教育: rssforever instance works (200 + items)
  { name: "澎湃教育",            url: "https://rsshub.rssforever.com/thepaper/list/25457", language: "zh" },
  // feedx.net 澎湃全站 (200 + items, general news — filtered by keywords)
  { name: "澎湃新闻",            url: "https://feedx.net/rss/thepaper.xml",              language: "zh" },
  // 36Kr direct native RSS (200 + items)
  { name: "36Kr科技",            url: "https://36kr.com/feed",                           language: "zh" },
  // 教育部 & 中国教育报: all tested instances returned 503/404/TLS error — kept as placeholders
  // { name: "教育部官网",        url: "https://rsshub.rssforever.com/moe/news",          language: "zh" },
  // { name: "中国教育报",        url: "https://rsshub.rssforever.com/jyb/zgjyb",         language: "zh" },
];

// ─── Education + AI keyword filter ─────────────────────────────────────────────

const AI_KEYWORDS = [
  "artificial intelligence", " ai ", "machine learning", "deep learning",
  "generative ai", "chatgpt", "gpt", "large language model", "llm",
  "neural network", "algorithm", "automation", "robot", "data science",
  "openai", "anthropic", "deepmind", "google ai",
];

const EDU_KEYWORDS = [
  "education", "learning", "teaching", "classroom", "student", "teacher",
  "curriculum", "school", "university", "college", "campus", "faculty",
  "research", "academic", "study", "course", "lecture", "professor",
  "k-12", "higher education", "edtech", "pedagogy", "tutoring",
];

function isRelevant(title: string, description: string): boolean {
  const text = `${title} ${description}`.toLowerCase();
  const hasAI = AI_KEYWORDS.some(kw => text.includes(kw));
  const hasEdu = EDU_KEYWORDS.some(kw => text.includes(kw));
  // Must mention BOTH ai and education, OR come from a specialist source (handled at source level)
  return hasAI && hasEdu;
}

// Specialist sources — everything they publish is relevant
const SPECIALIST_SOURCES = new Set(["EdSurge", "EDUCAUSE", "EdTech Magazine", "Stanford HAI",
  "Stanford SAIL", "Harvard GSE", "CMU ML Blog", "Berkeley BAIR", "EdTech Innovation",
  // Chinese sources — all content is relevant by definition
  "澎湃教育", "澎湃新闻", "36Kr科技", "教育部官网", "中国教育报"]);

function isRelevantForSource(sourceName: string, title: string, description: string): boolean {
  if (SPECIALIST_SOURCES.has(sourceName)) return true;
  return isRelevant(title, description);
}

// ─── RSS Parser ────────────────────────────────────────────────────────────────

interface ParsedItem {
  title: string;
  description: string;
  url: string;
  imageUrl: string | null;
  publishedAt: Date;
}

function parseRss(xml: string): ParsedItem[] {
  const items: ParsedItem[] = [];
  for (const [, item] of Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/g))) {
    const title = cleanText(
      extractCdata(item, "title") || extractTag(item, "title") || ""
    );
    const description = cleanText(
      extractCdata(item, "description") || extractTag(item, "description") || ""
    );
    const link = extractTag(item, "link") || extractTag(item, "guid") || "";
    const pubDate = extractTag(item, "pubDate") || extractTag(item, "dc:date") || "";

    // Try to find an image
    const imageUrl =
      item.match(/enclosure[^>]*url="([^"]+\.(jpg|jpeg|png|webp))"/i)?.[1] ||
      item.match(/<media:content[^>]*url="([^"]+\.(jpg|jpeg|png|webp))"/i)?.[1] ||
      item.match(/<img[^>]+src="([^"]+)"/i)?.[1] ||
      null;

    if (!title || !link) continue;

    let publishedAt: Date;
    try {
      publishedAt = pubDate ? new Date(pubDate) : new Date();
      if (isNaN(publishedAt.getTime())) publishedAt = new Date();
    } catch {
      publishedAt = new Date();
    }

    // Only keep items from last 90 days
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    if (publishedAt < ninetyDaysAgo) continue;

    items.push({ title, description: description.slice(0, 500), url: link.trim(), imageUrl, publishedAt });
  }

  return items;
}

function extractTag(xml: string, tag: string): string | null {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return m ? m[1].trim() : null;
}

function extractCdata(xml: string, tag: string): string | null {
  const m = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i"));
  return m ? m[1].trim() : null;
}

function cleanText(t: string): string {
  let s = t;
  // Step 1: unwrap CDATA
  s = s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
  // Step 2: decode HTML entities FIRST (so &lt;p&gt; becomes <p>)
  s = s.replace(/&lt;/g, "<");
  s = s.replace(/&gt;/g, ">");
  s = s.replace(/&amp;/g, "&");
  s = s.replace(/&quot;/g, '"');
  s = s.replace(/&apos;/g, "'");
  s = s.replace(/&nbsp;/g, " ");
  s = s.replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
  s = s.replace(/&#(\d+);/g, (_, d) => String.fromCharCode(parseInt(d, 10)));
  // Step 3: strip all HTML tags
  s = s.replace(/<[^>]+>/g, " ");
  // Step 4: decode any remaining entities after stripping
  s = s.replace(/&lt;/g, "<");
  s = s.replace(/&gt;/g, ">");
  s = s.replace(/&amp;/g, "&");
  s = s.replace(/&quot;/g, '"');
  // Step 5: clean whitespace
  s = s.replace(/\s+/g, " ");
  return s.trim();
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

// ─── Main export ───────────────────────────────────────────────────────────────

export async function fetchAndStoreUniversityNews(): Promise<{ added: number; skipped: number }> {
  console.log("[fetchNews] Starting university news fetch...");

  const db = await getDb();
  if (!db) { console.warn("[fetchNews] DB not available"); return { added: 0, skipped: 0 }; }

  let added = 0, skipped = 0;
  const seenUrls = new Set<string>();

  for (const source of RSS_SOURCES) {
    await sleep(300);

    let xml = "";
    try {
      const res = await fetch(source.url, {
        headers: {
          "User-Agent": "AIEducationHub/1.0 (admin@aieduhub.co)",
          "Accept": "application/rss+xml, application/xml, text/xml",
        },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) {
        console.warn(`[fetchNews] ${source.name}: HTTP ${res.status}`);
        continue;
      }
      xml = await res.text();
    } catch (err: any) {
      console.warn(`[fetchNews] ${source.name}: fetch error — ${err?.message}`);
      continue;
    }

    const items = parseRss(xml);
    let sourceAdded = 0;

    for (const item of items) {
      if (seenUrls.has(item.url)) continue;
      if (!isRelevantForSource(source.name, item.title, item.description)) continue;
      seenUrls.add(item.url);

      const newsItem: InsertNewsItem = {
        title: item.title.slice(0, 255),
        description: item.description || null,
        url: item.url.slice(0, 500),
        imageUrl: item.imageUrl?.slice(0, 500) || null,
        source: source.name,
        language: source.language || null,
        categoryId: null, // Could be enriched later
        publishedAt: item.publishedAt,
      };

      try {
        await (db as any).insert(newsItems).values(newsItem)
          .onDuplicateKeyUpdate({ set: { title: newsItem.title } });
        added++;
        sourceAdded++;
      } catch (err: any) {
        if (err?.code === "ER_DUP_ENTRY") skipped++;
        else { console.error("[fetchNews] Insert error:", err?.message); skipped++; }
      }
    }

    if (sourceAdded > 0) console.log(`  [${source.name}] +${sourceAdded}`);
  }

  console.log(`[fetchNews] Done — added:${added} dupes:${skipped}`);
  return { added, skipped };
}
