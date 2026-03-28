# 03 — レイアウトと共通コンポーネント

## 1. AppLayout (src/components/layout/AppLayout.tsx)

- **役割:** 管理者ログイン後の共通シェル。Sidebar + Header + main。
- **条件:** `useAuth()` の `user` が null のときは `<>{children}</></>` のみ返し、サイドバー・ヘッダーを出さない。
- **構造:**
  - 最上部: スキップリンク `<a href="#main-content" className="skip-link">メインコンテンツへスキップ</a>`
  - 左: `<Sidebar />`（固定幅 64 = w-64 = 16rem）
  - 右: `<div className="pl-64">` 内に `<Header />` と `<main id="main-content" className="pt-16 min-h-screen" tabIndex={-1}>`、main 内に `<div className="p-8">{children}</div>`
- **背景:** 全体 `min-h-screen bg-slate-50`。

---

## 2. Sidebar (src/components/layout/Sidebar.tsx)

- **幅・位置:** `w-64 fixed top-0 bottom-0 left-0 z-20`、背景 `#0f1629`。
- **上部:** 高さ 16、ボーダー下。Track ロゴ（8x8 の角丸グラデーション「T」）+ 「Track Hub」テキスト。
- **ワークスペースボタン:** 「Workspace」ラベル + 「Track Demo」。aria-label「ワークスペース「Track Demo」を選択」。ドロップダウンは未実装（見た目のみ）。
- **ナビゲーション:** 2 ブロック。
  - **学習管理:** ダッシュボード管理(/admin/dashboard)、eラーニング公開管理(/admin/publish)、申請管理(#)、ディスカッション(#)。
  - **テナント全体管理:** メンバー(#)、試験(#)、契約(#)、ライブラリ(/admin/library)、バッジ(/admin/badges)、AIアシスタント(#)。
- **アクティブ:** `pathname === item.href` のとき、グラデーション背景・白文字。非アクティブは `text-white/50`、hover で `text-white/90` と `bg-white/[0.06]`。
- **アイコン:** lucide-react（LayoutDashboard, ClipboardList, MessageSquare, Users, TestTube, FileText, Library, Sparkles, Radio, Award, ChevronDown）。
- **フッター:** 「サポートへ問い合わせ」ボタン（aria-label 付き）。区切り線 `border-t border-white/[0.06]`。

---

## 3. Header (src/components/layout/Header.tsx)

- **位置:** `h-16 fixed top-0 right-0 left-64 z-10`。背景 `bg-white/80 backdrop-blur-xl`、ボーダー下・シャドウ。
- **左側:** ビュー切替（管理者 / 受講者）。`useAuth()` の `view` と `setView` を使用。`aria-pressed` と `aria-label` 付き。選択中は白背景・シャドウ。
- **右側:**
  - 通知ボタン（Bell アイコン、aria-label「通知」、赤点バッジ風）
  - 設定ボタン（Settings、aria-label「設定」）
  - 縦区切り線
  - アカウントメニュー（アバター「YI」、表示名「Track Admin」、ラベル「管理者」、ChevronDown）。aria-label「アカウントメニューを開く」。ドロップダウンは未実装。

---

## 4. スキップリンク (globals.css)

- **クラス:** `.skip-link`
- **通常:** 画面外（position absolute、1px、clip）。z-index 100。
- **:focus 時:** fixed、左上、パディング、背景 #4f46e5、白文字、角丸、シャドウ。キーボードユーザーが最初の Tab で「メインコンテンツへスキップ」を表示し、Enter で #main-content に飛べるようにする。

---

## 5. スタイル方針（Tailwind）

- **管理画面メイン:** 白・スレート基調。`bg-slate-50`、カードは `bg-white border border-slate-100 rounded-2xl`。
- **サイドバー・ログイン:** ダークネイビー `#0f1629`。アクセントは indigo / violet グラデーション。
- **バッジ類:** 難易度は sky / emerald / amber / rose。種類は violet / slate。角丸は `rounded-full` または `rounded-xl`。
- **ボタン:** プライマリは `from-indigo-600 to-violet-600` グラデーション。hover・active で少し明るくまたは scale。
- **フォント:** 見出しは font-bold または font-black。ラベルは text-[9px]〜text-[11px] の uppercase tracking 多用。

---

## 6. 再実装時のチェックリスト

- [ ] AppLayout で user が null のときは children のみ
- [ ] Sidebar の navItems 配列（href とアイコン）を 02 のルート一覧と一致させる
- [ ] Header の view / setView で /admin/dashboard と /learner/workspace へ遷移
- [ ] globals.css に .skip-link と :focus スタイルを定義
- [ ] main に id="main-content" と tabIndex={-1} を付与
