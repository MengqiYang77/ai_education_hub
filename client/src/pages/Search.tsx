import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ExternalLink, FileText, Newspaper } from "lucide-react";

function formatDate(dateStr: string | Date | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
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

export default function Search() {
  // Read q param synchronously — window.location.search is always available at render time
  const q = new URLSearchParams(window.location.search).get("q") ?? "";

  const { data: newsResults, isLoading: newsLoading } = trpc.news.searchByTitle.useQuery(
    { q },
    { enabled: !!q }
  );
  const { data: researchResults, isLoading: researchLoading } = trpc.research.searchByTitle.useQuery(
    { q },
    { enabled: !!q }
  );

  const newsCount = newsResults?.length ?? 0;
  const researchCount = researchResults?.length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
              <Link href="/research" className="text-sm hover:opacity-60 transition-opacity">Research</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Search header */}
      <section className="border-b border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 py-10">
          {q ? (
            <>
              <p className="text-sm text-muted-foreground mb-1">Search results for</p>
              <h1 className="text-3xl font-bold">"{q}"</h1>
              <p className="text-sm text-muted-foreground mt-2">
                {newsCount + researchCount} results — {newsCount} news articles, {researchCount} research papers
              </p>
            </>
          ) : (
            <h1 className="text-3xl font-bold text-muted-foreground">Enter a search term</h1>
          )}
        </div>
      </section>

      {/* Dual-column results */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {!q ? (
          <p className="text-muted-foreground text-center py-20">
            Use the search box on the homepage to find news and research.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left: News */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Newspaper className="w-5 h-5" />
                <h2 className="text-xl font-semibold">News</h2>
                <span className="text-sm text-muted-foreground ml-1">({newsCount})</span>
              </div>

              {newsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="border-b border-border pb-4 animate-pulse">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : newsCount === 0 ? (
                <p className="text-muted-foreground text-sm py-8">No news articles found for "{q}".</p>
              ) : (
                <div className="space-y-5">
                  {newsResults!.map(item => (
                    <div key={item.id} className="border-b border-border pb-5">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium leading-snug hover:underline block mb-1"
                      >
                        {item.title}
                      </a>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-medium">{item.source}</span>
                        {item.publishedAt && (
                          <>
                            <span>·</span>
                            <span>{formatDate(item.publishedAt)}</span>
                          </>
                        )}
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto hover:opacity-70"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Research */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <FileText className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Research</h2>
                <span className="text-sm text-muted-foreground ml-1">({researchCount})</span>
              </div>

              {researchLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="border-b border-border pb-4 animate-pulse">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : researchCount === 0 ? (
                <p className="text-muted-foreground text-sm py-8">No research papers found for "{q}".</p>
              ) : (
                <div className="space-y-5">
                  {researchResults!.map(paper => (
                    <div key={paper.id} className="border-b border-border pb-5">
                      <a
                        href={paper.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium leading-snug hover:underline block mb-1"
                      >
                        {paper.title}
                      </a>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                        {paper.authors && (
                          <span>{parseAuthors(paper.authors)}</span>
                        )}
                        {paper.publishedAt && (
                          <>
                            <span>·</span>
                            <span>{formatDate(paper.publishedAt)}</span>
                          </>
                        )}
                        <a
                          href={paper.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto hover:opacity-70"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
