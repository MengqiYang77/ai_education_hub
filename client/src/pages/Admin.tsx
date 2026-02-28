import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function Admin() {
  const [isFetchingNews, setIsFetchingNews] = useState(false);
  const [isFetchingResearch, setIsFetchingResearch] = useState(false);
  const [newsResult, setNewsResult] = useState<{added: number, skipped: number, time: string} | null>(null);
  const [researchResult, setResearchResult] = useState<{added: number, skipped: number, time: string} | null>(null);
  
  const fetchNews = trpc.news.fetch.useMutation();
  const fetchResearch = trpc.research.fetch.useMutation();
  const { data: stats, refetch: refetchStats } = trpc.news.stats.useQuery();

  const handleFetchNews = async () => {
    setIsFetchingNews(true);
    try {
      const result = await fetchNews.mutateAsync();
      setNewsResult({ added: result.added, skipped: result.skipped, time: new Date().toLocaleString() });
      toast.success(
        `News Fetch Complete: ${result.added} new articles, ${result.skipped} duplicates skipped`
      );
      refetchStats();
    } catch (error) {
      toast.error("Failed to fetch news");
      console.error(error);
    } finally {
      setIsFetchingNews(false);
    }
  };

  const handleFetchResearch = async () => {
    setIsFetchingResearch(true);
    try {
      const result = await fetchResearch.mutateAsync();
      setResearchResult({ added: result.added, skipped: result.skipped, time: new Date().toLocaleString() });
      toast.success(
        `Research Fetch Complete: ${result.added} new papers, ${result.skipped} duplicates skipped`
      );
      refetchStats();
    } catch (error) {
      toast.error("Failed to fetch research papers");
      console.error(error);
    } finally {
      setIsFetchingResearch(false);
    }
  };

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
              <Link href="/research" className="text-sm hover:opacity-60 transition-opacity">
                Research
              </Link>
              <Link href="/admin" className="text-sm font-semibold">
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h1 className="text-5xl font-bold mb-4">Content Management</h1>
          <p className="text-lg text-muted-foreground">
            Fetch latest news and research papers from universities and academic sources
          </p>
        </div>
      </section>

      {/* Database Statistics */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h2 className="text-xl font-bold mb-6">Database Statistics</h2>
          <div className="grid grid-cols-2 gap-6 max-w-sm">
            <div className="border border-border p-6 text-center">
              <div className="text-4xl font-bold mb-1">
                {stats ? stats.newsCount.toLocaleString() : "—"}
              </div>
              <div className="text-sm text-muted-foreground">News Articles</div>
            </div>
            <div className="border border-border p-6 text-center">
              <div className="text-4xl font-bold mb-1">
                {stats ? stats.researchCount.toLocaleString() : "—"}
              </div>
              <div className="text-sm text-muted-foreground">Research Papers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Fetch Controls */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* News Fetch */}
            <div className="border border-border p-8">
              <h2 className="text-2xl font-bold mb-2">University News</h2>
              <p className="text-muted-foreground mb-6">
                Fetch latest AI and education news from top 30 US universities
              </p>
              <Button
                onClick={handleFetchNews}
                disabled={isFetchingNews}
                className="w-full py-6 text-base"
              >
                {isFetchingNews ? "Fetching News..." : "Fetch Latest News"}
              </Button>
              {newsResult && (
                <p className="text-sm text-muted-foreground mt-2">
                  Last updated: {newsResult.time} · Added {newsResult.added}, skipped {newsResult.skipped}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-4">
                Sources: MIT, Stanford, Harvard, Berkeley, CMU, and 25+ more universities
              </p>
            </div>

            {/* Research Fetch */}
            <div className="border border-border p-8">
              <h2 className="text-2xl font-bold mb-2">Research Papers</h2>
              <p className="text-muted-foreground mb-6">
                Fetch peer-reviewed papers from Semantic Scholar and ERIC
              </p>
              <Button
                onClick={handleFetchResearch}
                disabled={isFetchingResearch}
                className="w-full py-6 text-base"
              >
                {isFetchingResearch ? "Fetching Research..." : "Fetch Latest Research"}
              </Button>
              {researchResult && (
                <p className="text-sm text-muted-foreground mt-2">
                  Last updated: {researchResult.time} · Added {researchResult.added}, skipped {researchResult.skipped}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-4">
                Topics: AI in education, LLMs for learning, educational technology
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section>
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-8">Data Sources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-border p-6">
              <h3 className="font-bold mb-4">News Sources (30+ Universities)</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• MIT News (AI + Education topics)</li>
                <li>• Stanford HAI & SAIL</li>
                <li>• Harvard Gazette</li>
                <li>• Berkeley News & BAIR</li>
                <li>• Carnegie Mellon</li>
                <li>• Princeton, Yale, Columbia, UChicago</li>
                <li>• Northwestern, Duke, Cornell, Penn</li>
                <li>• And 15+ more top universities</li>
              </ul>
            </div>

            <div className="border border-border p-6">
              <h3 className="font-bold mb-4">Research Sources</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Semantic Scholar API</li>
                <li>• ERIC (Education Resources Information Center)</li>
                <li>• Peer-reviewed papers only</li>
                <li>• AI + Education intersection</li>
                <li>• LLMs, educational technology, learning analytics</li>
              </ul>
            </div>
          </div>
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
