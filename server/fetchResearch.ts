/**
 * Research Paper Fetcher — Peer-Reviewed Only
 *
 * Strategy (no raw arXiv preprints):
 *   1. Semantic Scholar API  — search by journal venue, returns published papers
 *   2. ERIC API              — US Dept of Education, peer-reviewed filter ON
 *   3. arXiv cs.CY           — ONLY entries with journal_ref (already published)
 *
 * Target journals (all peer-reviewed, top-tier AI × Education):
 *   Computers & Education                        (Elsevier, IF ~12)
 *   Computers and Education: AI                  (Elsevier, open access)
 *   British Journal of Educational Technology    (Wiley, IF ~7)
 *   International Journal of AI in Education     (Springer)
 *   Journal of the Learning Sciences             (Taylor & Francis)
 *   Learning and Instruction                     (Elsevier)
 *   Journal of Learning Analytics                (SoLAR, open access)
 *   Educational Technology Research & Development(Springer)
 *   Journal of Educational Technology & Society  (open access)
 *   Education and Information Technologies       (Springer)
 *   npj Science of Learning                      (Nature, open access)
 *   Computers in Human Behavior                  (Elsevier)
 */

import { getDb } from "./db";
import { researchPapers, InsertResearchPaper } from "../drizzle/schema";

// ─── Helpers ───────────────────────────────────────────────────────────────────

const EDU_KEYWORDS = [
  "education", "learning", "teaching", "classroom", "student", "teacher",
  "curriculum", "pedagogy", "school", "university", "college", "k-12",
  "higher education", "e-learning", "edtech", "tutor", "instructional",
  "assessment", "literacy", "mooc", "online course", "adaptive learning",
  "personalized learning", "intelligent tutor", "learning analytics",
  "educational technology", "educational data", "academic performance",
  "learner", "instructor", "educator", "feedback",
];

function matchesEduFilter(title: string, abstract: string): boolean {
  const text = `${title} ${abstract}`.toLowerCase();
  return EDU_KEYWORDS.some(kw => text.includes(kw));
}

function classifyTopic(title: string, abstract: string): string {
  const text = `${title} ${abstract}`.toLowerCase();
  if (text.match(/ethic|bias|fairness|polic|governance|regulat|privacy|equity|justice/))
    return "Policy & Ethics";
  if (text.match(/robot|physical computing|arduino|raspberry|hardware|maker/))
    return "Robotics";
  if (text.match(/data science|data literacy|visuali|statistic|computational thinking/))
    return "Data Science";
  if (text.match(/emotion|empathy|social.skill|soft skill|wellbeing|mental health/))
    return "Human Skills";
  return "AI Education";
}

function cleanText(t: string): string {
  return t.replace(/\s+/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">").replace(/&quot;/g, '"').trim();
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

// ─── 1. Semantic Scholar ───────────────────────────────────────────────────────

const S2_FIELDS = "title,abstract,authors,year,publicationDate,journal,externalIds,openAccessPdf";

const S2_VENUES = [
  { venue: "Computers & Education",                                        shortName: "C&E" },
  { venue: "Computers and Education: Artificial Intelligence",              shortName: "C&E AI" },
  { venue: "British Journal of Educational Technology",                     shortName: "BJET" },
  { venue: "International Journal of Artificial Intelligence in Education", shortName: "IJAIED" },
  { venue: "Journal of the Learning Sciences",                              shortName: "JLS" },
  { venue: "Learning and Instruction",                                      shortName: "L&I" },
  { venue: "Journal of Learning Analytics",                                 shortName: "JLA" },
  { venue: "Educational Technology Research and Development",               shortName: "ETR&D" },
  { venue: "Journal of Educational Technology & Society",                   shortName: "JETS" },
  { venue: "Education and Information Technologies",                        shortName: "EAIT" },
  { venue: "npj Science of Learning",                                       shortName: "npj SoL" },
  { venue: "Computers in Human Behavior",                                   shortName: "CHB" },
];

const S2_QUERIES = [
  "artificial intelligence education",
  "large language model learning",
  "generative AI teaching students",
  "intelligent tutoring system",
  "machine learning educational",
];

interface S2Paper {
  paperId: string;
  title: string;
  abstract?: string;
  authors?: Array<{ name: string }>;
  year?: number;
  publicationDate?: string;
  externalIds?: { DOI?: string };
  openAccessPdf?: { url: string };
}

async function fetchS2(query: string, venue: string): Promise<S2Paper[]> {
  const params = new URLSearchParams({ query, venue, fields: S2_FIELDS, limit: "50" });
  const url = `https://api.semanticscholar.org/graph/v1/paper/search?${params}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "AIEducationHub/1.0 (admin@aieduhub.co)" },
    });
    if (res.status === 429) { await sleep(15000); return []; }
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.data || []) as S2Paper[];
  } catch { return []; }
}

// ─── 2. ERIC ──────────────────────────────────────────────────────────────────

interface EricDoc {
  id: string;
  title: string;
  description?: string;
  author?: string | string[];
  publicationdate?: string;
  sourcetitle?: string;
}

async function fetchEric(query: string): Promise<EricDoc[]> {
  const params = new URLSearchParams({
    q: query, rows: "40", format: "json", fq: "peerreviewed:T",
  });
  try {
    const res = await fetch(`https://api.eric.ed.gov/efts/?${params}`, {
      headers: { "User-Agent": "AIEducationHub/1.0 (admin@aieduhub.co)" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.response?.docs || []) as EricDoc[];
  } catch { return []; }
}

