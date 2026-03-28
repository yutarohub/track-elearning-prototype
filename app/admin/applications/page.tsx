"use client";

import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import type { ApplicationStatus, CourseApplication } from "@/lib/adminPhase2Mock";
import { MOCK_COURSE_APPLICATIONS } from "@/lib/adminPhase2Mock";
import { Check, X, Clock, FileText } from "lucide-react";

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  pending: "承認待ち",
  approved: "承認済み",
  rejected: "却下",
};

const STATUS_STYLE: Record<ApplicationStatus, string> = {
  pending: "bg-amber-100 text-amber-900",
  approved: "bg-emerald-100 text-emerald-900",
  rejected: "bg-slate-200 text-slate-700",
};

export default function AdminApplicationsPage() {
  const [rows, setRows] = useState<CourseApplication[]>(MOCK_COURSE_APPLICATIONS);
  const [filter, setFilter] = useState<"all" | ApplicationStatus>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return rows;
    return rows.filter((r) => r.status === filter);
  }, [rows, filter]);

  function setStatus(id: string, status: ApplicationStatus) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">申請管理</h1>
          <p className="mt-1 text-sm text-slate-500">
            有償コース等の申請一覧（承認・却下はモック。実データ連携は別フェーズ）
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(["all", "pending", "approved", "rejected"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === key
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {key === "all" ? "すべて" : STATUS_LABEL[key]}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-2 text-slate-800">
              <FileText className="h-5 w-5 text-indigo-600" />
              <h2 className="font-semibold">申請一覧</h2>
              <span className="text-sm text-slate-500">({filtered.length} 件)</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="px-4 py-3 font-semibold text-slate-700">申請者</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">コース</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">申請日</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">ステータス</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">メモ</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{row.applicantName}</p>
                      <p className="text-xs text-slate-500">{row.applicantEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-800">{row.courseTitle}</td>
                    <td className="px-4 py-3 text-slate-600">{row.requestedAt}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[row.status]}`}
                      >
                        {row.status === "pending" && <Clock className="h-3 w-3" />}
                        {STATUS_LABEL[row.status]}
                      </span>
                    </td>
                    <td className="max-w-xs px-4 py-3 text-xs text-slate-600">{row.note ?? "—"}</td>
                    <td className="px-4 py-3">
                      {row.status === "pending" ? (
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setStatus(row.id, "approved")}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                          >
                            <Check className="h-3.5 w-3.5" />
                            承認
                          </button>
                          <button
                            type="button"
                            onClick={() => setStatus(row.id, "rejected")}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <X className="h-3.5 w-3.5" />
                            却下
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
