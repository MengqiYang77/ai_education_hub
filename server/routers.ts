import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
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
  }),

  rss: router({
    updateFeeds: publicProcedure.mutation(async () => {
      const { updateAllRSSFeeds } = await import("./rss-service");
      return updateAllRSSFeeds();
    }),
    getFeedConfig: publicProcedure.query(async () => {
      const { getEnabledFeeds, getFeedCount } = await import("./rss-config");
      return {
        feeds: getEnabledFeeds(),
        totalCount: getFeedCount(),
      };
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
