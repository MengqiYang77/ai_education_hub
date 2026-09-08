import { readFile, writeFile } from "node:fs/promises";

const dataDir = new URL("../client/public/data/", import.meta.url);
const recentCutoff = Date.now() - 1000 * 60 * 60 * 24 * 120;
const normalizeOnly = process.argv.includes("--normalize-only");
const researchOnly = process.argv.includes("--research-only");
const newsOnly = process.argv.includes("--news-only");

// Prefer first-party labs and engineering institutions. `focused` feeds only need
// a frontier-tech match; broad feeds must also match education or frontier tech.
const feeds = [
  { source: "MIT AI", url: "https://news.mit.edu/rss/topic/artificial-intelligence2", language: "en", focused: true },
  { source: "MIT Education", url: "https://news.mit.edu/rss/topic/education", language: "en", focused: true },
  { source: "Stanford HAI", url: "https://hai.stanford.edu/rss.xml", language: "en", focused: true },
  { source: "Stanford SAIL", url: "https://ai.stanford.edu/blog/feed.xml", language: "en", focused: true },
  { source: "Berkeley BAIR", url: "https://bair.berkeley.edu/blog/feed.xml", language: "en", focused: true },
  { source: "Google DeepMind", url: "https://deepmind.google/blog/rss.xml", language: "en", focused: true },
  { source: "Microsoft Research", url: "https://www.microsoft.com/en-us/research/feed/", language: "en", focused: true },
  { source: "IEEE Spectrum Robotics", url: "https://spectrum.ieee.org/feeds/topic/robotics.rss", language: "en", focused: true },
  { source: "NASA", url: "https://www.nasa.gov/feed/", language: "en", focused: false },
  { source: "Carnegie Mellon", url: "https://www.cmu.edu/news/rss/news.xml", language: "en", focused: false },
  { source: "Harvard Gazette", url: "https://news.harvard.edu/gazette/feed/", language: "en", focused: false },
  { source: "Berkeley News", url: "https://news.berkeley.edu/feed", language: "en", focused: false },
  { source: "Princeton", url: "https://www.princeton.edu/feed", language: "en", focused: false },
  { source: "Georgia Tech", url: "https://news.gatech.edu/rss.xml", language: "en", focused: false },
  { source: "量子位", url: "https://www.qbitai.com/feed", language: "zh", focused: true },
  { source: "雷锋网", url: "https://www.leiphone.com/feed", language: "zh", focused: true },
];

const patterns = {
  "AI Models & Agents": /artificial intelligence|\bai\b|machine learning|deep learning|generative|foundation model|large language model|\bllm\b|agentic|多模态|人工智能|机器学习|深度学习|生成式|基础模型|大模型|智能体/iu,
  "Robotics & Embodied AI": /robot|robotics|embodied|autonomous vehicle|drone|humanoid|physical ai|机器人|具身|无人机|自动驾驶|人形/iu,
  "Chips & Compute": /chip|semiconductor|gpu|accelerator|compute|data center|processor|silicon|photonics|芯片|半导体|算力|处理器|光子/iu,
  "Quantum Technology": /quantum|qubit|量子|量子位/iu,
  "Space & Aerospace": /spacecraft|satellite|rocket|lunar|mars|aerospace|space station|太空|航天|卫星|火箭|月球|火星/iu,
  "Bioengineering": /biotech|biology|protein|genom|drug discovery|medical device|neuroscience|生物科技|蛋白质|基因|药物|脑机|神经科学/iu,
  "Advanced Manufacturing": /manufactur|3d print|additive|materials science|battery|energy storage|fab lab|制造|3d打印|增材|材料科学|电池|储能/iu,
  "Education & Future Skills": /education|learning|teaching|classroom|student|teacher|curriculum|school|university|college|edtech|pedagogy|maker education|教育|学习|课程|学校|大学|高校|教学|学生|教师|课堂|创客/iu,
  "Policy & Society": /ethic|bias|fairness|polic|governance|privacy|safety|regulation|responsible ai|伦理|偏见|公平|政策|治理|隐私|安全|监管/iu,
};
const topicPriority = ["Robotics & Embodied AI", "Chips & Compute", "Quantum Technology", "Space & Aerospace", "Bioengineering", "Advanced Manufacturing", "Policy & Society", "Education & Future Skills", "AI Models & Agents"];
const frontierPattern = new RegExp(topicPriority.slice(0, 6).map(name => patterns[name].source).concat(patterns["AI Models & Agents"].source).join("|"), "iu");
const educationPattern = patterns["Education & Future Skills"];

