"use client";

import { useState } from "react";
import type { AIInsightItem } from "@/lib/dashboardMock";
import { TrendingUp, Clock, Award, AlertCircle, Sparkles } from "lucide-react";

const INSIGHT_ICONS: Record<AIInsightItem["type"], React.ComponentType<{ className?: string }>> = {
  trend: TrendingUp,
  peak: Clock,
  completion: Award,
  risk: AlertCircle,
  action: Sparkles,
};

const INSIGHT_STYLES: Record<AIInsightItem["type"], { bg: string; border: string; iconBg: string }> = {
  trend: { bg: "bg-emerald-50", border: "border-emerald-100", iconBg: "bg-emerald-500" },
  peak: { bg: "bg-sky-50", border: "border-sky-100", iconBg: "bg-sky-500" },
  completion: { bg: "bg-violet-50", border: "border-violet-100", iconBg: "bg-violet-500" },
  risk: { bg: "bg-amber-50", border: "border-amber-100", iconBg: "bg-amber-500" },
  action: { bg: "bg-indigo-50", border: "border-indigo-100", iconBg: "bg-indigo-500" },
};

export function AiInsightCard({ insight }: { insight: AIInsightItem }) {
  const Icon = INSIGHT_ICONS[insight.type];
  const style = INSIGHT_STYLES[insight.type];
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={`rounded-xl border ${style.border} ${style.bg} p-4 shadow-sm transition hover:shadow-md`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${style.iconBg} text-white`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            {insight.type === "trend" && "コース傾向"}
            {insight.type === "peak" && "時間帯"}
            {insight.type === "completion" && "完了率"}
            {insight.type === "risk" && "注意"}
            {insight.type === "action" && "推奨"}
          </p>
          <h3 className="mt-0.5 font-semibold text-slate-900">{insight.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">{insight.summary}</p>
          {insight.items && insight.items.length > 0 && (
            <ul className="mt-2 space-y-1 text-xs text-slate-600">
              {insight.items.slice(0, expanded ? undefined : 2).map((item, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-slate-400" />
                  {item}
                </li>
              ))}
              {!expanded && insight.items.length > 2 && (
                <li>
                  <button
                    type="button"
                    onClick={() => setExpanded(true)}
                    className="text-indigo-600 hover:underline"
                  >
                    +{insight.items.length - 2} 件
                  </button>
                </li>
              )}
            </ul>
          )}
          {expanded && insight.detail && (
            <p className="mt-2 text-xs text-slate-600">{insight.detail}</p>
          )}
          {(insight.metric ?? insight.cta) && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {insight.metric && (
                <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                  {insight.metricLabel}: {insight.metric}
                </span>
              )}
              {insight.cta && (
                <button type="button" className="text-xs font-medium text-indigo-600 hover:underline">
                  {insight.cta} →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
