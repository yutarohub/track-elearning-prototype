"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "4月", 自学習: 120, ライブ: 45 },
  { month: "5月", 自学習: 180, ライブ: 62 },
  { month: "6月", 自学習: 220, ライブ: 78 },
  { month: "7月", 自学習: 195, ライブ: 85 },
  { month: "8月", 自学習: 250, ライブ: 92 },
  { month: "9月", 自学習: 280, ライブ: 88 },
];

export function EnrollmentChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#64748b" />
          <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}
          />
          <Area
            type="monotone"
            dataKey="自学習"
            stackId="1"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="ライブ"
            stackId="1"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
