import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { ownerProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(async opts => {
      if (!opts.ctx.user) return null;
      const { ENV } = await import("./_core/env");
      return {
        ...opts.ctx.user,
        isOwner: opts.ctx.user.openId === ENV.ownerOpenId,
      };
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Public content routers
  categories: router({
    list: publicProcedure.query(async () => {
      const { getAllCategories } = await import("./db");
      return getAllCategories();
    }),
    bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      const { getCategoryBySlug } = await import("./db");
      return getCategoryBySlug(input.slug);
    }),
  }),

  content: router({
    list: publicProcedure.input(z.object({ limit: z.number().optional() }).optional()).query(async ({ input }) => {
      const { getAllCuratedContent } = await import("./db");
      return getAllCuratedContent(input?.limit);
    }),
    bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      const { getCuratedContentBySlug, incrementContentViewCount } = await import("./db");
      const content = await getCuratedContentBySlug(input.slug);
      if (content) {
        await incrementContentViewCount(content.id);
      }
      return content;
    }),
    byCategory: publicProcedure.input(z.object({ categoryId: z.number(), limit: z.number().optional() })).query(async ({ input }) => {
      const { getCuratedContentByCategory } = await import("./db");
      return getCuratedContentByCategory(input.categoryId, input.limit);
    }),
    search: publicProcedure.input(z.object({ query: z.string() })).query(async ({ input }) => {
      const { searchCuratedContent } = await import("./db");
      return searchCuratedContent(input.query);
    }),
  }),

  news: router({
    recent: publicProcedure.input(z.object({ limit: z.number().default(10) }).optional()).query(async ({ input }) => {
      const { getRecentNews } = await import("./db");
      return getRecentNews(input?.limit || 10);
    }),
    byCategory: publicProcedure.input(z.object({ categoryId: z.number(), limit: z.number().default(10) })).query(async ({ input }) => {
      const { getNewsByCategory } = await import("./db");
      return getNewsByCategory(input.categoryId, input.limit);
    }),
    // Trigger live fetch from university RSS feeds (owner only)
    fetch: ownerProcedure.mutation(async () => {
      const { triggerNewsFetch } = await import("./db");
      return triggerNewsFetch();
    }),
    // Filter by language (e.g. 'zh' for China tab)
    byLanguage: publicProcedure
      .input(z.object({ language: z.string(), limit: z.number().default(30) }))
      .query(async ({ input }) => {
        const { getNewsByLanguage } = await import("./db");
        return getNewsByLanguage(input.language, input.limit);
      }),
    // Database statistics
    stats: publicProcedure.query(async () => {
      const { getDbStats } = await import("./db");
      return getDbStats();
    }),
    // Topic page: search news by keyword in title/description
    byTopic: publicProcedure
      .input(z.object({ keyword: z.string(), limit: z.number().default(8) }))
      .query(async ({ input }) => {
        const { getNewsByTopic } = await import("./db");
        return getNewsByTopic(input.keyword, input.limit);
      }),
    // Search page: search news by title only (English only)
    searchByTitle: publicProcedure
      .input(z.object({ q: z.string() }))
      .query(async ({ input }) => {
        const { getDb } = await import("./db");
        const { newsItems } = await import("../drizzle/schema");
        const { like, desc, or, isNull, ne, and } = await import("drizzle-orm");
        const db = await getDb();
        if (!db || !input.q.trim()) return [];
        return db.select().from(newsItems)
          .where(and(
            like(newsItems.title, `%${input.q}%`),
            or(isNull(newsItems.language), ne(newsItems.language, 'zh'))
          ))
          .orderBy(desc(newsItems.publishedAt))
          .limit(20);
      }),
    // Admin: manually add a news article (owner only)
    addManual: ownerProcedure
      .input(z.object({
        title: z.string().min(1),
        url: z.string().url(),
        source: z.string().min(1),
        description: z.string().optional(),
        language: z.enum(['en', 'zh']).default('zh'),
      }))
      .mutation(async ({ input }) => {
        const { getDb } = await import("./db");
        const { newsItems } = await import("../drizzle/schema");
        const db = await getDb();
        if (!db) throw new Error('Database unavailable');
        // Check for duplicate URL
        const { eq } = await import("drizzle-orm");
        const existing = await db.select({ id: newsItems.id }).from(newsItems).where(eq(newsItems.url, input.url)).limit(1);
        if (existing.length > 0) throw new Error('Article with this URL already exists');
        const [inserted] = await db.insert(newsItems).values({
          title: input.title,
          url: input.url,
          source: input.source,
          description: input.description ?? null,
          language: input.language,
          publishedAt: new Date(),
          imageUrl: null,
        }).$returningId();
        return { success: true, id: inserted.id };
      }),
  }),

  research: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().default(20), topic: z.string().optional() }).optional())
      .query(async ({ input }) => {
        const { getRecentResearchPapers } = await import("./db");
        return getRecentResearchPapers(input?.limit || 20, input?.topic);
      }),
    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        const { searchResearchPapers } = await import("./db");
        return searchResearchPapers(input.query);
      }),
    // Admin: manually trigger a fetch (owner only)
    fetch: ownerProcedure.mutation(async () => {
      const { triggerResearchFetch } = await import("./db");
      return triggerResearchFetch();
    }),
    // Topic page: filter research papers by topic field
    byTopic: publicProcedure
      .input(z.object({ topic: z.string(), limit: z.number().default(8) }))
      .query(async ({ input }) => {
        const { getRecentResearchPapers } = await import("./db");
        return getRecentResearchPapers(input.limit, input.topic);
      }),
    // Search page: search research papers by title only
    searchByTitle: publicProcedure
      .input(z.object({ q: z.string() }))
      .query(async ({ input }) => {
        const { getDb } = await import("./db");
        const { researchPapers } = await import("../drizzle/schema");
        const { like, desc } = await import("drizzle-orm");
        const db = await getDb();
        if (!db || !input.q.trim()) return [];
        return db.select().from(researchPapers)
          .where(like(researchPapers.title, `%${input.q}%`))
          .orderBy(desc(researchPapers.publishedAt))
          .limit(20);
      }),
  }),

  tools: router({
    list: publicProcedure.query(async () => {
      const { getAllTools } = await import("./db");
      return getAllTools();
    }),
    bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      const { getToolBySlug, incrementToolViewCount } = await import("./db");
      const tool = await getToolBySlug(input.slug);
      if (tool) {
        await incrementToolViewCount(tool.id);
      }
      return tool;
    }),
    byCategory: publicProcedure.input(z.object({ categoryId: z.number() })).query(async ({ input }) => {
      const { getToolsByCategory } = await import("./db");
      return getToolsByCategory(input.categoryId);
    }),
    featured: publicProcedure.input(z.object({ limit: z.number().default(6) }).optional()).query(async ({ input }) => {
      const { getFeaturedTools } = await import("./db");
      return getFeaturedTools(input?.limit || 6);
    }),
    search: publicProcedure.input(z.object({ query: z.string() })).query(async ({ input }) => {
      const { searchTools } = await import("./db");
      return searchTools(input.query);
    }),
  }),
});

export type AppRouter = typeof appRouter;
