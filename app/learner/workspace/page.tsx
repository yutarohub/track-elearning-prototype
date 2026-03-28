"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** 旧URL: 受講者トップへリダイレクト */
export default function LearnerWorkspacePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/learner/skill-hub/home");
  }, [router]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
      <p>リダイレクト中...</p>
    </div>
  );
}
