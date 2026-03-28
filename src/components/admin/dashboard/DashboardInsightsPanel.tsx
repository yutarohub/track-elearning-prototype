import { Sparkles } from "lucide-react";
import type { AIInsightItem } from "@/lib/dashboardMock";
import { AiInsightCard } from "./AiInsightCard";

export function DashboardInsightsPanel({ insights }: { insights: AIInsightItem[] }) {
  return (
    <div className="rounded-xl border border-indigo-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900">AI インサイト（解釈）</h3>
          <p className="text-xs text-slate-500">左の利用推移・定着表を読むための補助線です。</p>
        </div>
      </div>
      <div className="mt-4 grid max-h-[min(70vh,720px)] gap-3 overflow-y-auto pr-1 sm:grid-cols-1">
        {insights.map((insight) => (
          <AiInsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  );
}
