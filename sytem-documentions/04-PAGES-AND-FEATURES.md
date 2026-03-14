# 04 — ページと機能一覧

各ルートの役割・主要コンポーネント・モックデータの利用箇所をまとめる。実装順は 00-REBUILD-SPECIFICATION の「再構築の推奨順序」に従う。

---

## 1. /login (src/app/login/page.tsx)

- **役割:** 管理者ログイン。成功時は /admin/courses へ遷移。
- **主要要素:** フォーム（email / password）、useAuth().login、エラー表示、ローディング状態。
- **モック:** なし。認証は AuthContext の固定判定（02 参照）。

---

## 2. /admin/dashboard (src/app/admin/dashboard/page.tsx)

- **役割:** 管理者ダッシュボード。KPI カード、受講トレンドグラフ、コース一覧カード、右側にコース詳細スライドパネル。
- **主要要素:**
  - KPI カード: 総受講者数、アクティブコース数、修了数、バッジ発行数など。Recharts の BarChart / AreaChart 用データはハードコード（enrollmentAll, enrollmentSelf, enrollmentLive, cohortData）。
  - コース一覧: MOCK_COURSES をフィルタ・表示。カードクリックで右側に詳細パネル（タイトル、難易度、配信種別、タグ、進捗、編集する / 受講者をアサイン ボタン）。
  - 配信種別フィルタ: すべて / 自学習 / ライブ。
- **モック:** MOCK_COURSES, MOCK_BADGES。グラフ用データはページ内の定数。
- **コンポーネント:** EnrollmentChart, CohortHeatmap, MauTable など（src/components/dashboard/）を必要に応じて利用。

---

## 3. /admin/courses (src/app/admin/courses/page.tsx)

- **役割:** eラーニング管理。コース・学習パスの一覧テーブル。検索・種類・難易度フィルタ、ページネーション。
- **主要要素:**
  - 検索バー、フィルタ（種類: すべて/コース/学習パス、難易度: すべて/入門/初級/中級/上級）。
  - テーブル: タイトル、受講者数、種類（バッジ）、難易度（バッジ）、想定時間、進捗（ProgressIndicator: バー + 完了数バッジ）。
  - ページネーション: 1ページあたり 10 件、前後ボタン、件数表示。
- **モック:** MOCK_COURSES。filter + slice でフィルタ・ページネーション。
- **内部コンポーネント:** DifficultyBadge, TypeBadge, ProgressIndicator（同一ファイル内で定義可）。

---

## 4. /admin/publish (src/app/admin/publish/page.tsx)

- **役割:** eラーニング公開管理。ワンストップで「マテリアルアップロード → コース設定 → 公開・申込」を行う 3 ステップウィザード。
- **主要要素:**
  - ページ上部: プライマリボタン「マテリアルから新規公開（ワンストップ）」でモーダルを開く。
  - 公開済みコース一覧テーブル（MOCK_COURSES の一部を表示する想定。モックで固定リストでも可）。
  - モーダル内: ステップ 1（ファイルアップロード D&D または選択）、ステップ 2（コースタイトル、対象 e-learning/training、配信 自学習/ライブ、会場 online/offline）、ステップ 3（申込 即時/要申請、価格、申込期間）。完了で onPublish コールバック、トースト表示、テーブルに 1 件追加（モック）。
- **モック:** MOCK_COURSES を初期表示。公開アクションはクライアント側でリストに push するだけでも可。

---

## 5. /admin/library (src/app/admin/library/page.tsx)

- **役割:** ライブラリ。マテリアル（動画・PDF・スライド・クイズ）の一覧。検索・種別フィルタ。
- **主要要素:** テーブルまたはカード一覧。タイトル、種別、サイズ、時間/ページ数、作成日、更新日、サムネイル、紐付コースなど。
- **モック:** MOCK_MATERIALS（mockData.ts の MOCK_MATERIALS）。

---

## 6. /admin/badges (src/app/admin/badges/page.tsx)

- **役割:** バッジ一覧。バッジ名、説明、色、アイコン、紐付コース、発行数など。
- **主要要素:** カードまたはテーブル。MOCK_BADGES を表示。
- **モック:** MOCK_BADGES。

---

## 7. /learner/workspace (src/app/learner/workspace/page.tsx)

- **役割:** 受講者ビュー。現状は「Coming Soon」プレースホルダー。
- **主要要素:** 中央にメッセージ「受講者ビューは現在開発中です。」、スケルトン風のカード 2 つ、「管理者ビューに戻る」ボタン（setView("admin") で /admin/dashboard へ）。
- **モック:** なし。

---

## 8. 共通事項

- 各 admin ページは `<AppLayout>{ ... }</AppLayout>` でラップする。
- ローディング: src/app/loading.tsx と src/app/admin/loading.tsx で任意のローディング UIを出せる。
- スタイル: 03 のスタイル方針に合わせ、Tailwind で統一。角丸・シャドウ・バッジ色は既存 Admin Dashboard UI 仕様と揃えるとよい。
