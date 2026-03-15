"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * 旧 eラーニング管理 はダッシュボードの「公開中コース一覧」に統合済み。
 * /admin/courses はダッシュボードへリダイレクトする。
 */
export default function CoursesRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);
  return null;
}
