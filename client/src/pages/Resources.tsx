import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useState } from "react";

export default function Resources() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const { data: categories } = trpc.categories.list.useQuery();
  const { data: content } = trpc.content.list.useQuery({ limit: 100 });

  const filteredContent = selectedCategory
    ? content?.filter((item) => item.categoryId === selectedCategory)
    : content;

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
          <h1 className="text-5xl font-bold mb-4">Research & Resources</h1>
          <p className="text-lg text-muted-foreground">
            Expert-curated frameworks and studies from leading institutions
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
          </div>
        </div>
      </section>

      {/* Content List */}
      <section>
        <div className="max-w-6xl mx-auto px-6 py-16">
          {filteredContent && filteredContent.length > 0 ? (
            <div className="space-y-12">
              {filteredContent.map((item, idx) => (
                <Link key={item.id} href={`/resource/${item.slug}`}>
                  <article className="group cursor-pointer">
                    <div className={`grid ${idx === 0 ? "md:grid-cols-2" : "md:grid-cols-3"} gap-8 pb-12 border-b border-border last:border-0`}>
                      {item.imageUrl && (
                        <div className={`${idx === 0 ? "md:col-span-1" : "md:col-span-1"} overflow-hidden bg-muted`}>
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-64 object-cover group-hover:opacity-80 transition-opacity"
                          />
                        </div>
                      )}
                      <div className={`${idx === 0 ? "md:col-span-1" : "md:col-span-2"} flex flex-col justify-center`}>
                        <h3 className={`${idx === 0 ? "text-3xl" : "text-2xl"} font-bold mb-3 group-hover:opacity-60 transition-opacity`}>
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 leading-relaxed">
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
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No resources found for this category.</p>
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
