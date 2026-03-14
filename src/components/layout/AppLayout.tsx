"use client";

import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (user == null) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <a href="#main-content" className="skip-link">
        メインコンテンツへスキップ
      </a>
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main
          id="main-content"
          className="min-h-screen pt-16"
          tabIndex={-1}
        >
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
