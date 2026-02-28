import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useState } from "react";
import { RefreshCw } from "lucide-react";

type TabMode = "all" | "china";

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [tabMode, setTabMode] = useState<TabMode>("all");
  const [fetchMsg, setFetchMsg] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const { data: categories } = trpc.categories.list.useQuery();
  const { data: allNews } = trpc.news.recent.useQuery({ limit: 100 });
  const { data: chinaNews } = trpc.news.byLanguage.useQuery({ language: "zh", limit: 60 });

  const activeNews = tabMode === "china" ? chinaNews : allNews;

  const filteredNews =
    tabMode === "china"
      ? chinaNews
      : selectedCategory
      ? allNews?.filter((item) => item.categoryId === selectedCategory)
      : allNews;

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

      {/* Page Header */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h1 className="text-5xl font-bold mb-4">Latest News</h1>
          <p className="text-lg text-muted-foreground">
            Recent developments from top research institutions and industry leaders
          </p>
        </div>
      </section>

      {/* Tab + Filter Bar */}
      <section className="border-b border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            {/* Language tabs */}
            <button
              onClick={() => { setTabMode("all"); setSelectedCategory(null); }}
              className={`px-4 py-2 text-sm border transition-all ${
                tabMode === "all"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:border-foreground"
              }`}
            >
              🌐 Global
            </button>
            <button
              onClick={() => { setTabMode("china"); setSelectedCategory(null); }}
              className={`px-4 py-2 text-sm border transition-all ${
                tabMode === "china"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:border-foreground"
              }`}
            >
              🇨🇳 China
            </button>

            {/* Category filters — only shown in Global tab */}
            {tabMode === "all" && (
              <>
                <span className="border-l border-border mx-1" />
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 text-sm border transition-all ${
                    selectedCategory === null
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground"
                  }`}
                >
                  All Topics
                </button>
                {categories?.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 text-sm border transition-all ${
                      selectedCategory === cat.id
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {fetchMsg && <span className="text-sm text-muted-foreground">{fetchMsg}</span>}
            <button
              onClick={() => window.location.href = '/admin'}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-border hover:border-foreground transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Update News
            </button>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section>
        <div className="max-w-6xl mx-auto px-6 py-16">
          {filteredNews && filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <article className="space-y-3">
                    {item.imageUrl && (
                      <div className="aspect-[16/9] overflow-hidden bg-muted">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                        />
                      </div>
                    )}
                    <div>
                      {item.source && (
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {item.source}
                        </span>
                      )}
                      <h3 className="text-lg font-bold mt-2 mb-2 group-hover:opacity-60 transition-opacity">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {item.description}
                        </p>
                      )}
                      <time className="text-xs text-muted-foreground mt-2 block">
                        {new Date(item.publishedAt).toLocaleDateString(
                          tabMode === "china" ? "zh-CN" : "en-US",
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </time>
                    </div>
                  </article>
                </a>
              ))}
            </div>
          ) : tabMode === "china" && (!chinaNews || chinaNews.length === 0) ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-2">暂无中文新闻</p>
              <p className="text-sm text-muted-foreground">
                请前往 <a href="/admin" className="underline">Admin 页面</a> 点击「Fetch Latest News」抓取中文源
              </p>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No news items found for this category.</p>
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
