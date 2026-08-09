import { readFile, writeFile } from "node:fs/promises";

const dataDir = new URL("../client/public/data/", import.meta.url);
const recentCutoff = Date.now() - 1000 * 60 * 60 * 24 * 120;

const feeds = [
  ["MIT News", "https://news.mit.edu/rss/topic/artificial-intelligence2", "en"],
  ["MIT News", "https://news.mit.edu/rss/topic/education", "en"],
  ["Stanford HAI", "https://hai.stanford.edu/rss.xml", "en"],
  ["Stanford SAIL", "https://ai.stanford.edu/blog/feed.xml", "en"],
  ["Harvard Gazette", "https://news.harvard.edu/gazette/feed/", "en"],
  ["Carnegie Mellon", "https://www.cmu.edu/news/rss/news.xml", "en"],
  ["Berkeley BAIR", "https://bair.berkeley.edu/blog/feed.xml", "en"],
  ["Berkeley News", "https://news.berkeley.edu/feed", "en"],
  ["Princeton", "https://www.princeton.edu/feed", "en"],
  ["Yale News", "https://news.yale.edu/rss.xml", "en"],
  ["Columbia", "https://news.columbia.edu/rss.xml", "en"],
  ["Cornell", "https://news.cornell.edu/feed", "en"],
  ["Michigan", "https://news.umich.edu/feed", "en"],
  ["Georgia Tech", "https://news.gatech.edu/rss.xml", "en"],
  ["EdSurge", "https://www.edsurge.com/articles.rss", "en"],
  ["EDUCAUSE", "https://er.educause.edu/rss", "en"],
  ["EdTech Magazine", "https://edtechmagazine.com/higher/rss.xml", "en"],
  ["量子位", "https://www.qbitai.com/feed", "zh"],
  ["雷锋网", "https://www.leiphone.com/feed", "zh"],
];

const ai = /artificial intelligence|\bai\b|machine learning|deep learning|generative ai|chatgpt|\bgpt\b|large language model|\bllm\b|robot|data science/i;
const edu = /education|learning|teaching|classroom|student|teacher|curriculum|school|university|college|research|academic|edtech|pedagogy/i;
const aiZh = /人工智能|AI|机器学习|深度学习|大模型|ChatGPT|GPT|算法|自动化|机器人/;
const eduZh = /教育|学习|课程|学校|大学|高校|教学|培训|学生|老师|教师|课堂|学院/;
const specialist = new Set(["EdSurge", "EDUCAUSE", "EdTech Magazine", "Stanford HAI", "Stanford SAIL", "Berkeley BAIR"]);

const text = (xml, tag) => {
  const match = xml.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, "i"));
  return clean(match?.[1] ?? "");
};
const clean = value => value.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();

async function read(name) { return JSON.parse(await readFile(new URL(`${name}.json`, dataDir), "utf8")); }
async function save(name, rows) { await writeFile(new URL(`${name}.json`, dataDir), `${JSON.stringify(rows, null, 2)}\n`); }

async function fetchWithTimeout(url) {
  return fetch(url, { signal: AbortSignal.timeout(20_000), headers: { "user-agent": "AIEducationHub/2.0 (admin@aieduhub.co)" } });
}

async function updateNews() {
  const rows = await read("news");
  const urls = new Set(rows.map(row => row.url));
  let nextId = Math.max(0, ...rows.map(row => Number(row.id))) + 1;
  let added = 0;
  for (const [source, feed, language] of feeds) {
    try {
      const response = await fetchWithTimeout(feed);
      if (!response.ok) continue;
      const xml = await response.text();
      const items = [...xml.matchAll(/<item[ >]([\s\S]*?)<\/item>/gi)].map(match => match[1]);
      for (const item of items) {
        const title = text(item, "title");
        const description = text(item, "description").slice(0, 1000);
        const url = text(item, "link") || text(item, "guid");
        const date = new Date(text(item, "pubDate") || text(item, "dc:date") || Date.now());
        const relevant = language === "zh" ? aiZh.test(`${title} ${description}`) && eduZh.test(`${title} ${description}`) : specialist.has(source) || (ai.test(`${title} ${description}`) && edu.test(`${title} ${description}`));
        if (!title || !url || urls.has(url) || !relevant || date.getTime() < recentCutoff) continue;
        rows.push({ id: nextId++, title, description: description || null, url, imageUrl: null, source, categoryId: 1, publishedAt: date.toISOString(), createdAt: new Date().toISOString(), language });
        urls.add(url); added++;
      }
    } catch (error) { console.warn(`news: ${source}: ${error.message}`); }
  }
  rows.sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
  await save("news", rows);
  return added;
}

const researchQueries = ["artificial intelligence education", "generative AI teaching", "large language model learning", "intelligent tutoring system", "AI literacy education"];
function topic(title, abstract) {
  const value = `${title} ${abstract}`.toLowerCase();
  if (/ethic|bias|fairness|polic|governance|privacy|equity/.test(value)) return "Policy & Ethics";
  if (/robot|physical computing|arduino|hardware|maker/.test(value)) return "Robotics";
  if (/data science|data literacy|visuali|statistic|computational thinking/.test(value)) return "Data Science";
  if (/emotion|empathy|social skill|wellbeing|mental health/.test(value)) return "Human Skills";
  return "AI Education";
}

async function updateResearch() {
  const rows = await read("research");
  const urls = new Set(rows.map(row => row.url));
  let nextId = Math.max(0, ...rows.map(row => Number(row.id))) + 1;
  let added = 0;
  for (const query of researchQueries) {
    try {
      const params = new URLSearchParams({ query, fields: "title,abstract,authors,publicationDate,year,venue,externalIds,openAccessPdf", limit: "50" });
      const response = await fetchWithTimeout(`https://api.semanticscholar.org/graph/v1/paper/search?${params}`);
      if (!response.ok) continue;
      const body = await response.json();
      for (const paper of body.data ?? []) {
        const doi = paper.externalIds?.DOI;
        const url = doi ? `https://doi.org/${doi}` : `https://www.semanticscholar.org/paper/${paper.paperId}`;
        const publishedAt = paper.publicationDate || (paper.year ? `${paper.year}-01-01` : null);
        if (!paper.title || !publishedAt || urls.has(url) || new Date(publishedAt).getTime() < recentCutoff) continue;
        rows.push({ id: nextId++, title: paper.title, abstract: paper.abstract ?? null, authors: JSON.stringify((paper.authors ?? []).map(a => a.name)), url, pdfUrl: paper.openAccessPdf?.url ?? null, source: paper.venue || "Semantic Scholar", sourceId: paper.paperId, categoryId: null, topic: topic(paper.title, paper.abstract ?? ""), publishedAt, fetchedAt: new Date().toISOString(), createdAt: new Date().toISOString() });
        urls.add(url); added++;
      }
      await new Promise(resolve => setTimeout(resolve, 1200));
    } catch (error) { console.warn(`research: ${query}: ${error.message}`); }
  }
  rows.sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
  await save("research", rows);
  return added;
}

const newsAdded = await updateNews();
const researchAdded = await updateResearch();
console.log(JSON.stringify({ newsAdded, researchAdded }));
