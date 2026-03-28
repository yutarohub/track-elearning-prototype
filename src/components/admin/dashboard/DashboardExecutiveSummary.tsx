import { Activity } from "lucide-react";
import type { LearningHealthKpi } from "@/lib/adminPhase2Mock";

export interface DashboardExecutiveSummaryProps {
  kpis: LearningHealthKpi[];
  /** 部門スケール後の Track 公式 MAU（3枚目のKPIを上書き） */
  trackOfficialMau: number;
  planLimit: number;
  trackMauPercent: number;
}

export function DashboardExecutiveSummary({
  kpis,
  trackOfficialMau,
  planLimit,
  trackMauPercent,
}: DashboardExecutiveSummaryProps) {
  return (
    <section id="dashboard-summary" aria-labelledby="dash-kpi-heading" className="scroll-mt-24 space-y-3">
      <div className="flex items-center gap-2 text-slate-700">
        <Activity className="h-5 w-5 shrink-0 text-indigo-600" aria-hidden />
        <div>
          <h2 id="dash-kpi-heading" className="text-sm font-semibold text-slate-900">
            1. 経営・学習サマリー
          </h2>
          <p className="text-xs text-slate-500">最重要指標を先に把握し、下のタブで内訳へ進みます。</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {kpis.map((k, index) => {
          const isMau = k.label.includes("MAU（Track公式");
          const value = isMau ? trackOfficialMau.toLocaleString() : k.value;
          const sub = isMau ? `課金対象MAU / 上限 ${planLimit.toLocaleString()}` : k.sub;
          const trend = isMau ? `上限の ${trackMauPercent}%` : k.trend;
          const featured = isMau;
          return (
            <div
              key={k.label}
              className={`flex min-h-[148px] flex-col rounded-xl border bg-white p-5 shadow-sm ${
                featured
                  ? "border-violet-300 ring-2 ring-violet-200/60"
                  : k.accent === "emerald"
                    ? "border-emerald-100"
                    : k.accent === "sky"
                      ? "border-sky-100"
                      : "border-violet-100"
              }`}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{k.label}</p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">{value}</p>
              <p className="mt-1 flex-1 text-xs leading-relaxed text-slate-600">{sub}</p>
              {trend ? (
                <p className="mt-2 text-xs font-medium text-indigo-600">{trend}</p>
              ) : null}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-slate-500">
        ヒント: 定着トレンドや AI の解釈は「エンゲージメント」、講座単位の操作は「コース・カタログ」タブへ。
      </p>
    </section>
  );
}
