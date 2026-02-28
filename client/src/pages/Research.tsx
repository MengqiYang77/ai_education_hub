import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, ExternalLink, FileText, RefreshCw } from "lucide-react";
import { Link, useSearch } from "wouter";

const TOPICS = ["All Topics", "AI Education", "Robotics", "Data Science", "Human Skills", "Policy & Ethics"];

const SOURCE_LABELS: Record<string, { label: string; color: string }> = {
  "arXiv": { label: "arXiv", color: "bg-[#b31b1b] text-white" },
  "ERIC": { label: "ERIC", color: "bg-[#003366] text-white" },
  "British Journal of Educational Technology": { label: "BJET", color: "bg-emerald-700 text-white" },
  "Computers & Education": { label: "C&E", color: "bg-indigo-700 text-white" },
  "International Journal of Artificial Intelligence in Education": { label: "IJAIED", color: "bg-purple-700 text-white" },
  "Journal of Learning Analytics": { label: "JLA", color: "bg-orange-700 text-white" },
};

function getSourceBadge(source: string) {
  const match = SOURCE_LABELS[source];
  if (match) return match;
  return { label: source.slice(0, 6), color: "bg-gray-600 text-white" };
}

function parseAuthors(authorsJson: string | null): string {
  if (!authorsJson) return "";
  try {
    const arr = JSON.parse(authorsJson) as string[];
    if (arr.length === 0) return "";
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return arr.join(" & ");
    return `${arr[0]} et al.`;
  } catch {
    return authorsJson;
  }
}

