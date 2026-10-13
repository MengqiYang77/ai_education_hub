import { useQuery } from "@tanstack/react-query";

type Options = { enabled?: boolean };
type RecordValue = string | number | null;
type DataRecord = Record<string, RecordValue>;

async function load<T extends DataRecord>(name: string): Promise<T[]> {
  const response = await fetch(`/data/${name}.json`);
  if (!response.ok) throw new Error(`Unable to load ${name}`);
  const rows = await response.json();
  if (!Array.isArray(rows)) throw new Error(`Invalid data for ${name}`);
  return rows;
}

const query = <T,>(key: unknown[], loader: () => Promise<T>, options?: Options) =>
  useQuery({ queryKey: key, queryFn: loader, enabled: options?.enabled ?? true, staleTime: Infinity });

export const trpc = {
  categories: {
    list: { useQuery: () => query(["categories"], () => load<any>("categories")) },
  },
  content: {
    list: { useQuery: (input?: { limit?: number }) => query(["content", input], async () => (await load<any>("content")).slice(0, input?.limit)) },
    bySlug: { useQuery: ({ slug }: { slug: string }) => query(["content", slug], async () => (await load<any>("content")).find(x => x.slug === slug) ?? null) },
  },
  tools: {
    list: { useQuery: () => query(["tools"], () => load<any>("tools")) },
  },
  news: {
    recent: { useQuery: (input?: { limit?: number }) => query(["news", "recent", input], async () => (await load<any>("derived/news-recent")).slice(0, input?.limit ?? 10)) },
    byLanguage: { useQuery: (input: { language: string; limit?: number }) => query(["news", "language", input], async () => (await load<any>(`derived/news-${input.language}`)).slice(0, input.limit ?? 30)) },
    byTopic: { useQuery: (input: { keyword: string; limit?: number }, options?: Options) => query(["news", "topic", input], async () => search(await load<any>("derived/news-index"), input.keyword).slice(0, input.limit ?? 8), options) },
    searchByTitle: { useQuery: (input: { q: string }, options?: Options) => query(["news", "search", input.q], async () => search(await load<any>("derived/news-index"), input.q).slice(0, 20), options) },
  },
  research: {
    list: { useQuery: (input?: { limit?: number; topic?: string }) => query(["research", "list", input], async () => (await load<any>(input?.topic ? "derived/research-list" : "derived/research-recent")).filter(x => !input?.topic || x.topic === input.topic).slice(0, input?.limit ?? 20)) },
    byTopic: { useQuery: (input: { topic: string; limit?: number }, options?: Options) => query(["research", "topic", input], async () => (await load<any>("derived/research-list")).filter(x => x.topic === input.topic).slice(0, input.limit ?? 8), options) },
    searchByTitle: { useQuery: (input: { q: string }, options?: Options) => query(["research", "search", input.q], async () => search(await load<any>("derived/research-index"), input.q).slice(0, 20), options) },
  },
};

function search<T extends DataRecord>(items: T[], term: string) {
  const needle = term.trim().toLocaleLowerCase();
  if (!needle) return [];
  return items.filter(item => [item.title, item.description, item.abstract, item.source, item.topic]
    .some(value => String(value ?? "").toLocaleLowerCase().includes(needle)));
}
