export type DashboardSectionTab = "summary" | "engagement" | "courses";

const TABS: { id: DashboardSectionTab; label: string; description: string }[] = [
  { id: "summary", label: "サマリー", description: "経営・学習の要約KPI" },
  { id: "engagement", label: "エンゲージメント", description: "利用・定着・AIインサイト" },
  { id: "courses", label: "コース・カタログ", description: "講座別進捗と一覧" },
];

export interface DashboardSectionNavProps {
  active: DashboardSectionTab;
  onChange: (tab: DashboardSectionTab) => void;
}

export function DashboardSectionNav({ active, onChange }: DashboardSectionNavProps) {
  return (
    <nav
      className="sticky top-0 z-20 -mx-6 border-b border-slate-200 bg-white/95 px-6 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/80"
      aria-label="ダッシュボードの表示セクション"
    >
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              aria-current={isActive ? "page" : undefined}
              title={t.description}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-slate-500">{TABS.find((x) => x.id === active)?.description}</p>
    </nav>
  );
}
