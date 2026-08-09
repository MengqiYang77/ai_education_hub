import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

function parseCsv(input) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (quoted) {
      if (c === '"' && input[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ""; }
    else if (c === '\n') { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += c;
  }
  if (field || row.length) { row.push(field.replace(/\r$/, "")); rows.push(row); }
  const [headers, ...records] = rows;
  return records.filter(r => r.some(Boolean)).map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ""])));
}

const numeric = new Set(["id", "categoryId", "authorId", "isPinned", "viewCount", "displayOrder", "isFeatured"]);
const nullable = new Set(["description", "content", "url", "imageUrl", "categoryId", "authors", "abstract", "pdfUrl", "sourceId", "topic", "detailedInfo", "websiteUrl", "pricing", "targetAudience", "skillsDeveloped", "language", "publishedAt"]);

function normalize(record) {
  return Object.fromEntries(Object.entries(record).map(([key, value]) => {
    if (value === "" && nullable.has(key)) return [key, null];
    if (numeric.has(key) && value !== "") return [key, Number(value)];
    return [key, value];
  }));
}

const files = {
  categories: "categories.csv",
  content: "curated_content.csv",
  news: "news_items.csv",
  tools: "tools.csv",
  research: "research_papers.csv",
};

const outDir = path.resolve("client/public/data");
await mkdir(outDir, { recursive: true });
for (const [name, file] of Object.entries(files)) {
  const records = parseCsv(await readFile(file, "utf8")).map(normalize);
  await writeFile(path.join(outDir, `${name}.json`), `${JSON.stringify(records, null, 2)}\n`);
  console.log(`${name}: ${records.length}`);
}
