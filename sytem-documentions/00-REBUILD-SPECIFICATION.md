# Track Hub プロトタイプ — 再構築用マスター仕様書

別ワークスペースで本プロトタイプを一から再現するためのエントリードキュメントです。以下のドキュメントを順に参照して実装してください。

---

## 1. ドキュメント一覧

| ファイル | 内容 |
|----------|------|
| **00-REBUILD-SPECIFICATION.md** (本ファイル) | 全体像・フォルダ構成・ルート一覧・起動方法 |
| **01-TECHNICAL-STACK-AND-CONFIG.md** | 技術スタック、package.json、next.config、tsconfig、Tailwind |
| **02-AUTH-AND-ROUTING.md** | 認証（AuthContext）、ログイン、開発時デモユーザー、リダイレクト |
| **03-LAYOUT-AND-COMPONENTS.md** | AppLayout、Sidebar、Header、スキップリンク、スタイル方針 |
| **04-PAGES-AND-FEATURES.md** | 各ページの役割、主要コンポーネント、モック利用箇所 |
| **05-MOCK-DATA-SCHEMA.md** | Course / Badge / Material 型とサンプルデータ |
| **Track e-learning Admin Dashboard UI.md** | 管理画面のUIコンポーネントツリー（既存） |
| **Track e-learning Self-Learning Workspace UI Prototype.md** | 受講者ワークスペースのUX要件（既存） |

---

## 2. プロジェクト概要

- **名前:** track-hub（Track e-learning New Hub プロトタイプ）
- **目的:** eラーニング統合ダッシュボードのフロントエンドUIプロトタイプ。管理者向け「学習管理・公開管理・ライブラリ・バッジ・ダッシュボード」と、受講者向けワークスペース（Coming Soon）を同一アプリで提供する。
- **スタック:** Next.js 16 (App Router)、React 19、TypeScript、Tailwind CSS 4、lucide-react、recharts。

---

## 3. フォルダ構成（再現するディレクトリ構造）

```
プロジェクトルート/
├── package.json
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs (または Tailwind 4 の設定)
├── src/
│   ├── app/
│   │   ├── layout.tsx          # ルートレイアウト（AuthProvider、Inter フォント）
│   │   ├── page.tsx            # / → クライアントで /login へ replace
│   │   ├── globals.css          # Tailwind + キーフレーム + .skip-link
│   │   ├── loading.tsx         # ルート用ローディング
│   │   ├── login/
│   │   │   └── page.tsx        # ログイン画面
│   │   ├── admin/
│   │   │   ├── loading.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx    # ダッシュボード（KPI・グラフ・コース一覧）
│   │   │   ├── courses/
│   │   │   │   └── page.tsx    # eラーニング管理（コース一覧テーブル）
│   │   │   ├── publish/
│   │   │   │   └── page.tsx    # 公開管理（ワンストップウィザード）
│   │   │   ├── library/
│   │   │   │   └── page.tsx    # ライブラリ（マテリアル一覧）
│   │   │   └── badges/
│   │   │       └── page.tsx    # バッジ一覧
│   │   └── learner/
│   │       └── workspace/
│   │           └── page.tsx    # 受講者ビュー（Coming Soon）
│   ├── context/
│   │   └── AuthContext.tsx     # 認証状態・login/logout・view 切替
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx   # Sidebar + Header + main
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   └── dashboard/          # ダッシュボード用（EnrollmentChart, CohortHeatmap, MauTable 等）
│   └── lib/
│       └── mockData.ts         # MOCK_COURSES, MOCK_BADGES, MOCK_MATERIALS
├── public/                     # 静的ファイル（任意）
└── sytem-documentions/         # 本仕様書群
```

- **パスエイリアス:** `@/*` → `./src/*`（tsconfig.json の paths）。

---

## 4. ルート一覧

| パス | 説明 | 認証 |
|------|------|------|
| `/` | ホーム → 即時 `/login` へ replace | 不要 |
| `/login` | ログイン画面 | 不要 |
| `/admin/dashboard` | 管理者ダッシュボード | 要（開発時は /admin 直アクセスでデモユーザー） |
| `/admin/courses` | eラーニング管理（コース一覧） | 要 |
| `/admin/publish` | eラーニング公開管理（ワンストップ公開） | 要 |
| `/admin/library` | ライブラリ（マテリアル一覧） | 要 |
| `/admin/badges` | バッジ一覧 | 要 |
| `/learner/workspace` | 受講者ワークスペース（Coming Soon） | 要 |

---

## 5. 起動・ビルド

- **開発:** プロジェクト直下で `npm install` 後、`npm run dev`。デフォルトで `--hostname 127.0.0.1 --turbopack` を推奨（環境によっては `uv_interface_addresses` エラーを避けるため）。
- **本番ビルド:** `npm run build` → `npm run start`。
- **アクセス:** 開発時は `http://127.0.0.1:3000`（または `http://localhost:3000`）。ログイン後は `/admin/courses` にリダイレクト。

---

## 6. 開発時の認証ショートカット

- `/admin/*` または `/learner/*` に未ログインで直接アクセスした場合、**development 時のみ** デモユーザー `{ email: "demo@track.local", role: "admin" }` を localStorage にセットし、そのまま表示する。本番では未ログインなら `/login` へリダイレクト。

---

## 7. 再構築の推奨順序

1. **01** で Next.js + Tailwind + 依存関係と設定を用意する。
2. **02** で AuthContext とログイン・ルート `/` のリダイレクトを実装する。
3. **03** で AppLayout / Sidebar / Header を実装し、管理画面の土台を用意する。
4. **05** のモックデータを `src/lib/mockData.ts` に用意する。
5. **04** に従い、各 admin ページ（dashboard → courses → publish → library → badges）と learner/workspace を実装する。
6. 既存の **Track e-learning Admin Dashboard UI.md** および **Track e-learning Self-Learning Workspace UI Prototype.md** でUI詳細を補足する。

以上で、別ワークスペースから本プロトタイプを再現できます。
