import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: categories } = trpc.categories.list.useQuery();
  const { data: curatedContent } = trpc.content.list.useQuery({ limit: 6 });
  const { data: news } = trpc.news.recent.useQuery({ limit: 12 });
  const { data: featuredTools } = trpc.tools.featured.useQuery({ limit: 8 });

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

      {/* Curated Content - NYT Style */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-3">Featured Research</h2>
            <p className="text-muted-foreground">Expert-curated frameworks and studies from leading institutions</p>
          </div>

          <div className="space-y-12">
            {curatedContent?.map((content, idx) => (
              <Link key={content.id} href={`/resource/${content.slug}`}>
                <article className="group cursor-pointer">
                  <div className={`grid ${idx === 0 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-8 pb-12 border-b border-border last:border-0`}>
                    {content.imageUrl && (
                      <div className={`${idx === 0 ? 'md:col-span-1' : 'md:col-span-1'} overflow-hidden bg-muted`}>
                        <img
                          src={content.imageUrl}
                          alt={content.title}
                          className="w-full h-64 object-cover group-hover:opacity-80 transition-opacity"
                        />
                      </div>
                    )}
                    <div className={`${idx === 0 ? 'md:col-span-1' : 'md:col-span-2'} flex flex-col justify-center`}>
                      <h3 className={`${idx === 0 ? 'text-3xl' : 'text-2xl'} font-bold mb-3 group-hover:opacity-60 transition-opacity`}>
                        {content.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {content.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {content.publishedAt && (
                          <time>{new Date(content.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                        )}
                        <span>·</span>
                        <span>{content.viewCount} reads</span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/resources">
              <span className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium border border-foreground hover:bg-foreground hover:text-background transition-colors cursor-pointer">
                View All Research
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Tools - Grid Layout */}
      <section className="border-b border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-3">Essential Tools</h2>
            <p className="text-muted-foreground">Platforms for AI literacy, robotics, and data education</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {featuredTools?.map((tool) => (
              <Link key={tool.id} href={`/tool/${tool.slug}`}>
                <div className="bg-background p-8 hover:bg-muted/50 transition-colors cursor-pointer h-full">
                  <h3 className="text-lg font-bold mb-2">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {tool.description}
                  </p>
                  {tool.pricing && (
                    <span className="text-xs text-muted-foreground">{tool.pricing}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/tools">
              <span className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium border border-foreground hover:bg-foreground hover:text-background transition-colors cursor-pointer">
                Browse All Tools
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News - Compact List */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-3">Latest Updates</h2>
            <p className="text-muted-foreground">Recent developments from top research institutions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news?.map((item) => (
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
                    <h3 className="text-lg font-bold mt-2 mb-2 group-hover:opacity-60 transition-opacity line-clamp-2">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <time className="text-xs text-muted-foreground mt-2 block">
                      {new Date(item.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </time>
                  </div>
                </article>
              </a>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/news">
              <span className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium border border-foreground hover:bg-foreground hover:text-background transition-colors cursor-pointer">
                All News
              </span>
            </Link>
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
