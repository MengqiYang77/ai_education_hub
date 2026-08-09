import { useQuery } from "@tanstack/react-query";

type Options = { enabled?: boolean };
type RecordValue = string | number | null;
type DataRecord = Record<string, RecordValue>;

async function load<T extends DataRecord>(name: string): Promise<T[]> {
  const response = await fetch(`/data/${name}.json`);
  if (!response.ok) throw new Error(`Unable to load ${name}`);
  return response.json();
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
    recent: { useQuery: (input?: { limit?: number }) => query(["news", input], async () => (await load<any>("news")).sort(byPublished).slice(0, input?.limit ?? 10)) },
    byLanguage: { useQuery: (input: { language: string; limit?: number }) => query(["news", "language", input], async () => (await load<any>("news")).filter(x => x.language === input.language).sort(byPublished).slice(0, input.limit ?? 30)) },
    byTopic: { useQuery: (input: { keyword: string; limit?: number }, options?: Options) => query(["news", "topic", input], async () => search(await load<any>("news"), input.keyword).slice(0, input.limit ?? 8), options) },
    searchByTitle: { useQuery: (input: { q: string }, options?: Options) => query(["news", "search", input.q], async () => search(await load<any>("news"), input.q).slice(0, 20), options) },
  },
  research: {
    list: { useQuery: (input?: { limit?: number; topic?: string }) => query(["research", input], async () => (await load<any>("research")).filter(x => !input?.topic || x.topic === input.topic).sort(byPublished).slice(0, input?.limit ?? 20)) },
    byTopic: { useQuery: (input: { topic: string; limit?: number }, options?: Options) => query(["research", "topic", input], async () => (await load<any>("research")).filter(x => x.topic === input.topic).sort(byPublished).slice(0, input.limit ?? 8), options) },
    searchByTitle: { useQuery: (input: { q: string }, options?: Options) => query(["research", "search", input.q], async () => search(await load<any>("research"), input.q).slice(0, 20), options) },
  },
};

function byPublished(a: DataRecord, b: DataRecord) {
  return String(b.publishedAt ?? "").localeCompare(String(a.publishedAt ?? ""));
}

function search<T extends DataRecord>(items: T[], term: string) {
  const needle = term.trim().toLocaleLowerCase();
  if (!needle) return [];
  return items.filter(item => [item.title, item.description, item.abstract, item.source, item.topic]
    .some(value => String(value ?? "").toLocaleLowerCase().includes(needle)));
}
