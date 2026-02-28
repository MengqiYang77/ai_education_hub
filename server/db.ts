import { eq, desc, like, or, and, sql, ne, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, categories, curatedContent, newsItems, tools, Category, CuratedContent, NewsItem, Tool, researchPapers, ResearchPaper, InsertResearchPaper } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}



// ============ Categories ============
export async function getAllCategories(): Promise<Category[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories).orderBy(categories.displayOrder);
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result[0];
}

// ============ Curated Content ============
export async function getAllCuratedContent(limit?: number): Promise<CuratedContent[]> {
  const db = await getDb();
  if (!db) return [];
  const query = db.select().from(curatedContent).where(sql`${curatedContent.publishedAt} IS NOT NULL`).orderBy(desc(curatedContent.isPinned), desc(curatedContent.publishedAt));
  if (limit) {
    return query.limit(limit);
  }
  return query;
}

export async function getCuratedContentBySlug(slug: string): Promise<CuratedContent | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(curatedContent).where(eq(curatedContent.slug, slug)).limit(1);
  return result[0];
}

export async function getCuratedContentByCategory(categoryId: number, limit?: number): Promise<CuratedContent[]> {
  const db = await getDb();
  if (!db) return [];
  const query = db.select().from(curatedContent).where(and(eq(curatedContent.categoryId, categoryId), sql`${curatedContent.publishedAt} IS NOT NULL`)).orderBy(desc(curatedContent.publishedAt));
  if (limit) {
    return query.limit(limit);
  }
  return query;
}

export async function searchCuratedContent(searchTerm: string): Promise<CuratedContent[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(curatedContent).where(
    and(
      sql`${curatedContent.publishedAt} IS NOT NULL`,
      or(
        like(curatedContent.title, `%${searchTerm}%`),
        like(curatedContent.description, `%${searchTerm}%`),
        like(curatedContent.content, `%${searchTerm}%`)
      )
    )
  ).orderBy(desc(curatedContent.publishedAt)).limit(20);
}

export async function incrementContentViewCount(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(curatedContent).set({ viewCount: sql`${curatedContent.viewCount} + 1` }).where(eq(curatedContent.id, id));
}

// ============ News Items ============
export async function getRecentNews(limit: number = 10): Promise<NewsItem[]> {
  const db = await getDb();
  if (!db) return [];
  // Global tab: exclude Chinese-language articles (those go to the China tab)
  return db.select().from(newsItems)
    .where(or(isNull(newsItems.language), ne(newsItems.language, 'zh')))
    .orderBy(desc(newsItems.publishedAt))
    .limit(limit);
}

export async function getNewsByLanguage(language: string, limit: number = 30): Promise<NewsItem[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(newsItems)
    .where(eq(newsItems.language, language))
    .orderBy(desc(newsItems.publishedAt))
    .limit(limit);
}

export async function getNewsByCategory(categoryId: number, limit: number = 10): Promise<NewsItem[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(newsItems).where(eq(newsItems.categoryId, categoryId)).orderBy(desc(newsItems.publishedAt)).limit(limit);
}

// ============ Tools ============
export async function getAllTools(): Promise<Tool[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tools).orderBy(desc(tools.isFeatured), tools.name);
}

export async function getToolBySlug(slug: string): Promise<Tool | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(tools).where(eq(tools.slug, slug)).limit(1);
  return result[0];
}

export async function getToolsByCategory(categoryId: number): Promise<Tool[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tools).where(eq(tools.categoryId, categoryId)).orderBy(desc(tools.isFeatured), tools.name);
}

export async function getFeaturedTools(limit: number = 6): Promise<Tool[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tools).where(eq(tools.isFeatured, 1)).orderBy(tools.name).limit(limit);
}

export async function searchTools(searchTerm: string): Promise<Tool[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tools).where(
    or(
      like(tools.name, `%${searchTerm}%`),
      like(tools.description, `%${searchTerm}%`),
      like(tools.detailedInfo, `%${searchTerm}%`)
    )
  ).orderBy(desc(tools.isFeatured), tools.name).limit(20);
}

export async function incrementToolViewCount(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(tools).set({ viewCount: sql`${tools.viewCount} + 1` }).where(eq(tools.id, id));
}

// ============ Research Papers ============


export async function getRecentResearchPapers(limit: number = 20, topic?: string): Promise<ResearchPaper[]> {
  const db = await getDb();
  if (!db) return [];
  if (topic) {
    return db.select().from(researchPapers).where(eq(researchPapers.topic, topic)).orderBy(desc(researchPapers.publishedAt)).limit(limit);
  }
  return db.select().from(researchPapers).orderBy(desc(researchPapers.publishedAt)).limit(limit);
}

export async function searchResearchPapers(searchTerm: string): Promise<ResearchPaper[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(researchPapers).where(
    or(
      like(researchPapers.title, `%${searchTerm}%`),
      like(researchPapers.abstract, `%${searchTerm}%`),
      like(researchPapers.authors, `%${searchTerm}%`)
    )
  ).orderBy(desc(researchPapers.publishedAt)).limit(30);
}

export async function triggerResearchFetch(): Promise<{ added: number; skipped: number }> {
  const { fetchAndStoreResearchPapers } = await import("./fetchResearch");
  return fetchAndStoreResearchPapers();
}

export async function triggerNewsFetch(): Promise<{ added: number; skipped: number }> {
  const { fetchAndStoreUniversityNews } = await import("./fetchNews");
  return fetchAndStoreUniversityNews();
}

export async function getDbStats(): Promise<{
  newsCount: number;
  researchCount: number;
}> {
  const db = await getDb();
  if (!db) return { newsCount: 0, researchCount: 0 };

  const [newsRows] = await db.select({ count: sql<number>`count(*)` }).from(newsItems);
  const [researchRows] = await db.select({ count: sql<number>`count(*)` }).from(researchPapers);

  return {
    newsCount: Number(newsRows.count),
    researchCount: Number(researchRows.count),
  };
}
