"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  MOCK_AI_INSIGHTS,
  MOCK_TRACK_MAU_PLAN_LIMIT,
  MOCK_MAU_BY_MONTH,
  MOCK_COHORT_RETENTION,
  MOCK_COURSE_STACK,
  type AIInsightItem,
} from "@/lib/dashboardMock";
import { MOCK_LEARNING_HEALTH_KPIS } from "@/lib/adminPhase2Mock";
import { MOCK_COURSES } from "@/lib/mockData";
import type { Course, CourseType, Difficulty } from "@/lib/mockData";
import { ProgressIndicator } from "@/components/dashboard/ProgressIndicator";
import { FLAT_DEPARTMENTS, getDepartmentById, getDepartmentScale } from "@/lib/orgMock";
import {
  X,
  TrendingUp,
  Clock,
  Award,
  AlertCircle,
  Sparkles,
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Activity,
} from "lucide-react";

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

const PER_PAGE = 10;

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const styles: Record<Difficulty, string> = {
    入門: "bg-sky-100 text-sky-800",
    初級: "bg-emerald-100 text-emerald-800",
    中級: "bg-amber-100 text-amber-800",
    上級: "bg-rose-100 text-rose-800",
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles[difficulty]}`}>
      {difficulty}
    </span>
  );
}

function TypeBadge({ type }: { type: CourseType }) {
  return (
    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-800">
      {type}
    </span>
  );
}

type MauTab = "platform" | "track";
type DepartmentId = "all" | string;

export default function DashboardPage() {
  const [drawerCourse, setDrawerCourse] = useState<Course | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | CourseType>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<"all" | Difficulty>("all");
  const [page, setPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const [mauTab, setMauTab] = useState<MauTab>("platform");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<DepartmentId>("all");

  const filtered = useMemo(() => {
    let list = MOCK_COURSES;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.type.toLowerCase().includes(q)
      );
    }
    if (typeFilter !== "all") list = list.filter((c) => c.type === typeFilter);
    if (difficultyFilter !== "all") list = list.filter((c) => c.difficulty === difficultyFilter);
    return list;
  }, [search, typeFilter, difficultyFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
  const paginated = useMemo(
    () => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    [filtered, page]
  );

  const currentMonthData = MOCK_MAU_BY_MONTH.find((m) => m.yearMonth === selectedMonth);
  const deptScale = getDepartmentScale(selectedDepartmentId);
  const platformMau = Math.round((currentMonthData?.platform ?? 0) * deptScale);
  const trackOfficialMau = Math.round((currentMonthData?.trackOfficial ?? 0) * deptScale);
  const trackMauPercent = Math.round(
    (trackOfficialMau / MOCK_TRACK_MAU_PLAN_LIMIT) * 100
  );
  const selectedDepartment = getDepartmentById(selectedDepartmentId);

  return (
    <AppLayout>
      <div className="space-y-6 px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">ダッシュボード</h1>
            <p className="mt-1 text-sm text-slate-500">LXP コックピット · 経営レポート & アクション</p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              表示中: {selectedDepartment ? `${selectedDepartment.name}（配下含む）` : "全社"}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>部門フィルター:</span>
              <select
                value={selectedDepartmentId}
                onChange={(e) => setSelectedDepartmentId(e.target.value as DepartmentId)}
                className="min-w-[200px] rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">全社（すべての部門）</option>
                {FLAT_DEPARTMENTS.filter((d) => d.id !== "dept-root").map((d) => (
                  <option key={d.id} value={d.id}>
                    {`${"　".repeat(d.level)}${d.name}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Miro 準拠: 学習ヘルス / 学習状況 / MAU クイックKPI */}
        <section aria-label="学習KPIサマリー">
          <div className="mb-2 flex items-center gap-2 text-slate-700">
            <Activity className="h-5 w-5 text-indigo-600" />
            <h2 className="text-sm font-semibold text-slate-900">経営・学習サマリー（モック）</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {MOCK_LEARNING_HEALTH_KPIS.map((k) => (
              <div
                key={k.label}
                className={`rounded-xl border bg-white p-5 shadow-sm ${
                  k.accent === "emerald"
                    ? "border-emerald-100"
                    : k.accent === "sky"
                      ? "border-sky-100"
                      : "border-violet-100"
                }`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  {k.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{k.value}</p>
                <p className="mt-1 text-xs text-slate-600">{k.sub}</p>
                {k.trend ? (
                  <p className="mt-2 text-xs font-medium text-indigo-600">{k.trend}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>

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

          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex rounded-lg border border-slate-200 bg-slate-50/80 p-1">
                  <button
                    type="button"
                    onClick={() => setMauTab("platform")}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                      mauTab === "platform" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    プラットフォーム全体（合算）
                  </button>
                  <button
                    type="button"
                    onClick={() => setMauTab("track")}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                      mauTab === "track" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Track公式（課金対象）
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" aria-hidden />
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    aria-label="表示する月を選択"
                  >
                    {MOCK_MAU_BY_MONTH.map((m) => (
                      <option key={m.yearMonth} value={m.yearMonth}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-5">
              <div className="lg:col-span-2">
                {mauTab === "platform" ? (
                  <>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      プラットフォーム全体 MAU
                    </p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {platformMau.toLocaleString()}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      自社＋公式の合算 · 組織全体の学習熱量
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Track公式コンテンツ MAU（課金対象）
                    </p>
                    <p className="mt-1 text-[10px] text-amber-600">※従量課金対象</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {trackOfficialMau}
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
                    <p className="mt-1 text-sm text-slate-600">プラン上限の {trackMauPercent}%</p>
                  </>
                )}
              </div>
              <div className="h-64 lg:col-span-3">
                <p className="mb-2 text-xs font-medium text-slate-500">月別推移（直近12ヶ月）</p>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={MOCK_MAU_BY_MONTH.map((m) => ({
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
                    <YAxis tick={{ fontSize: 11 }} stroke="#64748b" tickFormatter={(v) => v.toLocaleString()} />
                    <Tooltip
                      contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                      formatter={(value: unknown) => [(typeof value === "number" ? value : 0).toLocaleString(), mauTab === "platform" ? "プラットフォームMAU" : "Track公式MAU"]}
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
                  formatter={(value) => [value ?? 0, ""]}
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

        {/* Zone 4: 公開中コース一覧（検索・フィルタ・テーブル・ページネーション・クリックで詳細） */}
        <section className="rounded-xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              公開中コース一覧（クリックで詳細）
            </h2>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative min-w-[200px] flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="検索"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  aria-label="コース名や種類で検索"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-slate-500">種類:</span>
                {(["all", "コース", "学習パス"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setTypeFilter(t === "all" ? "all" : t);
                      setPage(1);
                    }}
                    className={`rounded-lg px-3 py-1.5 text-sm ${
                      typeFilter === t
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {t === "all" ? "すべて" : t}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-slate-500">難易度:</span>
                {(["all", "入門", "初級", "中級", "上級"] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setDifficultyFilter(d === "all" ? "all" : d);
                      setPage(1);
                    }}
                    className={`rounded-lg px-3 py-1.5 text-sm ${
                      difficultyFilter === d
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {d === "all" ? "すべて" : d}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80">
                      <th className="px-4 py-3 font-semibold text-slate-700">タイトル</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">受講者</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">種類</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">難易度</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">想定受講時間</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">進捗</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((course) => (
                      <tr
                        key={course.id}
                        onClick={() => setDrawerCourse(course)}
                        className="cursor-pointer border-b border-slate-50 transition hover:bg-indigo-50/50"
                      >
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {course.title}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{course.learners}</td>
                        <td className="px-4 py-3">
                          <TypeBadge type={course.type} />
                        </td>
                        <td className="px-4 py-3">
                          <DifficultyBadge difficulty={course.difficulty} />
                        </td>
                        <td className="px-4 py-3 text-slate-600">{course.duration}</td>
                        <td className="px-4 py-3">
                          <ProgressIndicator
                            completed={course.progress.completed}
                            total={course.progress.total}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
                <p className="text-sm text-slate-500">
                  {(page - 1) * PER_PAGE + 1}-
                  {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    aria-label="前のページ"
                    className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="text-sm text-slate-700">
                    ページ {page} / {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    aria-label="次のページ"
                    className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
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
              <h3 className="font-bold text-slate-900">{drawerCourse.title}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                <TypeBadge type={drawerCourse.type} />
                <DifficultyBadge difficulty={drawerCourse.difficulty} />
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">カテゴリ</dt>
                  <dd className="font-medium text-slate-800">{drawerCourse.category}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">受講者数</dt>
                  <dd className="font-medium text-slate-800">{drawerCourse.learners}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">想定受講時間</dt>
                  <dd className="font-medium text-slate-800">{drawerCourse.duration}</dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-slate-500">進捗</dt>
                  <dd>
                    <ProgressIndicator
                      completed={drawerCourse.progress.completed}
                      total={drawerCourse.progress.total}
                    />
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}
