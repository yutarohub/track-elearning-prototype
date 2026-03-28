import type { ReactNode } from "react";

export interface DashboardStoryHeaderProps {
  executiveSummaryLine: string;
  filters: ReactNode;
}

export function DashboardStoryHeader({ executiveSummaryLine, filters }: DashboardStoryHeaderProps) {
  return (
    <header className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-slate-900">ダッシュボード</h1>
          <p className="mt-1 text-sm text-slate-600">
            経営・契約（MAU）・学習企画（コース）・介入（リスク）を、<strong className="font-semibold text-slate-800">概要 → 定着 → 詳細</strong>
            の順で読み取れる LXP コックピットです。
          </p>
          <p
            className="mt-3 rounded-lg border border-indigo-100 bg-indigo-50/80 px-3 py-2.5 text-sm leading-snug text-indigo-950"
            role="status"
          >
            <span className="font-semibold text-indigo-900">今月の要点: </span>
            {executiveSummaryLine}
          </p>
        </div>
        <div className="w-full shrink-0 lg:max-w-md">{filters}</div>
      </div>
    </header>
  );
}
