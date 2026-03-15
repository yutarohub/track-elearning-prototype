"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LearnerIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/learner/home");
  }, [router]);

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#0f1629] text-white"
      aria-live="polite"
    >
      <p>リダイレクト中...</p>
    </div>
  );
}
