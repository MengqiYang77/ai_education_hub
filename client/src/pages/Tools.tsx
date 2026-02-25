import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useState } from "react";

export default function Tools() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const { data: categories } = trpc.categories.list.useQuery();
  const { data: tools } = trpc.tools.list.useQuery();

  const filteredTools = selectedCategory
    ? tools?.filter((item) => item.categoryId === selectedCategory)
    : tools;

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
          <h1 className="text-5xl font-bold mb-4">Essential Tools</h1>
          <p className="text-lg text-muted-foreground">
            Platforms for AI literacy, robotics, and data education
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-b border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 text-sm border transition-all ${
                selectedCategory === null
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:border-foreground"
              }`}
            >
              All Categories
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
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section>
        <div className="max-w-6xl mx-auto px-6 py-16">
          {filteredTools && filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTools.map((tool) => (
                <a
                  key={tool.id}
                  href={tool.websiteUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group border border-border hover:border-foreground transition-all p-8"
                >
                  <article className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2 group-hover:opacity-60 transition-opacity">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {tool.description}
                      </p>
                    </div>
                    
                    {tool.targetAudience && (
                      <div className="text-xs">
                        <span className="font-semibold">Target:</span>{" "}
                        <span className="text-muted-foreground">{tool.targetAudience}</span>
                      </div>
                    )}
                    
                    {tool.skillsDeveloped && (
                      <div className="text-xs">
                        <span className="font-semibold">Skills:</span>{" "}
                        <span className="text-muted-foreground">{tool.skillsDeveloped}</span>
                      </div>
                    )}
                    
                    {tool.pricing && (
                      <div className="text-xs pt-2 border-t border-border">
                        <span className="font-semibold">Pricing:</span>{" "}
                        <span className="text-muted-foreground">{tool.pricing}</span>
                      </div>
                    )}
                  </article>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No tools found for this category.</p>
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
