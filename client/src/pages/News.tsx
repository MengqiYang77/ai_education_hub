import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useState } from "react";

type TabMode = "global" | "china";

const topics = [
  { name: "AI Models & Agents", zh: "AI 模型与智能体", description: "Foundation models, agents and multimodal AI", zhDescription: "大模型、智能体与多模态 AI" },
  { name: "Robotics & Embodied AI", zh: "机器人与具身智能", description: "Humanoids, autonomous systems and physical AI", zhDescription: "人形机器人、自动系统与物理 AI" },
  { name: "Chips & Compute", zh: "芯片与算力", description: "Semiconductors, GPUs and computing infrastructure", zhDescription: "半导体、GPU 与计算基础设施" },
  { name: "Quantum Technology", zh: "量子科技", description: "Quantum computing, sensing and communication", zhDescription: "量子计算、传感与通信" },
  { name: "Space & Aerospace", zh: "航天与航空", description: "Spacecraft, satellites and aerospace engineering", zhDescription: "航天器、卫星与航空工程" },
  { name: "Bioengineering", zh: "生物工程", description: "AI for biology, medicine and neuroscience", zhDescription: "AI 生物学、医疗与神经科学" },
  { name: "Advanced Manufacturing", zh: "先进制造", description: "3D printing, materials, batteries and fabrication", zhDescription: "3D 打印、材料、电池与数字制造" },
  { name: "Education & Future Skills", zh: "教育与未来技能", description: "Teaching, learning and workforce transformation", zhDescription: "教学、学习与职业技能转型" },
  { name: "Policy & Society", zh: "政策、伦理与社会", description: "Safety, governance, privacy and social impact", zhDescription: "安全、治理、隐私与社会影响" },
];

export default function News() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [tabMode, setTabMode] = useState<TabMode>("global");
  const { data: globalNews } = trpc.news.byLanguage.useQuery({ language: "en", limit: 300 });
  const { data: chinaNews } = trpc.news.byLanguage.useQuery({ language: "zh", limit: 300 });
  const activeNews = tabMode === "china" ? chinaNews : globalNews;
  const filteredNews = selectedTopic ? activeNews?.filter((item) => item.topic === selectedTopic) : activeNews;

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
          <h1 className="text-5xl font-bold mb-4">Latest News</h1>
          <p className="text-lg text-muted-foreground">
            Recent developments from top research institutions and industry leaders
          </p>
        </div>
      </section>

      {/* Region + language selector */}
      <section className="border-b border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 py-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-3">
            <button
              onClick={() => { setTabMode("global"); setSelectedTopic(null); }}
              className={`px-4 py-2 text-sm border transition-all ${
                tabMode === "global"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:border-foreground"
              }`}
            >
              <span className="block font-semibold">🌐 Global</span>
              <span className="block text-[11px] opacity-70 mt-0.5">English sources only</span>
            </button>
            <button
              onClick={() => { setTabMode("china"); setSelectedTopic(null); }}
              className={`px-4 py-2 text-sm border transition-all ${
                tabMode === "china"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:border-foreground"
              }`}
            >
              <span className="block font-semibold">🇨🇳 China</span>
              <span className="block text-[11px] opacity-70 mt-0.5">仅限中文来源</span>
            </button>
            </div>
            <p className="text-xs text-muted-foreground">Updated automatically every day at 06:00 (Asia/Shanghai)</p>
          </div>
        </div>
      </section>

      {/* Frontier topic navigation */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">Frontier Technology Index</p>
              <h2 className="text-2xl font-bold">{tabMode === "china" ? "按前沿科技主题浏览" : "Explore frontier technology"}</h2>
            </div>
            <button onClick={() => setSelectedTopic(null)} className={`text-sm px-3 py-2 border ${selectedTopic === null ? "border-foreground bg-foreground text-background" : "border-border"}`}>
              {tabMode === "china" ? `全部 ${activeNews?.length ?? 0}` : `All ${activeNews?.length ?? 0}`}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {topics.map((topic) => {
              const count = activeNews?.filter((item) => item.topic === topic.name).length ?? 0;
              const selected = selectedTopic === topic.name;
              return (
                <button key={topic.name} onClick={() => setSelectedTopic(selected ? null : topic.name)} className={`text-left p-4 border transition-all ${selected ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground hover:bg-muted/40"}`}>
                  <div className="flex justify-between gap-3">
                    <span className="font-semibold">{tabMode === "china" ? topic.zh : topic.name}</span>
                    <span className="text-sm opacity-60 tabular-nums">{count}</span>
                  </div>
                  <p className="text-xs opacity-60 mt-1">{tabMode === "china" ? topic.name : topic.zh}</p>
                  <p className="text-xs opacity-70 mt-3">{tabMode === "china" ? topic.zhDescription : topic.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="mb-8 flex items-baseline justify-between gap-4">
            <h2 className="text-2xl font-bold">
              {selectedTopic ? (tabMode === "china" ? topics.find(topic => topic.name === selectedTopic)?.zh : selectedTopic) : (tabMode === "china" ? "全部中文资讯" : "All English stories")}
            </h2>
            <span className="text-sm text-muted-foreground">{filteredNews?.length ?? 0} {tabMode === "china" ? "条" : "stories"}</span>
          </div>
          {filteredNews && filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((item) => (
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
                      {item.topic && (
                        <span className="text-xs text-muted-foreground ml-2">· {item.topic}</span>
                      )}
                      <h3 className="text-lg font-bold mt-2 mb-2 group-hover:opacity-60 transition-opacity">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {item.description}
                        </p>
                      )}
                      <time className="text-xs text-muted-foreground mt-2 block">
                        {new Date(item.publishedAt).toLocaleDateString(
                          tabMode === "china" ? "zh-CN" : "en-US",
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </time>
                      {Array.isArray(item.contentFormats) && item.contentFormats.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {item.contentFormats.map((format: string) => (
                            <span key={format} className="text-[11px] border border-border px-2 py-1 text-muted-foreground">
                              {format}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                </a>
              ))}
            </div>
          ) : tabMode === "china" && (!chinaNews || chinaNews.length === 0) ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-2">暂无中文新闻</p>
              <p className="text-sm text-muted-foreground">
                暂无符合筛选条件的中文新闻，内容会在每日自动更新后出现。
              </p>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No news items found for this category.</p>
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
