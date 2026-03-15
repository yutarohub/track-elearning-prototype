"use client";

import { useAuth } from "@/context/AuthContext";
import { TraineeSidebar } from "./TraineeSidebar";

export function TraineeLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (user == null) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-indigo-600 focus:px-3 focus:py-2 focus:text-white">
        メインコンテンツへスキップ
      </a>
      <TraineeSidebar />
      <div className="pl-64">
        <main id="main-content" className="min-h-screen pt-4" tabIndex={-1}>
          <div className="p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
