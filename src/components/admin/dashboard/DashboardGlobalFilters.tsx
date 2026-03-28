import { Calendar } from "lucide-react";
import { FLAT_DEPARTMENTS } from "@/lib/orgMock";

export type DepartmentId = "all" | string;

export interface DashboardGlobalFiltersProps {
  selectedDepartmentId: DepartmentId;
  onDepartmentChange: (id: DepartmentId) => void;
  selectedMonth: string;
  onMonthChange: (yearMonth: string) => void;
  monthOptions: { yearMonth: string; label: string }[];
  scopeLabel: string;
}

export function DashboardGlobalFilters({
  selectedDepartmentId,
  onDepartmentChange,
  selectedMonth,
  onMonthChange,
  monthOptions,
  scopeLabel,
}: DashboardGlobalFiltersProps) {
  return (
    <div
      className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/90 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end"
      role="group"
      aria-label="ダッシュボードの表示条件"
    >
      <p className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 sm:mr-auto">
        <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden />
        <span>データ範囲: {scopeLabel}</span>
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="dash-dept" className="text-xs font-medium text-slate-600">
          部門
        </label>
        <select
          id="dash-dept"
          value={selectedDepartmentId}
          onChange={(e) => onDepartmentChange(e.target.value as DepartmentId)}
          className="min-w-[200px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="all">全社（すべての部門）</option>
          {FLAT_DEPARTMENTS.filter((d) => d.id !== "dept-root").map((d) => (
            <option key={d.id} value={d.id}>
              {`${"　".repeat(d.level)}${d.name}`}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Calendar className="h-4 w-4 text-slate-400" aria-hidden />
        <label htmlFor="dash-month" className="text-xs font-medium text-slate-600">
          対象月
        </label>
        <select
          id="dash-month"
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          aria-label="集計対象の月を選択"
        >
          {monthOptions.map((m) => (
            <option key={m.yearMonth} value={m.yearMonth}>
              {m.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
