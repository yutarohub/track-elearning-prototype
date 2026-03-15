"use client";

import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Filter,
  Search,
  Upload,
  ExternalLink,
  Plus,
  BookOpen,
  Target,
  Video,
  FileText,
  Layout,
  FileCode,
  FolderOpen,
  GraduationCap,
  MapPin,
  X,
} from "lucide-react";
import type {
  LibraryMaterialCategory,
  LibraryCourseCategory,
  PublishFilter,
  LibraryBook,
  LibrarySurvey,
  LibraryVideo,
  LibraryFile,
  LibraryApp,
  LibrarySlide,
  LibraryCourseRow,
  LibraryLearningPath,
} from "@/lib/libraryMock";
import {
  MOCK_LIBRARY_BOOKS,
  MOCK_LIBRARY_SURVEYS,
  MOCK_LIBRARY_VIDEOS,
  MOCK_LIBRARY_FILES,
  MOCK_LIBRARY_APPS,
  MOCK_LIBRARY_SLIDES,
  MOCK_LIBRARY_COURSES,
  MOCK_LIBRARY_LEARNING_PATHS,
} from "@/lib/libraryMock";

type LibraryTab = LibraryMaterialCategory | LibraryCourseCategory;

const MATERIAL_TABS: { id: LibraryMaterialCategory; label: string; icon: typeof BookOpen }[] = [
  { id: "book", label: "ブック", icon: BookOpen },
  { id: "challenge", label: "チャレンジ", icon: Target },
  { id: "survey", label: "アンケート", icon: FileText },
  { id: "video", label: "動画", icon: Video },
  { id: "app", label: "アプリ", icon: Layout },
  { id: "file", label: "ファイル", icon: FileText },
  { id: "slide", label: "スライド", icon: Layout },
  { id: "markdown", label: "マークダウン", icon: FileCode },
];

const COURSE_TABS: { id: LibraryCourseCategory; label: string; icon: typeof FolderOpen }[] = [
  { id: "course", label: "コース", icon: FolderOpen },
  { id: "learningpath", label: "学習パス", icon: GraduationCap },
];

const FILTER_CHIPS: { id: PublishFilter; label: string }[] = [
  { id: "e-learning", label: "eラーニング用" },
  { id: "training", label: "集合研修用" },
  { id: "live", label: "ライブイベント用" },
];

const TCM_BASE_URL = "https://tcm.tracks.run"; // モック: TCMのベースURL

function Badge({ kind }: { kind: string }) {
  const style =
    kind === "e-learning"
      ? "bg-blue-100 text-blue-800"
      : kind === "live"
        ? "bg-emerald-100 text-emerald-800"
        : kind === "training"
          ? "bg-slate-200 text-slate-700"
          : kind === "Track公式"
            ? "bg-sky-100 text-sky-800 border border-sky-200"
            : kind === "自社オリジナル"
              ? "bg-slate-100 text-slate-700"
              : kind === "New"
                ? "bg-red-100 text-red-700"
                : "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${style}`}>
      {kind}
    </span>
  );
}

