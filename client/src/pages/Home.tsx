import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: categories } = trpc.categories.list.useQuery();
  const { data: latestNews } = trpc.news.recent.useQuery({ limit: 6 });
  const { data: latestResearch } = trpc.research.list.useQuery({ limit: 6 });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Header */}
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
            </nav>
          </div>
        </div>
      </header>

      {/* Hero - Minimal */}
      <section className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Curated Research on<br />AI-Era Education
          </h1>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Top-tier insights from Stanford, MIT, Harvard, and leading research institutions 
            on preparing K-12 students for an AI-driven world.
          </p>
          
          {/* Minimal Search */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search research, tools, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-base border-foreground/20 focus:border-foreground"
              />
            </div>
          </form>
        </div>
      </section>

      {/* Categories - Minimal Pills */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories?.map((cat) => (
              <Link key={cat.id} href={`/category/${cat.slug}`}>
                <span className="inline-block px-4 py-2 text-sm border border-border hover:border-foreground hover:bg-secondary/50 transition-all cursor-pointer">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Education News Section */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-3">Latest Education News</h2>
              <p className="text-muted-foreground">Recent developments in K-12 education, pedagogy, and learning technology</p>
            </div>
            <Link href="/news">
              <Button variant="ghost" className="gap-2">
                View All News
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="space-y-8">
            {latestNews?.map((item) => (
              <article key={item.id} className="border-b border-border pb-8 last:border-0">
                <div className="flex gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span>{item.source}</span>
                      <span>•</span>
                      <time>{formatDate(item.publishedAt)}</time>
                    </div>
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <h3 className="text-xl font-bold mb-2 group-hover:opacity-60 transition-opacity">
                        {item.title}
                      </h3>
                    </a>
                    {item.description && (
                      <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Research Papers Section */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-3">Latest Research Papers</h2>
              <p className="text-muted-foreground">Cutting-edge research from top universities and institutions</p>
            </div>
            <Link href="/research">
              <Button variant="ghost" className="gap-2">
                View All Research
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="space-y-8">
            {latestResearch?.map((paper) => (
              <article key={paper.id} className="border-b border-border pb-8 last:border-0">
                <div className="flex gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span>{paper.institution || paper.source}</span>
                      <span>•</span>
                      <time>{formatDate(paper.publishedAt)}</time>
                    </div>
                    <a 
                      href={paper.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <h3 className="text-xl font-bold mb-2 group-hover:opacity-60 transition-opacity">
                        {paper.title}
                      </h3>
                    </a>
                    {paper.authors && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {paper.authors}
                      </p>
                    )}
                    {paper.abstract && (
                      <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                        {paper.abstract}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-bold mb-4">About</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A curated platform for K-12 educators and researchers to stay informed 
                about the latest developments in AI-era education.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <nav className="flex flex-col gap-2">
                <Link href="/resources" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Resources
                </Link>
                <Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Tools
                </Link>
                <Link href="/news" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  News
                </Link>
                <Link href="/research" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Research
                </Link>
              </nav>
            </div>
            <div>
              <h3 className="font-bold mb-4">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {categories?.slice(0, 5).map((cat) => (
                  <Link key={cat.id} href={`/category/${cat.slug}`}>
                    <span className="inline-block px-3 py-1 text-xs border border-border hover:border-foreground transition-colors cursor-pointer">
                      {cat.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2026 AI Education Research. Curated for K-12 educators and researchers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
