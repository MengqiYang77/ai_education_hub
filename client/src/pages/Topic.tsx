import { trpc } from "@/lib/trpc";
import { Link, useParams } from "wouter";

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

export default function Topic() {
  const { topicName } = useParams<{ topicName: string }>();
  const decodedTopic = decodeURIComponent(topicName ?? "");

  const { data: news, isLoading: newsLoading } = trpc.news.byTopic.useQuery(
    { keyword: decodedTopic, limit: 8 },
    { enabled: !!decodedTopic }
  );

  const { data: research, isLoading: researchLoading } = trpc.research.byTopic.useQuery(
    { topic: decodedTopic, limit: 8 },
    { enabled: !!decodedTopic }
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="border-b border-border sticky top-0 bg-background z-10">
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

      {/* Hero */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="mb-2">
            <Link href="/" className="text-sm text-muted-foreground hover:opacity-60 transition-opacity">
              ← Back to Home
            </Link>
          </div>
          <h1 className="text-6xl font-bold mt-4 mb-3">{decodedTopic}</h1>
          <p className="text-lg text-muted-foreground">
            News and research on {decodedTopic} in AI-era education
          </p>
        </div>
      </section>

      {/* Dual-column News + Research */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

            {/* News Column */}
            <div className="space-y-8">
              <div>
                <h2 className="text-5xl font-bold mb-4">News</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Latest developments about {decodedTopic}
                </p>
              </div>

              <div className="space-y-6">
                {newsLoading && (
                  <div className="space-y-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="pb-6 border-b border-border last:border-0 space-y-2">
                        <div className="h-3 bg-muted rounded w-20 animate-pulse" />
                        <div className="h-5 bg-muted rounded w-full animate-pulse" />
                        <div className="h-5 bg-muted rounded w-3/4 animate-pulse" />
                        <div className="h-3 bg-muted rounded w-24 animate-pulse" />
                      </div>
                    ))}
                  </div>
                )}
                {!newsLoading && news && news.length > 0 && news.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block pb-6 border-b border-border last:border-0"
                  >
                    <article>
                      {item.source && (
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {item.source}
                        </span>
                      )}
                      <h3 className="text-xl font-bold mt-2 mb-2 group-hover:opacity-60 transition-opacity">
                        {item.title}
                      </h3>
                      <time className="text-xs text-muted-foreground">
                        {new Date(item.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </time>
                    </article>
                  </a>
                ))}
                {!newsLoading && (!news || news.length === 0) && (
                  <p className="text-muted-foreground text-sm py-8 border-b border-border">
                    No news articles found for this topic yet. Check back after the next scheduled fetch.
                  </p>
                )}
              </div>

              <div className="pt-4">
                <Link href="/news">
                  <span className="inline-flex items-center justify-center px-6 py-3 text-base font-medium border-2 border-foreground hover:bg-foreground hover:text-background transition-colors cursor-pointer">
                    View All News
                  </span>
                </Link>
              </div>
            </div>

            {/* Research Column */}
            <div className="space-y-8">
              <div>
                <h2 className="text-5xl font-bold mb-4">Research</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Peer-reviewed papers on {decodedTopic}
                </p>
              </div>

              <div className="space-y-6">
                {researchLoading && (
                  <div className="space-y-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="pb-6 border-b border-border last:border-0 space-y-2">
                        <div className="h-3 bg-muted rounded w-20 animate-pulse" />
                        <div className="h-5 bg-muted rounded w-full animate-pulse" />
                        <div className="h-5 bg-muted rounded w-3/4 animate-pulse" />
                        <div className="h-3 bg-muted rounded w-24 animate-pulse" />
                      </div>
                    ))}
                  </div>
                )}
                {!researchLoading && research && research.length > 0 && research.map((paper) => (
                  <a
                    key={paper.id}
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block pb-6 border-b border-border last:border-0"
                  >
                    <article>
                      {paper.source && (
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {paper.source}
                        </span>
                      )}
                      <h3 className="text-xl font-bold mt-2 mb-2 group-hover:opacity-60 transition-opacity">
                        {paper.title}
                      </h3>
                      {paper.authors && (
                        <p className="text-sm text-muted-foreground mb-1 line-clamp-1">
                          {parseAuthors(paper.authors)}
                        </p>
                      )}
                      <time className="text-xs text-muted-foreground">
                        {new Date(paper.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </time>
                    </article>
                  </a>
                ))}
                {!researchLoading && (!research || research.length === 0) && (
                  <p className="text-muted-foreground text-sm py-8 border-b border-border">
                    No research papers found for this topic yet.
                  </p>
                )}
              </div>

              <div className="pt-4">
                <Link href={`/research?topic=${encodeURIComponent(decodedTopic)}`}>
                  <span className="inline-flex items-center justify-center px-6 py-3 text-base font-medium border-2 border-foreground hover:bg-foreground hover:text-background transition-colors cursor-pointer">
                    View All Research
                  </span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="pt-8 border-t border-border text-sm text-muted-foreground">
            <p>© 2026 AI Education Research Hub</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
