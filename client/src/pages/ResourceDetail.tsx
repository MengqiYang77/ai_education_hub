import { trpc } from "@/lib/trpc";
import { Link, useParams } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function ResourceDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";

  const { data: resource, isLoading, error } = trpc.content.bySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-white">
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
                <Link href="/research" className="hover:underline">
                  Research
                </Link>
              </div>
            </nav>
          </div>
        </header>

        <main className="container mx-auto py-16 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Resource Not Found</h1>
          <p className="text-gray-600 mb-8">The resource you're looking for doesn't exist.</p>
          <Link href="/resources" className="border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors">
            Back to Resources
          </Link>
        </main>
      </div>
    );
  }

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
              <Link href="/research" className="hover:underline">
                Research
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-16">
        <Link href="/resources" className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-8">
          <ArrowLeft size={20} />
          Back to Resources
        </Link>

        <article className="max-w-3xl">
          <h1 className="text-5xl font-serif font-bold mb-4">{resource.title}</h1>
          
          <div className="flex gap-4 text-sm text-gray-600 mb-8 pb-8 border-b border-gray-200">
            {resource.publishedAt && (
              <>
                <span>{new Date(resource.publishedAt).toLocaleDateString()}</span>
                <span>·</span>
              </>
            )}
            {resource.viewCount > 0 && (
              <>
                <span>·</span>
                <span>{resource.viewCount} views</span>
              </>
            )}
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl leading-relaxed mb-8">{resource.description}</p>
            
            {resource.content && (
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {resource.content}
              </div>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 flex gap-4">
            {resource.url && (
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors"
              >
                Visit Source Website
              </a>
            )}
            <Link
              href="/resources"
              className="inline-block border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors"
            >
              Back to All Resources
            </Link>
          </div>
        </article>
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
