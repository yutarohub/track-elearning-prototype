"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BookOpen } from "lucide-react";
import type { CourseStackItem } from "@/lib/dashboardMock";

export interface DashboardCourseAnalyticsProps {
  data: CourseStackItem[];
}

export function DashboardCourseAnalytics({ data }: DashboardCourseAnalyticsProps) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-2">
        <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" aria-hidden />
        <div>
          <h2 className="text-lg font-semibold text-slate-900">コース毎の進捗率（講座別・上位20件）</h2>
          <p className="mt-1 text-sm text-slate-600">
            受講中人数が多い講座ほど上に表示しています。青＝完了、橙＝進行中、灰＝未着手です。
          </p>
          <p className="mt-2 text-xs text-slate-500">
            読み方: 棒の長さが「そのコースに紐づく人数」の合計です。未着手が長いコースはレコメンドやリマインドの候補になります。
          </p>
        </div>
      </div>
      <div className="mt-4 h-[min(520px,55vh)] w-full min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
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
    </div>
  );
}
