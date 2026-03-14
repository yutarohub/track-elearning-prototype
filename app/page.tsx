"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-[#0f1629] text-white"
      aria-live="polite"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-black text-white">
        T
      </div>
      <p>リダイレクト中...</p>
    </div>
  );
}
