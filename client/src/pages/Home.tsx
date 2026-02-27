import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: categories } = trpc.categories.list.useQuery();
  const { data: news } = trpc.news.recent.useQuery({ limit: 8 });
  const { data: research } = trpc.research.list.useQuery({ limit: 8 });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
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

      {/* Main Content Sections - News and Research */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* News Section */}
            <div className="space-y-8">
              <div>
                <h2 className="text-5xl font-bold mb-4">News</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Latest AI and education developments from top universities
                </p>
              </div>
              
              <div className="space-y-6">
                {news?.slice(0, 4).map((item) => (
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
              </div>

              <div className="pt-4">
                <Link href="/news">
                  <span className="inline-flex items-center justify-center px-6 py-3 text-base font-medium border-2 border-foreground hover:bg-foreground hover:text-background transition-colors cursor-pointer">
                    View All News
                  </span>
                </Link>
              </div>
            </div>

            {/* Research Section */}
            <div className="space-y-8">
              <div>
                <h2 className="text-5xl font-bold mb-4">Research</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Peer-reviewed papers from leading academic journals
                </p>
              </div>
              
              <div className="space-y-6">
                {research?.slice(0, 4).map((paper: any) => (
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
                          {paper.authors}
                        </p>
                      )}
                      <time className="text-xs text-muted-foreground">
                        {new Date(paper.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </time>
                    </article>
                  </a>
                ))}
              </div>

              <div className="pt-4">
                <Link href="/research">
                  <span className="inline-flex items-center justify-center px-6 py-3 text-base font-medium border-2 border-foreground hover:bg-foreground hover:text-background transition-colors cursor-pointer">
                    View All Research
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Footer - Minimal */}
      <footer className="bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">AI Education Research</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Curated insights for K-12 educators from top-tier research institutions.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-sm">Browse</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/resources" className="hover:text-foreground transition-colors">Research</Link></li>
                <li><Link href="/tools" className="hover:text-foreground transition-colors">Tools</Link></li>
                <li><Link href="/news" className="hover:text-foreground transition-colors">News</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-sm">Topics</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {categories?.slice(0, 4).map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/category/${cat.slug}`} className="hover:text-foreground transition-colors">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-sm">About</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border text-sm text-muted-foreground">
            <p>© 2026 AI Education Research Hub</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
