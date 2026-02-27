import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function ResearchPapers() {
  // Research papers are English only, no language filter needed
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const { data: papers, isLoading } = trpc.research.list.useQuery({
    topic: categoryFilter || undefined,
  });

  const { data: categories } = trpc.categories.list.useQuery();

  const filteredPapers = papers || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-serif font-bold">
              AI Education Research
            </Link>
            <div className="flex gap-8">
              <Link href="/resources" className="hover:underline">
                Resources
              </Link>
              <Link href="/tools" className="hover:underline">
                Tools
              </Link>
              <Link href="/news" className="hover:underline">
                News
              </Link>
              <Link href="/research" className="font-semibold underline">
                Research
              </Link>
              <Link href="/admin" className="hover:underline">
                Admin
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-16">
        <h1 className="text-5xl font-serif font-bold mb-4">Research Papers</h1>
        <p className="text-xl text-gray-600 mb-12">
          Cutting-edge research from top universities and arXiv
        </p>

        {/* Filters */}
        <div className="mb-12 space-y-4">
          {/* Topic Filter */}
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => setCategoryFilter(null)}
              className={`px-4 py-2 ${
                categoryFilter === null
                  ? "bg-black text-white"
                  : "bg-white text-black border border-gray-300"
              }`}
            >
              All Topics
            </button>
            {categories?.map((category) => (
              <button
                key={category.id}
                onClick={() => setCategoryFilter(category.name)}
                className={`px-4 py-2 ${
                  categoryFilter === category.name
                    ? "bg-black text-white"
                    : "bg-white text-black border border-gray-300"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Papers List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading research papers...</p>
          </div>
        ) : filteredPapers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No research papers found.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredPapers.map((paper) => (
              <article key={paper.id} className="border-b border-gray-200 pb-8">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-serif font-bold flex-1">
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {paper.title}
                    </a>
                  </h2>
                </div>

                {paper.authors && (
                  <p className="text-sm text-gray-600 mb-2">
                    {paper.authors}
                  </p>
                )}

                <div className="flex gap-4 text-sm text-gray-500 mb-4">
                  {paper.source && <span>{paper.source}</span>}
                  <span>
                    · {new Date(paper.publishedAt).toLocaleDateString()}
                  </span>
                </div>

                {paper.abstract && (
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {paper.abstract.substring(0, 300)}
                    {paper.abstract.length > 300 && "..."}
                  </p>
                )}

                <div className="flex gap-4">
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
                  >
                    View Paper
                  </a>
                  {paper.pdfUrl && (
                    <a
                      href={paper.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
                    >
                      Download PDF
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-24 py-8">
        <div className="container mx-auto text-center text-sm text-gray-600">
          © 2026 AI Education Research. Curated insights for K-12 educators.
        </div>
      </footer>
    </div>
  );
}
