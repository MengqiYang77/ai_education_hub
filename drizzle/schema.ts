import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Content categories for organizing resources
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }), // lucide icon name
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Curated content (articles, reports, frameworks, best practices)
 */
export const curatedContent = mysqlTable("curated_content", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  content: text("content").notNull(), // markdown or html
  imageUrl: varchar("imageUrl", { length: 500 }),
  categoryId: int("categoryId").notNull(),
  authorId: int("authorId").notNull(),
  isPinned: int("isPinned").default(0).notNull(),
  viewCount: int("viewCount").default(0).notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CuratedContent = typeof curatedContent.$inferSelect;
export type InsertCuratedContent = typeof curatedContent.$inferInsert;

/**
 * News feed items from external sources or manual curation
 */
export const newsItems = mysqlTable("news_items", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  url: varchar("url", { length: 500 }).notNull(),
  imageUrl: varchar("imageUrl", { length: 500 }),
  source: varchar("source", { length: 100 }), // e.g., "ASCD", "Harvard", "EdTech Magazine"
  language: mysqlEnum("language", ["en", "zh"]).default("en").notNull(),
  categoryId: int("categoryId"),
  publishedAt: timestamp("publishedAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type NewsItem = typeof newsItems.$inferSelect;
export type InsertNewsItem = typeof newsItems.$inferInsert;

/**
 * Tool library with detailed information
 */
export const tools = mysqlTable("tools", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  detailedInfo: text("detailedInfo"), // markdown for detailed description
  websiteUrl: varchar("websiteUrl", { length: 500 }),
  imageUrl: varchar("imageUrl", { length: 500 }),
  categoryId: int("categoryId").notNull(),
  pricing: varchar("pricing", { length: 100 }), // e.g., "Free", "$99/year", "Freemium"
  targetAudience: varchar("targetAudience", { length: 255 }), // e.g., "High School", "Middle School"
  skillsDeveloped: text("skillsDeveloped"), // comma-separated or JSON
  isFeatured: int("isFeatured").default(0).notNull(),
  viewCount: int("viewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Tool = typeof tools.$inferSelect;
export type InsertTool = typeof tools.$inferInsert;