const ERIC_QUERIES = [
  'artificial intelligence "British Journal of Educational Technology"',
  'artificial intelligence "Computers & Education"',
  '"Journal of Learning Analytics" artificial intelligence',
  '"Journal of the Learning Sciences" artificial intelligence',
  '"large language model" education students',
  '"generative AI" classroom teaching',
  '"ChatGPT" K-12 school',
  '"intelligent tutoring" 2024',
  'machine learning adaptive personalized education',
  'AI literacy educational technology',
];

// ─── 3. arXiv cs.CY — published papers only ───────────────────────────────────

async function fetchArxivPublished(): Promise<Array<{
  title: string; abstract: string; authors: string[];
  published: string; link: string; pdfLink: string; journalRef: string;
}>> {
  const results = [];
  const queries = [
    'cat:cs.CY AND ti:("artificial intelligence" OR "machine learning" OR "generative AI") AND ti:(education OR learning OR teaching)',
    'cat:cs.CY AND abs:("large language model") AND abs:(education OR student)',
  ];

  for (const q of queries) {
    await sleep(3000); // arXiv TOS: polite delay
    const params = new URLSearchParams({
      search_query: q, sortBy: "submittedDate", sortOrder: "descending", max_results: "80",
    });
    try {
      const res = await fetch(`https://export.arxiv.org/api/query?${params}`, {
        headers: { "User-Agent": "AIEducationHub/1.0 (admin@aieduhub.co)" },
      });
      if (!res.ok) continue;
      const xml = await res.text();

      for (const [, entry] of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
        // Only published papers have journal_ref
        const journalRef = entry.match(/<arxiv:journal_ref>([\s\S]*?)<\/arxiv:journal_ref>/)?.[1]?.trim();
        if (!journalRef) continue;

        const id = entry.match(/<id>(.*?)<\/id>/)?.[1]?.split("/abs/").pop() || "";
        const title = cleanText(entry.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "");
        const abstract = cleanText(entry.match(/<summary>([\s\S]*?)<\/summary>/)?.[1] || "");
        const published = entry.match(/<published>(.*?)<\/published>/)?.[1] || "";
        const authors = [...entry.matchAll(/<name>(.*?)<\/name>/g)].map(m => m[1].trim());

        if (title && matchesEduFilter(title, abstract)) {
          results.push({ title, abstract, authors, published, journalRef,
            link: `https://arxiv.org/abs/${id}`,
            pdfLink: `https://arxiv.org/pdf/${id}`,
          });
        }
      }
    } catch (err) {
      console.error("[arXiv]", err);
    }
  }
  return results;
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export async function fetchAndStoreResearchPapers(): Promise<{ added: number; skipped: number }> {
  console.log("[fetchResearch] Starting (peer-reviewed only)...");

  const db = await getDb();
  if (!db) return { added: 0, skipped: 0 };

  const toInsert: InsertResearchPaper[] = [];
  const seen = new Set<string>();

  // ── Semantic Scholar ──
  console.log("[fetchResearch] → Semantic Scholar");
  for (const { venue, shortName } of S2_VENUES) {
    for (const query of S2_QUERIES.slice(0, 3)) {
      await sleep(600);
      const papers = await fetchS2(query, venue);
      for (const p of papers) {
        if (!p.title || !p.year) continue;
        if (!matchesEduFilter(p.title, p.abstract || "")) continue;
        const doi = p.externalIds?.DOI;
        const url = doi ? `https://doi.org/${doi}` : `https://www.semanticscholar.org/paper/${p.paperId}`;
        if (seen.has(url)) continue;
        seen.add(url);
        toInsert.push({
          title: p.title,
          abstract: p.abstract || null,
          authors: JSON.stringify((p.authors || []).map(a => a.name)),
          url, pdfUrl: p.openAccessPdf?.url || null,
          source: shortName, sourceId: p.paperId, categoryId: null,
          topic: classifyTopic(p.title, p.abstract || ""),
          publishedAt: p.publicationDate ? new Date(p.publicationDate) : new Date(`${p.year}-01-01`),
          fetchedAt: new Date(),
        });
      }
    }
  }
  console.log(`  → ${toInsert.length} from Semantic Scholar`);

  const s2Count = toInsert.length;

  // ── ERIC ──
  console.log("[fetchResearch] → ERIC");
  for (const q of ERIC_QUERIES) {
    await sleep(400);
    const docs = await fetchEric(q);
    for (const doc of docs) {
      if (!doc.title || !doc.publicationdate) continue;
      const abstract = doc.description || "";
      if (!matchesEduFilter(doc.title, abstract)) continue;
      const url = `https://eric.ed.gov/?id=${doc.id}`;
      if (seen.has(url)) continue;
      seen.add(url);
      const authRaw = doc.author;
      const authors = Array.isArray(authRaw) ? authRaw : authRaw ? [authRaw] : [];
      toInsert.push({
        title: doc.title, abstract: abstract || null,
        authors: JSON.stringify(authors), url, pdfUrl: null,
        source: doc.sourcetitle || "ERIC", sourceId: doc.id, categoryId: null,
        topic: classifyTopic(doc.title, abstract),
        publishedAt: new Date(doc.publicationdate), fetchedAt: new Date(),
      });
    }
  }
  console.log(`  → ${toInsert.length - s2Count} from ERIC`);

  const ericCount = toInsert.length;

  // ── arXiv (journal-ref only) ──
  console.log("[fetchResearch] → arXiv (published only)");
  const arxivPapers = await fetchArxivPublished();
  for (const p of arxivPapers) {
    if (seen.has(p.link)) continue;
    seen.add(p.link);
    toInsert.push({
      title: p.title, abstract: p.abstract || null,
      authors: JSON.stringify(p.authors), url: p.link, pdfUrl: p.pdfLink,
      source: `arXiv → ${p.journalRef.slice(0, 35)}${p.journalRef.length > 35 ? "…" : ""}`,
      sourceId: p.link.split("/abs/")[1], categoryId: null,
      topic: classifyTopic(p.title, p.abstract),
      publishedAt: new Date(p.published), fetchedAt: new Date(),
    });
  }
  console.log(`  → ${toInsert.length - ericCount} from arXiv (published)`);

  // ── Insert ──
  let added = 0, skipped = 0;
  for (const paper of toInsert) {
    try {
      await (db as any).insert(researchPapers).values(paper)
        .onDuplicateKeyUpdate({ set: { fetchedAt: new Date() } });
      added++;
    } catch (err: any) {
      if (err?.code === "ER_DUP_ENTRY") skipped++;
      else { console.error("[insert]", err?.message); skipped++; }
    }
  }

  console.log(`[fetchResearch] Done — added:${added} dupes:${skipped}`);
  return { added, skipped };
}