export default function LibraryPage() {
  const [tab, setTab] = useState<LibraryTab>("book");
  const [search, setSearch] = useState("");
  const [publishFilter, setPublishFilter] = useState<PublishFilter | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [courseModalStep, setCourseModalStep] = useState(1);
  const [courseForm, setCourseForm] = useState({
    target: "" as "e-learning" | "training" | "",
    format: "" as "self" | "live" | "",
    liveType: "" as "online" | "offline" | "",
    publish: "" as "free" | "paid" | "",
    price: "",
    applyPeriod: "",
  });

  const isUploadCategory = tab === "video" || tab === "file";
  const isCourseCategory = tab === "course" || tab === "learningpath";

  // テーブル用フィルタ済みデータ
  const tableData = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filterBySearch = <T extends { title?: string; name?: string }>(items: T[], nameKey: "title" | "name" = "title") =>
      q ? items.filter((x) => ((nameKey === "title" ? x.title : x.name) ?? "").toLowerCase().includes(q)) : items;

    if (tab === "book") return filterBySearch(MOCK_LIBRARY_BOOKS, "name");
    if (tab === "survey") return filterBySearch(MOCK_LIBRARY_SURVEYS);
    if (tab === "video") return filterBySearch(MOCK_LIBRARY_VIDEOS);
    if (tab === "file") return filterBySearch(MOCK_LIBRARY_FILES);
    if (tab === "app") return filterBySearch(MOCK_LIBRARY_APPS, "name");
    if (tab === "slide") return filterBySearch(MOCK_LIBRARY_SLIDES);
    if (tab === "course") {
      let list = MOCK_LIBRARY_COURSES;
      if (publishFilter) list = list.filter((c) => c.publishType === publishFilter);
      return filterBySearch(list);
    }
    if (tab === "learningpath") {
      let list = MOCK_LIBRARY_LEARNING_PATHS;
      if (publishFilter) list = list.filter((l) => l.publishType === publishFilter);
      return filterBySearch(list);
    }
    return [];
  }, [tab, search, publishFilter]);

  const openUploadModal = () => setUploadModalOpen(true);
  const openCourseModal = () => {
    setCourseForm({ target: "", format: "", liveType: "", publish: "", price: "", applyPeriod: "" });
    setCourseModalStep(1);
    setCourseModalOpen(true);
  };

  return (
    <AppLayout>
      <div className="flex gap-0">
        {/* Sub-sidebar */}
        <aside className="w-52 shrink-0 border-r border-slate-200 bg-white">
          <p className="mb-1 px-3 pt-4 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            マテリアル
          </p>
          <nav className="space-y-0.5 px-2 pb-4">
            {MATERIAL_TABS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  tab === id ? "bg-blue-50 font-medium text-blue-700" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
          <p className="mb-1 px-3 pt-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            コース
          </p>
          <nav className="space-y-0.5 px-2 pb-4">
            {COURSE_TABS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  tab === id ? "bg-blue-50 font-medium text-blue-700" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1 p-6">
          <h1 className="text-2xl font-bold text-slate-900">ライブラリ</h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px] flex-1">
              <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Search className="absolute left-9 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Q 検索"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-20 pr-4 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                aria-label="検索"
              />
            </div>

            {isCourseCategory && (
              <div className="flex flex-wrap gap-2">
                {FILTER_CHIPS.map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPublishFilter(publishFilter === id ? null : id)}
                    className={`rounded-full px-3 py-1.5 text-sm transition ${
                      publishFilter === id
                        ? id === "e-learning"
                          ? "bg-blue-600 text-white"
                          : id === "live"
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            <div className="ml-auto">
              {isUploadCategory && (
                <button
                  type="button"
                  onClick={openUploadModal}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  <Upload className="h-4 w-4" />
                  {tab === "video" ? "動画をアップロード" : "ファイルをアップロード"}
                </button>
              )}
              {!isUploadCategory && !isCourseCategory && (
                <a
                  href={`${TCM_BASE_URL}/library/${tab}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  TCMで作成・編集
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              {isCourseCategory && (
                <button
                  type="button"
                  onClick={openCourseModal}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4" />
                  {tab === "course" ? "コースを作成" : "学習パスを作成"}
                </button>
              )}
            </div>
          </div>

          {/* Data table / Empty state */}
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {(tab === "markdown" && tableData.length === 0) || tab === "challenge" ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                <FileCode className="mb-4 h-16 w-16 text-slate-300" />
                <p className="text-lg font-medium">
                  {tab === "markdown" ? "マークダウンはありません" : "チャレンジはありません"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80">
                      {tab === "book" && (
                        <>
                          <th className="px-4 py-3 font-semibold text-slate-700">ID</th>
                          <th className="px-4 py-3 font-semibold text-slate-700">名前</th>
                          <th className="px-4 py-3 font-semibold text-slate-700">チャプター数</th>
                          <th className="px-4 py-3 font-semibold text-slate-700">想定受講時間</th>
                          <th className="px-4 py-3 font-semibold text-slate-700">言語</th>
                        </>
                      )}
                      {tab === "survey" && (
                        <>
                          <th className="px-4 py-3 font-semibold text-slate-700">ID</th>
                          <th className="px-4 py-3 font-semibold text-slate-700">タイトル</th>
                        </>
                      )}
                      {tab === "video" && (
                        <>
                          <th className="px-4 py-3 font-semibold text-slate-700">プレビュー</th>
                          <th className="px-4 py-3 font-semibold text-slate-700">タイトル</th>
                          <th className="px-4 py-3 font-semibold text-slate-700">再生時間</th>
                          <th className="px-4 py-3 font-semibold text-slate-700">アップロード時間</th>
                        </>
                      )}
                      {tab === "file" && (
                        <>
                          <th className="px-4 py-3 font-semibold text-slate-700">タイトル</th>
                          <th className="px-4 py-3 font-semibold text-slate-700">ファイルタイプ</th>
                          <th className="px-4 py-3 font-semibold text-slate-700">ファイルサイズ</th>
                          <th className="px-4 py-3 font-semibold text-slate-700">アップロード時間</th>
                        </>
                      )}
                      {tab === "app" && (
                        <>
                          <th className="px-4 py-3 font-semibold text-slate-700">ID</th>
                          <th className="px-4 py-3 font-semibold text-slate-700">名前</th>
                          <th className="px-4 py-3 font-semibold text-slate-700">想定受講時間</th>
                        </>
                      )}
                      {tab === "slide" && (
                        <>
                          <th className="px-4 py-3 font-semibold text-slate-700">ID</th>
                          <th className="px-4 py-3 font-semibold text-slate-700">タイトル</th>
                          <th className="px-4 py-3 font-semibold text-slate-700">ページ数</th>
                          <th className="px-4 py-3 font-semibold text-slate-700">想定受講時間</th>
                          <th className="px-4 py-3 font-semibold text-slate-700">言語</th>
                        </>
                      )}
                      {tab === "course" && (
                        <>
                          <th className="px-4 py-3 font-semibold text-slate-700">タイトル</th>
                          <th className="px-4 py-3 font-semibold text-slate-700">想定受講時間</th>
                          <th className="px-4 py-3 font-semibold text-slate-700">マテリアル</th>
                          <th className="px-4 py-3 font-semibold text-slate-700">Eラーニング</th>
                        </>
                      )}
                      {tab === "learningpath" && (
                        <>
                          <th className="px-4 py-3 font-semibold text-slate-700">ID</th>
                          <th className="px-4 py-3 font-semibold text-slate-700">タイトル</th>
                          <th className="px-4 py-3 font-semibold text-slate-700">講座</th>
                          <th className="px-4 py-3 font-semibold text-slate-700">想定受講時間</th>
                          <th className="px-4 py-3 font-semibold text-slate-700">Eラーニング</th>
                        </>
                      )}
                      {(tab === "book" || tab === "survey" || tab === "video" || tab === "file" || tab === "app" || tab === "slide" || tab === "course" || tab === "learningpath") && (
                        <th className="w-10 px-2 py-3" aria-label="操作" />
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {tab === "book" &&
                      (tableData as LibraryBook[]).map((row) => (
                        <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="px-4 py-3 text-slate-600">{row.id}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              <span className="font-medium text-slate-900">{row.name}</span>
                              {row.badges?.map((b) => <Badge key={b} kind={b} />)}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{row.chapters}</td>
                          <td className="px-4 py-3 text-slate-600">{row.estimatedTime}</td>
                          <td className="px-4 py-3 text-slate-600">{row.language}</td>
                          <td className="px-2 py-3"><button type="button" className="p-1 text-slate-400 hover:text-slate-600">⋯</button></td>
                        </tr>
                      ))}
                    {tab === "survey" &&
                      (tableData as LibrarySurvey[]).map((row) => (
                        <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="px-4 py-3 text-slate-600">{row.id}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              <span className="font-medium text-slate-900">{row.title}</span>
                              {row.badges?.map((b) => <Badge key={b} kind={b} />)}
                            </div>
                          </td>
                          <td className="px-2 py-3"><button type="button" className="p-1 text-slate-400 hover:text-slate-600">⋯</button></td>
                        </tr>
                      ))}
                    {tab === "video" &&
                      (tableData as LibraryVideo[]).map((row) => (
                        <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="px-4 py-3 text-slate-400">🎬</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              <span className="font-medium text-slate-900">{row.title}</span>
                              {row.badges?.map((b) => <Badge key={b} kind={b} />)}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{row.playbackTime}</td>
                          <td className="px-4 py-3 text-slate-600">{row.uploadTime}</td>
                          <td className="px-2 py-3"><button type="button" className="p-1 text-slate-400 hover:text-slate-600">⋯</button></td>
                        </tr>
                      ))}
                    {tab === "file" &&
                      (tableData as LibraryFile[]).map((row) => (
                        <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              <span className="font-medium text-slate-900">{row.title}</span>
                              {row.badges?.map((b) => <Badge key={b} kind={b} />)}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{row.fileType}</td>
                          <td className="px-4 py-3 text-slate-600">{row.fileSize}</td>
                          <td className="px-4 py-3 text-slate-600">{row.uploadTime}</td>
                          <td className="px-2 py-3"><button type="button" className="p-1 text-slate-400 hover:text-slate-600">⋯</button></td>
                        </tr>
                      ))}
                    {tab === "app" &&
                      (tableData as LibraryApp[]).map((row) => (
                        <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="px-4 py-3 text-slate-600">{row.id}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              <span className="font-medium text-slate-900">{row.name}</span>
                              <span className="text-slate-500">({row.version})</span>
                              {row.badges?.map((b) => <Badge key={b} kind={b} />)}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{row.estimatedTime}</td>
                          <td className="px-2 py-3"><button type="button" className="p-1 text-slate-400 hover:text-slate-600">⋯</button></td>
                        </tr>
                      ))}
                    {tab === "slide" &&
                      (tableData as LibrarySlide[]).map((row) => (
                        <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="px-4 py-3 text-slate-600">{row.id}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              <span className="font-medium text-slate-900">{row.title}</span>
                              {row.badges?.map((b) => <Badge key={b} kind={b} />)}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{row.pageCount}</td>
                          <td className="px-4 py-3 text-slate-600">{row.estimatedTime}</td>
                          <td className="px-4 py-3 text-slate-600">{row.language}</td>
                          <td className="px-2 py-3"><button type="button" className="p-1 text-slate-400 hover:text-slate-600">⋯</button></td>
                        </tr>
                      ))}
                    {tab === "course" &&
                      (tableData as LibraryCourseRow[]).map((row) => (
                        <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              <span className="font-medium text-slate-900">{row.title}</span>
                              {row.badges?.map((b) => <Badge key={b} kind={b} />)}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{row.estimatedTime}</td>
                          <td className="px-4 py-3 text-slate-600">{row.materialCount}</td>
                          <td className="px-4 py-3 text-slate-600">✓</td>
                          <td className="px-2 py-3"><button type="button" className="p-1 text-slate-400 hover:text-slate-600">⋯</button></td>
                        </tr>
                      ))}
                    {tab === "learningpath" &&
                      (tableData as LibraryLearningPath[]).map((row) => (
                        <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="px-4 py-3 text-slate-600">{row.id}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              <span className="font-medium text-slate-900">{row.title}</span>
                              {row.badges?.map((b) => <Badge key={b} kind={b} />)}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{row.courseCount}</td>
                          <td className="px-4 py-3 text-slate-600">{row.estimatedTime}</td>
                          <td className="px-4 py-3 text-slate-600">{row.hasElearning ? "✓" : "—"}</td>
                          <td className="px-2 py-3"><button type="button" className="p-1 text-slate-400 hover:text-slate-600">⋯</button></td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* アップロードモーダル */}
      {uploadModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-[fade-in_0.2s_ease-out]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="upload-modal-title"
        >
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl animate-[fade-in_0.2s_ease-out]">
            <h2 id="upload-modal-title" className="text-lg font-semibold text-slate-900">
              {tab === "video" ? "動画をアップロード" : "ファイルをアップロード"}
            </h2>
            <div
              className="mt-4 flex min-h-[180px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-slate-500"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => e.preventDefault()}
            >
              <Upload className="mb-2 h-10 w-10 text-slate-400" />
              <p className="text-sm">ドラッグ＆ドロップ、またはクリックして選択</p>
              <p className="mt-1 text-xs">jpeg, jpg, gif, png, mp4, zip など</p>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                キャンセル
              </button>
              <button
                type="button"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                アップロード
              </button>
            </div>
          </div>
        </div>
      )}

      {/* コース作成モーダル（Progressive Disclosure） */}
      {courseModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-[fade-in_0.2s_ease-out]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="course-modal-title"
        >
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl animate-[fade-in_0.2s_ease-out]">
            <div className="flex items-center justify-between">
              <h2 id="course-modal-title" className="text-lg font-semibold text-slate-900">
                {tab === "course" ? "コースを作成" : "学習パスを作成"}
              </h2>
              <button
                type="button"
                onClick={() => setCourseModalOpen(false)}
                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="閉じる"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {courseModalStep === 1 && (
                <div className="animate-[fade-in_0.25s_ease-out]">
                  <p className="mb-2 text-sm font-medium text-slate-700">ターゲット選択</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCourseForm((f) => ({ ...f, target: "e-learning" }))}
                      className={`flex-1 rounded-lg border px-3 py-2.5 text-sm ${
                        courseForm.target === "e-learning" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      eラーニング用
                    </button>
                    <button
                      type="button"
                      onClick={() => setCourseForm((f) => ({ ...f, target: "training" }))}
                      className={`flex-1 rounded-lg border px-3 py-2.5 text-sm ${
                        courseForm.target === "training" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      集合研修用
                    </button>
                  </div>
                </div>
              )}

              {courseModalStep >= 2 && (
                <div className="animate-[fade-in_0.25s_ease-out]">
                  <p className="mb-2 text-sm font-medium text-slate-700">形式選択</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCourseForm((f) => ({ ...f, format: "self" }))}
                      className={`flex-1 rounded-lg border px-3 py-2.5 text-sm ${
                        courseForm.format === "self" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      自学習用
                    </button>
                    <button
                      type="button"
                      onClick={() => setCourseForm((f) => ({ ...f, format: "live" }))}
                      className={`flex-1 rounded-lg border px-3 py-2.5 text-sm ${
                        courseForm.format === "live" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      ライブイベント
                    </button>
                  </div>
                </div>
              )}

              {courseModalStep >= 3 && courseForm.format === "live" && (
                <div className="animate-[fade-in_0.25s_ease-out]">
                  <p className="mb-2 text-sm font-medium text-slate-700">ライブイベント詳細</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCourseForm((f) => ({ ...f, liveType: "online" }))}
                      className={`flex-1 rounded-lg border px-3 py-2.5 text-sm ${
                        courseForm.liveType === "online" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      オンライン (Zoomリンク入力)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCourseForm((f) => ({ ...f, liveType: "offline" }))}
                      className={`flex-1 rounded-lg border px-3 py-2.5 text-sm ${
                        courseForm.liveType === "offline" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      オフライン (会場入力)
                    </button>
                  </div>
                </div>
              )}

              {courseModalStep >= (courseForm.format === "live" ? 4 : 3) && (
                <div className="animate-[fade-in_0.25s_ease-out]">
                  <p className="mb-2 text-sm font-medium text-slate-700">公開・申請設定</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCourseForm((f) => ({ ...f, publish: "free" }))}
                      className={`flex-1 rounded-lg border px-3 py-2.5 text-sm ${
                        courseForm.publish === "free" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      即時受講 (無償)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCourseForm((f) => ({ ...f, publish: "paid" }))}
                      className={`flex-1 rounded-lg border px-3 py-2.5 text-sm ${
                        courseForm.publish === "paid" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      受講申請を必須とする (有償・承認制)
                    </button>
                  </div>
                  {courseForm.publish === "paid" && (
                    <div className="mt-4 animate-[fade-in_0.25s_ease-out] space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">料金</label>
                        <input
                          type="text"
                          value={courseForm.price}
                          onChange={(e) => setCourseForm((f) => ({ ...f, price: e.target.value }))}
                          placeholder="例: 10,000円"
                          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">申込期間</label>
                        <input
                          type="text"
                          value={courseForm.applyPeriod}
                          onChange={(e) => setCourseForm((f) => ({ ...f, applyPeriod: e.target.value }))}
                          placeholder="例: 2025/01/01 ～ 2025/01/31"
                          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={() => setCourseModalStep((s) => Math.max(1, s - 1))}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                戻る
              </button>
              {(courseModalStep === 3 && courseForm.format !== "live") || courseModalStep === 4 ? (
                <button
                  type="button"
                  onClick={() => setCourseModalOpen(false)}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  作成
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCourseModalStep((s) => s + 1)}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  次へ
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
