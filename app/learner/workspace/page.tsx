"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";

export default function LearnerWorkspacePage() {
  const { setView } = useAuth();

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          受講者ビューは現在開発中です。
        </h1>
        <p className="mt-2 text-slate-600">
          Coming Soon
        </p>
        <div className="mt-8 flex gap-4">
          <div className="h-24 w-48 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-24 w-48 animate-pulse rounded-xl bg-slate-200" />
        </div>
        <button
          type="button"
          onClick={() => setView("admin")}
          className="mt-8 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 font-medium text-white hover:from-indigo-500 hover:to-violet-500"
        >
          管理者ビューに戻る
        </button>
      </div>
    </AppLayout>
  );
}