function formatDate(dateStr: string | Date): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function Research() {
  const searchString = useSearch();
  const urlTopic = new URLSearchParams(searchString).get("topic") ?? "";
  const initialTopic = TOPICS.includes(urlTopic) ? urlTopic : "All Topics";

  const [activeTopic, setActiveTopic] = useState(initialTopic);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [fetchMsg, setFetchMsg] = useState("");

  // Sync activeTopic when URL query param changes (e.g. navigating from Home)
  useEffect(() => {
    const t = new URLSearchParams(searchString).get("topic") ?? "";
    setActiveTopic(TOPICS.includes(t) ? t : "All Topics");
    setSearchQuery("");
    setSearchInput("");
  }, [searchString]);

  const topicParam = activeTopic === "All Topics" ? undefined : activeTopic;

  const { data: papers, isLoading, refetch } = searchQuery
    ? trpc.research.search.useQuery({ query: searchQuery }, { enabled: !!searchQuery })
    : trpc.research.list.useQuery({ limit: 50 });

  // Fetch mutation removed - using RSS update instead

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
    if (searchInput.trim()) setActiveTopic("All Topics");
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchInput("");
  };

  const handleFetch = () => {
    // Redirect to admin page for RSS update
    window.location.href = '/admin';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header — matches site style */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              AI Education Research
            </Link>
            <nav className="flex items-center gap-8">
              <Link href="/resources" className="text-sm hover:opacity-60 transition-opacity">Resources</Link>
              <Link href="/tools" className="text-sm hover:opacity-60 transition-opacity">Tools</Link>
              <Link href="/news" className="text-sm hover:opacity-60 transition-opacity">News</Link>
              <Link href="/research" className="text-sm font-semibold border-b border-foreground">Research</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl font-bold mb-4 leading-tight">Research Papers</h1>
          <p className="text-lg text-muted-foreground mb-2 max-w-2xl mx-auto leading-relaxed">
            Live papers from <strong>arXiv cs.CY</strong> and <strong>ERIC</strong> — filtered for AI × Education.
            Covers BJET, IJAIED, Computers & Education, Journal of Learning Analytics, and more.
          </p>
          <p className="text-sm text-muted-foreground mb-10">
            Updated automatically. {papers?.length ? `${papers.length} papers loaded.` : ""}
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search papers, authors, topics..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-12 h-14 text-base border-foreground/20 focus:border-foreground"
              />
            </div>
          </form>
          {searchQuery && (
            <button onClick={handleClearSearch} className="mt-3 text-sm text-muted-foreground underline underline-offset-2">
              ← Clear search: "{searchQuery}"
            </button>
          )}
        </div>
      </section>

      {/* Topic filters + Fetch button */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => { setActiveTopic(topic); setSearchQuery(""); setSearchInput(""); }}
                className={`px-4 py-2 text-sm border transition-all ${
                  activeTopic === topic && !searchQuery
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground hover:bg-secondary/50"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Manual fetch trigger */}
          <div className="flex items-center gap-3">
            {fetchMsg && <span className="text-sm text-muted-foreground">{fetchMsg}</span>}
            <button
              onClick={handleFetch}
              disabled={isFetching}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-border hover:border-foreground transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
              {isFetching ? "Fetching..." : "Fetch Latest"}
            </button>
          </div>
        </div>
      </section>

      {/* Data source info bar */}
      <section className="border-b border-border bg-muted/20">
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap gap-4 text-xs text-muted-foreground items-center">
          <span className="font-medium text-foreground">Sources:</span>
          <span><span className="inline-block px-2 py-0.5 bg-[#b31b1b] text-white text-xs mr-1">arXiv</span>cs.CY · cs.AI (education keyword filtered)</span>
          <span><span className="inline-block px-2 py-0.5 bg-[#003366] text-white text-xs mr-1">ERIC</span>BJET · IJAIED · C&amp;E · JLA · ETR&amp;D · JETS</span>
        </div>
      </section>

      {/* Papers list */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="space-y-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse pb-8 border-b border-border">
                <div className="h-4 bg-muted rounded w-24 mb-3" />
                <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2 mb-3" />
                <div className="h-16 bg-muted rounded w-full" />
              </div>
            ))}
          </div>
        ) : !papers || papers.length === 0 ? (
          <div className="text-center py-24">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No research papers found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? `No results for "${searchQuery}". Try different keywords.`
                : 'The database is empty. Click "Fetch Latest" above to pull papers from arXiv and ERIC.'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleFetch}
                disabled={isFetching}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium border border-foreground hover:bg-foreground hover:text-background transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
                {isFetching ? "Fetching..." : "Fetch Papers Now"}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-0">
            {papers.map((paper, idx) => {
              const badge = getSourceBadge(paper.source || 'Unknown');
              const authors = parseAuthors(paper.authors);
              const isLast = idx === papers.length - 1;

              return (
                <article
                  key={paper.id}
                  className={`py-8 ${!isLast ? "border-b border-border" : ""} group`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`inline-block px-2 py-0.5 text-xs font-medium ${badge.color}`}>
                          {badge.label}
                        </span>

                        <time className="text-xs text-muted-foreground">
                          {formatDate(paper.publishedAt)}
                        </time>
                      </div>

                      {/* Title */}
                      <a
                        href={paper.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <h2 className="text-xl font-bold leading-snug mb-2 group-hover:opacity-60 transition-opacity">
                          {paper.title}
                        </h2>
                      </a>

                      {/* Authors */}
                      {authors && (
                        <p className="text-sm text-muted-foreground mb-3">{authors}</p>
                      )}

                      {/* Abstract */}
                      {paper.abstract && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {paper.abstract}
                        </p>
                      )}
                    </div>

                    {/* Links */}
                    <div className="flex flex-col gap-2 shrink-0 pt-8">
                      <a
                        href={paper.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border px-3 py-1.5 hover:border-foreground"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View
                      </a>
                      {paper.pdfUrl && (
                        <a
                          href={paper.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border px-3 py-1.5 hover:border-foreground"
                        >
                          <FileText className="w-3 h-3" />
                          PDF
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-sm text-muted-foreground">
          © 2026 AI Education Research. Curated insights for K-12 educators.
        </div>
      </footer>
    </div>
  );
}
