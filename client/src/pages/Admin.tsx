import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function Admin() {
  const [isUpdating, setIsUpdating] = useState(false);
  const { data: feedConfig } = trpc.rss.getFeedConfig.useQuery();
  const updateFeeds = trpc.rss.updateFeeds.useMutation();

  const handleUpdateFeeds = async () => {
    setIsUpdating(true);
    try {
      const result = await updateFeeds.mutateAsync();
      toast.success(
        `RSS Update Complete: ${result.totalSaved} new items from ${result.totalFetched} fetched`
      );
    } catch (error) {
      toast.error("Failed to update RSS feeds");
      console.error(error);
    } finally {
      setIsUpdating(false);
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
          <h1 className="text-5xl font-bold mb-4">RSS Feed Management</h1>
          <p className="text-lg text-muted-foreground">
            Manage and update RSS feeds from top research institutions
          </p>
        </div>
      </section>

      {/* RSS Update Section */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Update All Feeds</h2>
              <p className="text-muted-foreground">
                Fetch latest articles from all configured RSS sources
              </p>
            </div>
            <Button
              onClick={handleUpdateFeeds}
              disabled={isUpdating}
              className="px-8 py-6 text-base"
            >
              {isUpdating ? "Updating..." : "Update Now"}
            </Button>
          </div>

          {feedConfig && (
            <div className="bg-muted/30 border border-border p-6">
              <p className="text-sm">
                <span className="font-semibold">Total RSS Sources:</span> {feedConfig.totalCount}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Sources include Stanford, MIT, Harvard, OpenAI, DeepMind, and {feedConfig.totalCount - 5} more
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Feed List */}
      <section>
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-8">Configured RSS Feeds</h2>
          
          {feedConfig && feedConfig.feeds.length > 0 ? (
            <div className="space-y-4">
              {feedConfig.feeds.map((feed, idx) => (
                <div
                  key={idx}
                  className="border border-border p-6 hover:border-foreground transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold mb-1">{feed.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{feed.url}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="px-2 py-1 bg-muted border border-border">
                          {feed.category}
                        </span>
                        <span className="px-2 py-1 bg-muted border border-border">
                          {feed.language === "en" ? "English" : "中文"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No RSS feeds configured</p>
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
