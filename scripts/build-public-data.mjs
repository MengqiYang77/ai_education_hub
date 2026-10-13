import { mkdir, readFile, writeFile } from "node:fs/promises";
import { isRelevantChineseNews } from "./news-relevance.mjs";

const sourceDir = new URL("../client/public/data/", import.meta.url);
const outputDir = new URL("../client/public/data/derived/", import.meta.url);

const read = async name => JSON.parse(await readFile(new URL(`${name}.json`, sourceDir), "utf8"));
const write = async (name, rows) => writeFile(new URL(`${name}.json`, outputDir), JSON.stringify(rows));
const newestFirst = rows => [...rows].sort((a, b) => String(b.publishedAt ?? "").localeCompare(String(a.publishedAt ?? "")));

const seenNewsTitles = new Set();
const news = newestFirst((await read("news")).filter(row => row.language !== "zh" || isRelevantChineseNews(row)))
  .filter(row => {
    const key = String(row.title ?? "").replace(/[^\p{L}\p{N}]/gu, "").toLocaleLowerCase();
    if (!key || seenNewsTitles.has(key)) return false;
    seenNewsTitles.add(key);
    return true;
  });
const research = newestFirst(await read("research"));
const newsCard = row => ({
  id: row.id,
  title: row.title,
  description: row.description?.slice(0, 400) ?? null,
  url: row.url,
  imageUrl: row.imageUrl,
  source: row.source,
  publishedAt: row.publishedAt,
  language: row.language,
  topic: row.topic,
  contentFormats: row.contentFormats,
});
const newsIndex = row => ({
  id: row.id,
  title: row.title,
  description: row.description?.slice(0, 300) ?? null,
  url: row.url,
  source: row.source,
  publishedAt: row.publishedAt,
  topic: row.topic,
});
const researchCard = row => ({
  id: row.id,
  title: row.title,
  abstract: row.abstract?.trim().slice(0, 320) ?? null,
  authors: row.authors,
  url: row.url,
  pdfUrl: row.pdfUrl,
  source: row.source,
  topic: row.topic,
  publishedAt: row.publishedAt,
});

const researchList = new Map();
for (const row of research.slice(0, 20)) researchList.set(row.id, row);
const topics = new Set(research.map(row => row.topic).filter(Boolean));
for (const topic of topics) {
  for (const row of research.filter(item => item.topic === topic).slice(0, 20)) {
    researchList.set(row.id, row);
  }
}

await mkdir(outputDir, { recursive: true });
await Promise.all([
  write("news-recent", news.slice(0, 10).map(newsCard)),
  write("news-en", news.filter(row => row.language === "en").slice(0, 300).map(newsCard)),
  write("news-zh", news.filter(row => row.language === "zh").slice(0, 300).map(newsCard)),
  write("news-index", news.map(newsIndex)),
  write("research-recent", research.slice(0, 20).map(researchCard)),
  write("research-list", newestFirst([...researchList.values()]).map(researchCard)),
  write("research-index", research.map(researchCard)),
]);

console.log(`Prepared small site data files from ${news.length} news items and ${research.length} papers.`);
