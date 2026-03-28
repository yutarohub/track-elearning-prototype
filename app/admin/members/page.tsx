"use client";

import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MOCK_ADMIN_MEMBERS } from "@/lib/adminPhase2Mock";
import { Search, Users } from "lucide-react";

export default function AdminMembersPage() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return MOCK_ADMIN_MEMBERS;
    return MOCK_ADMIN_MEMBERS.filter(
      (m) =>
        m.name.toLowerCase().includes(s) ||
        m.email.toLowerCase().includes(s) ||
        m.department.toLowerCase().includes(s),
    );
  }, [q]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">メンバー</h1>
          <p className="mt-1 text-sm text-slate-500">
            テナント内の受講者・管理者の一覧（モック）
          </p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="名前・メール・部門で検索"
            className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            aria-label="メンバー検索"
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600" />
              <h2 className="font-semibold text-slate-900">メンバー一覧</h2>
              <span className="text-sm text-slate-500">({filtered.length})</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="px-4 py-3 font-semibold text-slate-700">名前</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">メール</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">部門</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">役割</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">最終アクティブ</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Track MAU計上</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-slate-900">{m.name}</td>
                    <td className="px-4 py-3 text-slate-600">{m.email}</td>
                    <td className="px-4 py-3 text-slate-600">{m.department}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          m.role === "管理者"
                            ? "bg-violet-100 text-violet-900"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {m.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{m.lastActive}</td>
                    <td className="px-4 py-3 text-slate-600">{m.trackMauCounted ? "対象" : "除外"}</td>
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
