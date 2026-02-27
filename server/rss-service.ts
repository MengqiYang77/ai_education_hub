import Parser from "rss-parser";
import { getEnabledFeeds, type RSSFeedConfig, isEducationRelated } from "./rss-config";
import { getDb } from "./db";
import { newsItems, researchPapers, categories } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent"],
      ["media:thumbnail", "mediaThumbnail"],
      ["content:encoded", "contentEncoded"],
    ],
  },
});

interface ParsedRSSItem {
  title: string;
  link: string;
  pubDate?: string;
  content?: string;
  contentSnippet?: string;
  creator?: string;
  categories?: string[];
  enclosure?: {
    url: string;
    type?: string;
  };
  mediaContent?: any;
  mediaThumbnail?: any;
}

/**
 * Fetch and parse a single RSS feed
 */
export async function fetchRSSFeed(feedConfig: RSSFeedConfig): Promise<ParsedRSSItem[]> {
  try {
    console.log(`[RSS] Fetching feed: ${feedConfig.name}`);
    const feed = await parser.parseURL(feedConfig.url);
    
    return feed.items.map((item) => ({
      title: item.title || "Untitled",
      link: item.link || "",
      pubDate: item.pubDate || item.isoDate,
      content: item.content || item.contentSnippet,
      contentSnippet: item.contentSnippet,
      creator: item.creator || feedConfig.name,
      categories: item.categories,
      enclosure: item.enclosure,
      mediaContent: (item as any).mediaContent,
      mediaThumbnail: (item as any).mediaThumbnail,
    }));
  } catch (error) {
    console.error(`[RSS] Error fetching ${feedConfig.name}:`, error);
    return [];
  }
}

/**
 * Extract image URL from RSS item
 */
function extractImageUrl(item: ParsedRSSItem): string | null {
  // Try media:content
  if (item.mediaContent && item.mediaContent.$ && item.mediaContent.$.url) {
    return item.mediaContent.$.url;
  }
  
  // Try media:thumbnail
  if (item.mediaThumbnail && item.mediaThumbnail.$ && item.mediaThumbnail.$.url) {
    return item.mediaThumbnail.$.url;
  }
  
  // Try enclosure
  if (item.enclosure && item.enclosure.type?.startsWith("image/")) {
    return item.enclosure.url;
  }
  
  // Try to extract from content
  if (item.content) {
    const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1];
    }
  }
  
  return null;
}

/**
 * Get or create category ID by name
 */
async function getCategoryIdByName(categoryName: string): Promise<number> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Try to find existing category
  const existing = await db
    .select()
    .from(categories)
    .where(eq(categories.name, categoryName))
    .limit(1);

  if (existing.length > 0 && existing[0]) {
    return existing[0].id;
  }

  // Create new category if not found
  const slug = categoryName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const result = await db.insert(categories).values({
    name: categoryName,
    slug,
    description: `Research and news about ${categoryName}`,
  });

  return Number(result[0].insertId);
}

/**
 * Check if news item already exists in database
 */
async function newsItemExists(url: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const existing = await db
    .select()
    .from(newsItems)
    .where(eq(newsItems.url, url))
    .limit(1);

  return existing.length > 0;
}

/**
 * Check if research paper already exists in database
 */
async function researchPaperExists(url: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const existing = await db
    .select()
    .from(researchPapers)
    .where(eq(researchPapers.url, url))
    .limit(1);

  return existing.length > 0;
}

/**
 * Save RSS items to database (news or research papers based on contentType)
 */
export async function saveRSSItems(
  items: ParsedRSSItem[],
  feedConfig: RSSFeedConfig
): Promise<number> {
  const db = await getDb();
  if (!db) {
    console.error("[RSS] Database not available");
    return 0;
  }

  const categoryId = await getCategoryIdByName(feedConfig.category);
  let savedCount = 0;
  const isResearch = feedConfig.contentType === "research";

  for (const item of items) {
    try {
      // Skip if already exists
      if (isResearch) {
        if (await researchPaperExists(item.link)) {
          continue;
        }
      } else {
        if (await newsItemExists(item.link)) {
          continue;
        }
      }

      // Extract description (limit to 500 chars for news, full for research)
      let description = item.contentSnippet || item.content || "";
      description = description.replace(/<[^>]*>/g, "");
      
      if (!isResearch) {
        description = description.substring(0, 500);
        
        // Filter by education relevance for news (skip if not education-focused source and not education-related)
        if (!feedConfig.educationFocused) {
          if (!isEducationRelated(item.title, description, feedConfig.language)) {
            continue; // Skip non-education-related articles from mixed sources
          }
        }
      }

      // Parse publish date
      let publishedAt = new Date();
      if (item.pubDate) {
        const parsed = new Date(item.pubDate);
        if (!isNaN(parsed.getTime())) {
          publishedAt = parsed;
        }
      }

      if (isResearch) {
        // Save as research paper
        await db.insert(researchPapers).values({
          title: item.title.substring(0, 500),
          abstract: description.substring(0, 2000),
          url: item.link,
          source: feedConfig.name,
          language: feedConfig.language,
          categoryId,
          publishedAt,
          authors: item.creator || null,
          institution: feedConfig.name.includes("arXiv") ? "arXiv" : feedConfig.name,
          pdfUrl: null, // Could be extracted from arXiv links if needed
        });
      } else {
        // Save as news item
        const imageUrl = extractImageUrl(item);
        
        await db.insert(newsItems).values({
          title: item.title.substring(0, 255),
          description,
          url: item.link,
          source: feedConfig.name,
          language: feedConfig.language,
          imageUrl,
          categoryId,
          publishedAt,
        });
      }

      savedCount++;
    } catch (error) {
      console.error(`[RSS] Error saving item "${item.title}":`, error);
    }
  }

  return savedCount;
}

/**
 * Fetch all RSS feeds and save to database
 */
export async function updateAllRSSFeeds(): Promise<{
  totalFetched: number;
  totalSaved: number;
  feedResults: Array<{ name: string; fetched: number; saved: number }>;
}> {
  console.log("[RSS] Starting RSS feed update...");
  
  const feeds = getEnabledFeeds();
  const feedResults: Array<{ name: string; fetched: number; saved: number }> = [];
  let totalFetched = 0;
  let totalSaved = 0;

  for (const feed of feeds) {
    const items = await fetchRSSFeed(feed);
    const saved = await saveRSSItems(items, feed);
    
    feedResults.push({
      name: feed.name,
      fetched: items.length,
      saved,
    });
    
    totalFetched += items.length;
    totalSaved += saved;
    
    console.log(`[RSS] ${feed.name}: Fetched ${items.length}, Saved ${saved} new items`);
  }

  console.log(`[RSS] Update complete: ${totalFetched} fetched, ${totalSaved} saved`);
  
  return {
    totalFetched,
    totalSaved,
    feedResults,
  };
}
