import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");

  // Get query from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q") || "";
    setSearchQuery(q);
    setActiveQuery(q);
  }, []);

  const { data: contentResults } = trpc.content.search.useQuery(
    { query: activeQuery },
    { enabled: activeQuery.length > 0 }
  );

  const { data: toolResults } = trpc.tools.search.useQuery(
    { query: activeQuery },
    { enabled: activeQuery.length > 0 }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveQuery(searchQuery.trim());
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const totalResults = (contentResults?.length || 0) + (toolResults?.length || 0);

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
              <Link href="/resources" className="text-sm hover:opacity-60 transition-opacity">
                Resources
              </Link>
              <Link href="/tools" className="text-sm hover:opacity-60 transition-opacity">
                Tools
              </Link>
              <Link href="/news" className="text-sm hover:opacity-60 transition-opacity">
                News
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h1 className="text-4xl font-bold mb-8">Search</h1>
          
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search research, tools, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-base border-foreground/20 focus:border-foreground"
              />
            </div>
          </form>

          {activeQuery && (
            <p className="text-muted-foreground">
              {totalResults} {totalResults === 1 ? "result" : "results"} for "{activeQuery}"
            </p>
          )}
        </div>
      </section>

      {/* Results */}
      <section>
        <div className="max-w-6xl mx-auto px-6 py-16">
          {activeQuery ? (
            <>
              {/* Content Results */}
              {contentResults && contentResults.length > 0 && (
                <div className="mb-16">
                  <h2 className="text-2xl font-bold mb-8 pb-4 border-b border-border">
                    Research & Resources ({contentResults.length})
                  </h2>
                  <div className="space-y-8">
                    {contentResults.map((item) => (
                      <Link key={item.id} href={`/resource/${item.slug}`}>
                        <article className="group cursor-pointer pb-8 border-b border-border last:border-0">
                          <h3 className="text-xl font-bold mb-2 group-hover:opacity-60 transition-opacity">
                            {item.title}
                          </h3>
                          <p className="text-muted-foreground mb-3">
                            {item.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {item.publishedAt && (
                              <time>
                                {new Date(item.publishedAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </time>
                            )}
                            <span>·</span>
                            <span>{item.viewCount} reads</span>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Tool Results */}
              {toolResults && toolResults.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-8 pb-4 border-b border-border">
                    Tools ({toolResults.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {toolResults.map((tool) => (
                      <a
                        key={tool.id}
                        href={tool.websiteUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group border border-border hover:border-foreground transition-all p-6"
                      >
                        <h3 className="text-lg font-bold mb-2 group-hover:opacity-60 transition-opacity">
                          {tool.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {tool.description}
                        </p>
                        {tool.pricing && (
                          <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                            {tool.pricing}
                          </p>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {totalResults === 0 && (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg mb-2">No results found</p>
                  <p className="text-sm text-muted-foreground">
                    Try different keywords or browse by category
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Enter a search query to find resources and tools</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2026 AI Education Research Hub</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
