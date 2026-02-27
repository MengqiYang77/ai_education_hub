import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useState } from "react";

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<"all" | "en" | "zh">("all");
  
  const { data: categories } = trpc.categories.list.useQuery();
  const { data: news } = trpc.news.recent.useQuery({ limit: 200 });

  // Filter by category and language
  const filteredNews = news?.filter((item) => {
    const categoryMatch = selectedCategory ? item.categoryId === selectedCategory : true;
    const languageMatch = selectedLanguage === "all" ? true : item.language === selectedLanguage;
    return categoryMatch && languageMatch;
  });

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
              <Link href="/admin" className="text-sm hover:opacity-60 transition-opacity">
                Admin
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

      {/* Language Filter */}
      <section className="border-b border-border bg-muted/10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedLanguage("all")}
              className={`px-4 py-2 text-sm transition-colors ${
                selectedLanguage === "all"
                  ? "bg-foreground text-background"
                  : "bg-transparent hover:bg-muted"
              }`}
            >
              All Sources
            </button>
            <button
              onClick={() => setSelectedLanguage("en")}
              className={`px-4 py-2 text-sm transition-colors ${
                selectedLanguage === "en"
                  ? "bg-foreground text-background"
                  : "bg-transparent hover:bg-muted"
              }`}
            >
              International
            </button>
            <button
              onClick={() => setSelectedLanguage("zh")}
              className={`px-4 py-2 text-sm transition-colors ${
                selectedLanguage === "zh"
                  ? "bg-foreground text-background"
                  : "bg-transparent hover:bg-muted"
              }`}
            >
              Domestic
            </button>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-b border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 text-sm transition-colors ${
                selectedCategory === null
                  ? "bg-foreground text-background"
                  : "bg-transparent hover:bg-muted"
              }`}
            >
              All Topics
            </button>
            {categories?.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 text-sm transition-colors ${
                  selectedCategory === category.id
                    ? "bg-foreground text-background"
                    : "bg-transparent hover:bg-muted"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          {!filteredNews || filteredNews.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No news items found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  {item.imageUrl && (
                    <div className="aspect-[16/9] bg-muted mb-4 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      {item.source}
                    </p>
                    <h3 className="text-xl font-bold leading-tight group-hover:opacity-60 transition-opacity">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {item.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-24">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2026 AI Education Research. Curated insights for K-12 educators.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
