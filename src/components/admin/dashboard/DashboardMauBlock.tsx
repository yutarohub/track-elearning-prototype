"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MauByMonth } from "@/lib/dashboardMock";

export type MauTab = "platform" | "track";

export interface DashboardMauBlockProps {
  mauTab: MauTab;
  onMauTabChange: (tab: MauTab) => void;
  mauByMonth: MauByMonth[];
  platformMau: number;
  trackOfficialMau: number;
  planLimit: number;
  trackMauPercent: number;
  selectedMonthLabel: string;
}

export function DashboardMauBlock({
  mauTab,
  onMauTabChange,
  mauByMonth,
  platformMau,
  trackOfficialMau,
  planLimit,
  trackMauPercent,
  selectedMonthLabel,
}: DashboardMauBlockProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-slate-900">月間アクティブユーザー（MAU）</h3>
        <div className="flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => onMauTabChange("platform")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              mauTab === "platform"
                ? "bg-slate-100 text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            プラットフォーム全体
          </button>
          <button
            type="button"
            onClick={() => onMauTabChange("track")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              mauTab === "track"
                ? "bg-slate-100 text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Track公式（課金）
          </button>
        </div>
      </div>
      <p className="mt-2 text-sm text-slate-600">
        {selectedMonthLabel}時点の数値と、直近12ヶ月の推移です。上部の「対象月」で期間を切り替えると、大きな数字が連動します。
      </p>
      <div className="mt-4 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          {mauTab === "platform" ? (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                プラットフォーム全体 MAU
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">
                {platformMau.toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-slate-600">自社＋公式の合算 · 組織全体の学習熱量</p>
            </>
          ) : (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Track公式コンテンツ MAU（課金対象）
              </p>
              <p className="mt-1 text-[10px] text-amber-700">※従量課金対象</p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">
                {trackOfficialMau}
                <span className="ml-2 text-lg font-normal text-slate-500">/ {planLimit}</span>
              </p>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                  style={{ width: `${Math.min(trackMauPercent, 100)}%` }}
                />
              </div>
              <p className="mt-1 text-sm text-slate-600">プラン上限の {trackMauPercent}%</p>
            </>
          )}
        </div>
        <div className="h-56 lg:col-span-3 lg:h-64">
          <p className="mb-2 text-xs font-medium text-slate-500">月別推移（直近12ヶ月）</p>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={mauByMonth.map((m) => ({
                ...m,
                name: m.label,
                value: mauTab === "platform" ? m.platform : m.trackOfficial,
              }))}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10 }}
                stroke="#64748b"
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                stroke="#64748b"
                tickFormatter={(v) => v.toLocaleString()}
              />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                formatter={(value: unknown) => [
                  (typeof value === "number" ? value : 0).toLocaleString(),
                  mauTab === "platform" ? "プラットフォームMAU" : "Track公式MAU",
                ]}
                labelFormatter={(label) => label}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={mauTab === "platform" ? "#3b82f6" : "#8b5cf6"}
                fill={mauTab === "platform" ? "#3b82f6" : "#8b5cf6"}
                fillOpacity={0.35}
                name={mauTab === "platform" ? "プラットフォーム全体" : "Track公式"}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