const text = (xml, tag) => {
  const match = xml.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, "i"));
  return clean(match?.[1] ?? "");
};
const clean = value => value.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const detectLanguage = value => ((value.match(/[\u3400-\u9fff]/gu) ?? []).length >= 4 ? "zh" : "en");
const classifyTopic = value => topicPriority.find(name => patterns[name].test(value)) ?? "Other Frontier Tech";
const classifyFormats = value => {
  const formats = ["WeChat Deep Dive"];
  if (/launch|introduc|demo|robot|drone|space|3d print|发布|推出|演示|机器人|无人机|航天/iu.test(value)) formats.unshift("Short Video");
  if (/how|guide|tool|tips|classroom|student|teacher|如何|指南|工具|课堂|学生|教师/iu.test(value)) formats.unshift("Xiaohongshu Explainer");
  return [...new Set(formats)];
};
const normalizeNews = row => {
  const value = `${row.title ?? ""} ${row.description ?? ""}`;
  const language = detectLanguage(value);
  return { ...row, language, region: language === "zh" ? "China" : "Global", topic: classifyTopic(value), contentFormats: classifyFormats(value) };
};

async function read(name) { return JSON.parse(await readFile(new URL(`${name}.json`, dataDir), "utf8")); }
async function save(name, rows) { await writeFile(new URL(`${name}.json`, dataDir), `${JSON.stringify(rows, null, 2)}\n`); }
async function fetchWithTimeout(url) {
  return fetch(url, { signal: AbortSignal.timeout(20_000), headers: { "user-agent": "AIEducationHub/3.0 (admin@aieduhub.co)" } });
}

