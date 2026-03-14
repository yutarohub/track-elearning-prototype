import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#0f1629] text-white">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="text-white/80">ページが見つかりませんでした。</p>
      <Link
        href="/login"
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        ログインへ
      </Link>
    </div>
  );
}
