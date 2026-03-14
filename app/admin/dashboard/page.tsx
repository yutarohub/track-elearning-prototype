"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  MOCK_AI_INSIGHTS,
  MOCK_PLATFORM_MAU,
  MOCK_TRACK_OFFICIAL_MAU,
  MOCK_TRACK_MAU_PLAN_LIMIT,
  MOCK_COHORT_RETENTION,
  MOCK_COURSE_STACK,
  MOCK_COURSE_TABLE,
  type CourseRow,
  type AIInsightItem,
} from "@/lib/dashboardMock";
import { X, TrendingUp, Clock, Award, AlertCircle, Sparkles } from "lucide-react";

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

function AIInsightCard({ insight }: { insight: AIInsightItem }) {
  const Icon = INSIGHT_ICONS[insight.type];
  const style = INSIGHT_STYLES[insight.type];
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={`rounded-xl border ${style.border} ${style.bg} p-4 shadow-sm transition hover:shadow-md`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${style.iconBg} text-white`}>
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
                <button
                  type="button"
                  className="text-xs font-medium text-indigo-600 hover:underline"
                >
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

export default function DashboardPage() {
  const [drawerCourse, setDrawerCourse] = useState<CourseRow | null>(null);

  const trackMauPercent = Math.round(
    (MOCK_TRACK_OFFICIAL_MAU / MOCK_TRACK_MAU_PLAN_LIMIT) * 100
  );

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ダッシュボード</h1>
          <p className="mt-1 text-sm text-slate-500">LXP コックピット · 経営レポート & アクション</p>
        </div>

        {/* Zone 1: AI インサイト（リッチ） & Dual MAU */}
        <section className="space-y-6">
          <div className="rounded-xl border border-indigo-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">AI インサイト</h2>
                <p className="text-xs text-slate-500">傾向分析・時間帯・完了率・リスクを自動分析</p>
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MOCK_AI_INSIGHTS.map((insight) => (
                <AIInsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                プラットフォーム全体 MAU
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {MOCK_PLATFORM_MAU.toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                自社＋公式の合算 · 組織全体の学習熱量
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Track公式コンテンツ MAU（課金対象）
              </p>
              <p className="mt-1 text-[10px] text-amber-600">
                ※従量課金対象
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {MOCK_TRACK_OFFICIAL_MAU}
                <span className="ml-2 text-lg font-normal text-slate-500">
                  / {MOCK_TRACK_MAU_PLAN_LIMIT}
                </span>
              </p>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                  style={{ width: `${Math.min(trackMauPercent, 100)}%` }}
                />
              </div>
              <p className="mt-1 text-sm text-slate-600">
                プラン上限の {trackMauPercent}%
              </p>
            </div>
          </div>
        </section>

        {/* Zone 2: コホート再帰率ヒートマップ */}
        <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            ユーザー再帰率（コホート分析）
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            登録週ごとの 1週後〜5週後 ログイン定着率（%）
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr>
                  <th className="rounded-tl-lg bg-slate-50 px-4 py-3 text-left font-semibold text-slate-700">
                    登録週
                  </th>
                  <th className="bg-slate-50 px-4 py-3 text-center font-semibold text-slate-700">
                    1週後
                  </th>
                  <th className="bg-slate-50 px-4 py-3 text-center font-semibold text-slate-700">
                    2週後
                  </th>
                  <th className="bg-slate-50 px-4 py-3 text-center font-semibold text-slate-700">
                    3週後
                  </th>
                  <th className="bg-slate-50 px-4 py-3 text-center font-semibold text-slate-700">
                    4週後
                  </th>
                  <th className="rounded-tr-lg bg-slate-50 px-4 py-3 text-center font-semibold text-slate-700">
                    5週後
                  </th>
                </tr>
              </thead>
              <tbody>
                {MOCK_COHORT_RETENTION.map((row, i) => (
                  <tr key={row.week}>
                    <td className="border-t border-slate-100 px-4 py-2 font-medium text-slate-800">
                      {row.week}
                    </td>
                    {([row.w1, row.w2, row.w3, row.w4, row.w5] as const).map(
                      (pct, j) => (
                        <td
                          key={j}
                          className="border-t border-slate-100 px-4 py-2 text-center font-medium"
                          style={{
                            backgroundColor: `hsl(170, 55%, ${92 - (pct / 100) * 55}%)`,
                            color: pct >= 70 ? "white" : pct >= 40 ? "#0f172a" : "#475569",
                          }}
                        >
                          {pct}%
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Zone 3: コース受講率・人気度マトリクス（積み上げ横棒） */}
        <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            コース毎の進捗率（講座別・上位20件）
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            受講中数ベース（進行中・完了の人数が多い順）
          </p>
          <div className="mt-4 h-[520px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={MOCK_COURSE_STACK}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 160, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="#64748b" />
                <YAxis
                  type="category"
                  dataKey="courseName"
                  width={155}
                  tick={{ fontSize: 11 }}
                  stroke="#64748b"
                />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  formatter={(value: number) => [value, ""]}
                  labelFormatter={(label) => label}
                />
                <Legend />
                <Bar dataKey="completed" name="完了" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="inProgress" name="進行中" stackId="a" fill="#f97316" radius={[0, 0, 0, 0]} />
                <Bar dataKey="notStarted" name="未着手" stackId="a" fill="#94a3b8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Zone 4: コース一覧テーブル ＋ ドロワー */}
        <section className="rounded-xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              公開中コース一覧（クリックで詳細）
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">
                    コース名
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">
                    タグ
                  </th>
                  <th className="px-6 py-3 text-right font-semibold text-slate-700">
                    総受講者数
                  </th>
                  <th className="px-6 py-3 text-right font-semibold text-slate-700">
                    平均完了率
                  </th>
                </tr>
              </thead>
              <tbody>
                {MOCK_COURSE_TABLE.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setDrawerCourse(row)}
                    className="cursor-pointer border-b border-slate-50 transition hover:bg-indigo-50/50"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {row.name}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          row.tag === "公式"
                            ? "bg-violet-100 text-violet-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {row.tag}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-700">
                      {row.totalLearners}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-800">
                      {row.avgCompletionRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Drawer: コース詳細 */}
      {drawerCourse && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-200"
            onClick={() => setDrawerCourse(null)}
            aria-hidden="true"
          />
          <div
            className="animate-fade-in-right fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-slate-200 bg-white shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
              <h2 id="drawer-title" className="text-lg font-semibold text-slate-900">
                コース詳細
              </h2>
              <button
                type="button"
                onClick={() => setDrawerCourse(null)}
                aria-label="閉じる"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-slate-900">{drawerCourse.name}</h3>
              <span
                className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  drawerCourse.tag === "公式"
                    ? "bg-violet-100 text-violet-800"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {drawerCourse.tag}
              </span>
              <p className="mt-4 text-sm text-slate-600">{drawerCourse.summary}</p>

              <h4 className="mt-6 text-sm font-semibold text-slate-800">
                受講者一覧
              </h4>
              <ul className="mt-3 space-y-4">
                {drawerCourse.learners.map((l, i) => (
                  <li
                    key={i}
                    className="rounded-lg border border-slate-100 bg-slate-50/50 p-3"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-900">{l.name}</span>
                      <span className="text-slate-500">最終: {l.lastLogin}</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-indigo-500 transition-all"
                        style={{ width: `${l.progress}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      進捗 {l.progress}%
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}