function parseFeed(xml) {
  const rssItems = [...xml.matchAll(/<item[ >]([\s\S]*?)<\/item>/gi)].map(match => match[1]);
  if (rssItems.length) return rssItems.map(item => ({
    title: text(item, "title"), description: text(item, "description") || text(item, "content:encoded"),
    url: text(item, "link") || text(item, "guid"), date: text(item, "pubDate") || text(item, "dc:date"),
  }));
  return [...xml.matchAll(/<entry[ >]([\s\S]*?)<\/entry>/gi)].map(match => match[1]).map(entry => ({
    title: text(entry, "title"), description: text(entry, "summary") || text(entry, "content"),
    url: entry.match(/<link[^>]+href=["']([^"']+)/i)?.[1] ?? text(entry, "id"), date: text(entry, "published") || text(entry, "updated"),
  }));
}

async function updateNews() {
  const rows = (await read("news")).map(normalizeNews);
  const urls = new Set(rows.map(row => row.url));
  let nextId = Math.max(0, ...rows.map(row => Number(row.id))) + 1;
  let added = 0;
  for (const feed of normalizeOnly ? [] : feeds) {
    try {
      const response = await fetchWithTimeout(feed.url);
      if (!response.ok) { console.warn(`news: ${feed.source}: HTTP ${response.status}`); continue; }
      for (const item of parseFeed(await response.text())) {
        const title = item.title;
        const description = item.description.slice(0, 1000);
        const url = item.url;
        const date = new Date(item.date || Date.now());
        const value = `${title} ${description}`;
        const language = detectLanguage(value);
        const relevant = feed.focused ? frontierPattern.test(value) || educationPattern.test(value) : frontierPattern.test(value) || (patterns["AI Models & Agents"].test(value) && educationPattern.test(value));
        if (!title || !url || urls.has(url) || language !== feed.language || !relevant || Number.isNaN(date.getTime()) || date.getTime() < recentCutoff) continue;
        rows.push(normalizeNews({ id: nextId++, title, description: description || null, url, imageUrl: null, source: feed.source, categoryId: null, publishedAt: date.toISOString(), createdAt: new Date().toISOString() }));
        urls.add(url); added++;
      }
    } catch (error) { console.warn(`news: ${feed.source}: ${error.message}`); }
  }
  rows.sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
  await save("news", rows);
  return added;
}

const researchQueries = ["artificial intelligence education", "generative AI teaching", "intelligent tutoring system", "AI literacy education", "robotics education", "data science education"];
const isoDate = date => date.toISOString().slice(0, 10);
// Semantic Scholar's regular search endpoint ranks by relevance. Repeating that
// query eventually returns the same older papers forever. Bulk search supports
// an explicit publication window and newest-first ordering, which makes it
// suitable for an incremental daily feed.
const researchWindowEnd = new Date();
const researchWindowStart = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
const researchTechnologyPattern = /artificial intelligence|\bai\b|machine learning|deep learning|generative|foundation model|large language model|\bllm\b|intelligent tutor|robot|embodied|data science|data literacy|computational thinking|人工智能|机器学习|大模型|机器人|具身|数据素养|计算思维/iu;
// Avoid treating the word "learning" in "machine/reinforcement learning" as
// evidence that a paper is about education.
const researchEducationPattern = /education|educational|teaching|classroom|student|learner|teacher|curriculum|school|university|college|pedagog|tutor|literacy|教育|学习者|教学|课堂|学生|教师|课程|学校|大学|高校|素养/iu;
const researchExcludedTitlePattern = /medical|medicine|nurs|clinical|patient|pharmac|radiolog|surg|dental|health profession|医学|医疗|护理|临床|患者|药学|放射|外科/iu;

async function fetchResearch(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const response = await fetchWithTimeout(url);
    if (response.status !== 429 && response.status < 500) return response;
    if (attempt < 3) await new Promise(resolve => setTimeout(resolve, attempt * 10_000));
  }
  return fetchWithTimeout(url);
}
function researchTopic(title, abstract) {
  const classified = classifyTopic(`${title} ${abstract}`);
  if (classified === "Robotics & Embodied AI") return "Robotics";
  if (classified === "Policy & Society") return "Policy & Ethics";
  if (classified === "Education & Future Skills") return "AI Education";
  if (/data science|data literacy|visuali|statistic|computational thinking/i.test(`${title} ${abstract}`)) return "Data Science";
  return "AI Education";
}

async function updateResearch() {
  const rows = await read("research");
  const urls = new Set(rows.map(row => row.url));
  const sourceIds = new Set(rows.map(row => row.sourceId).filter(Boolean));
  let nextId = Math.max(0, ...rows.map(row => Number(row.id))) + 1;
  let added = 0;
  let successfulQueries = 0;
  for (const query of researchQueries) {
    try {
      const params = new URLSearchParams({
        query,
        fields: "title,abstract,authors,publicationDate,year,venue,externalIds,openAccessPdf",
        sort: "publicationDate:desc",
        publicationDateOrYear: `${isoDate(researchWindowStart)}:${isoDate(researchWindowEnd)}`,
      });
      const response = await fetchResearch(`https://api.semanticscholar.org/graph/v1/paper/search/bulk?${params}`);
      if (!response.ok) {
        console.warn(`research: ${query}: HTTP ${response.status}`);
        continue;
      }
      successfulQueries++;
      const body = await response.json();
      let queryAdded = 0;
      for (const paper of body.data ?? []) {
        if (queryAdded >= 15) break;
        const doi = paper.externalIds?.DOI;
        const url = doi ? `https://doi.org/${doi}` : `https://www.semanticscholar.org/paper/${paper.paperId}`;
        const publishedAt = paper.publicationDate || (paper.year ? `${paper.year}-01-01` : null);
        const publishedTime = new Date(publishedAt).getTime();
        const searchable = `${paper.title ?? ""} ${paper.abstract ?? ""}`;
        const title = paper.title ?? "";
        if (!title || !publishedAt || !researchTechnologyPattern.test(title) || !researchEducationPattern.test(title) || researchExcludedTitlePattern.test(title) || !researchTechnologyPattern.test(searchable) || !researchEducationPattern.test(searchable) || urls.has(url) || sourceIds.has(paper.paperId) || Number.isNaN(publishedTime) || publishedTime < recentCutoff || publishedTime > Date.now()) continue;
        rows.push({ id: nextId++, title: paper.title, abstract: paper.abstract ?? null, authors: JSON.stringify((paper.authors ?? []).map(a => a.name)), url, pdfUrl: paper.openAccessPdf?.url ?? null, source: paper.venue || "Semantic Scholar", sourceId: paper.paperId, categoryId: null, topic: researchTopic(paper.title, paper.abstract ?? ""), publishedAt, fetchedAt: new Date().toISOString(), createdAt: new Date().toISOString() });
        urls.add(url); sourceIds.add(paper.paperId); added++; queryAdded++;
      }
      await new Promise(resolve => setTimeout(resolve, 8000));
    } catch (error) { console.warn(`research: ${query}: ${error.message}`); }
  }
  if (successfulQueries === 0) throw new Error("research: every Semantic Scholar query failed");
  rows.sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
  await save("research", rows);
  return added;
}

if (researchOnly && newsOnly) throw new Error("Choose only one of --research-only or --news-only");
const newsAdded = researchOnly ? 0 : await updateNews();
const researchAdded = normalizeOnly || newsOnly ? 0 : await updateResearch();
console.log(JSON.stringify({ newsAdded, researchAdded }));
