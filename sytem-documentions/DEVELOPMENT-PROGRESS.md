# 開発進捗ドキュメント（Track Hub / Skill Hub 連携プロトタイプ）

実装タスクを**推奨順**に並べ、作業のたびにチェックを更新して進捗を共有するためのドキュメントです。  
**更新ルール:** 着手したら `進行中` にし、マージまたは確認済みになったら `完了` に変更してください。日付と短いメモを括弧で残すと後追いしやすくなります。

---

## クイックメモ（自由記入）

| 日付 | メモ |
|------|------|
| 2026-03-28 | フェーズ2・3の主要画面（申請・メンバー・契約・AI、受講者スキル系ルート・Sidebar連結・カタログ連動・有償申請モック）を実装 |

---

## ステータス凡例

| 記号 | 意味 |
|------|------|
| `完了` | 仕様どおり動作確認済み（または意図したモックで固定） |
| `進行中` | 現在タッチしている |
| `未着手` | まだ手を付けていない |
| `保留` | スコープ外・別フェーズへ延期 |

---

## 参照アセット（設計・正解のたたき台）

| 種類 | パス |
|------|------|
| prod 受講者フロー動画 | [ui-screenshots/prod-track-skill-hub-learner-flow-2026-03-28.mp4](../ui-screenshots/prod-track-skill-hub-learner-flow-2026-03-28.mp4) |
| Miro 管理者理想フロー | [ui-screenshots/miro-ideal-flow-administrator.png](../ui-screenshots/miro-ideal-flow-administrator.png) |
| Miro 従業員理想フロー | [ui-screenshots/miro-ideal-flow-learner.png](../ui-screenshots/miro-ideal-flow-learner.png) |

---

## フェーズ 0 — ベースライン（既存プロトタイプ）

既に `app/` 配下に存在する画面・機能の棚卸しです。壊れていなければ `完了` のままにします。

| ID | タスク | ルート / ファイル | ステータス |
|----|--------|-------------------|------------|
| DEV-00-01 | ログイン・AuthContext・開発時デモユーザー | `app/login`, `src/context/AuthContext.tsx` | 完了 |
| DEV-00-02 | 管理者レイアウト（Sidebar / Header / AppLayout） | `src/components/layout/` | 完了 |
| DEV-00-03 | 管理者ダッシュボード | `/admin/dashboard` | 完了 |
| DEV-00-04 | eラーニング管理（コース一覧） | `/admin/courses` | 完了 |
| DEV-00-05 | eラーニング公開管理（ウィザード） | `/admin/publish` | 完了 |
| DEV-00-06 | ライブラリ | `/admin/library` | 完了 |
| DEV-00-07 | バッジ管理 | `/admin/badges` | 完了 |
| DEV-00-08 | コースレイティング | `/admin/course-ratings` | 完了 |
| DEV-00-09 | 受講者ホーム（Skill Hub 風プレースホルダー含む） | `/learner/home` | 完了 |
| DEV-00-10 | 受講者コースカタログ（検索・フィルタ・セクション） | `/learner/skills/courses` | 完了 |
| DEV-00-11 | コース閲覧（browse） | `/learner/skills/courses/browse` | 完了 |
| DEV-00-12 | 受講者 workspace（Coming Soon 等） | `/learner/workspace` | 完了 |
| DEV-00-13 | 管理者 ⇄ 受講者ビュー切替（Header） | `src/components/layout/Header.tsx` | 完了 |

---

## フェーズ 1 — 仕様書とリポジトリの同期

| ID | タスク | 出力 / 対象 | ステータス |
|----|--------|-------------|------------|
| DEV-D01 | `04-PAGES-AND-FEATURES.md` を実ルートに合わせて更新（`/learner/home` 等） | `sytem-documentions/04-PAGES-AND-FEATURES.md` | 未着手 |
| DEV-D02 | `00-REBUILD-SPECIFICATION.md` のルート一覧・フォルダ構成を `app/` 実態に合わせる | `sytem-documentions/00-REBUILD-SPECIFICATION.md` | 未着手 |
| DEV-D03 | Skill Hub × Track 統合のプロトタイプ設計書を追加（Miro・動画・モック同期・フェーズ） | `sytem-documentions/06-SKILL-HUB-TRACK-INTEGRATION-PROTOTYPE-DESIGN.md`（新規） | 未着手 |
| DEV-D04 | エージェント用プロンプトに「06 参照・拡張スコープ」を追記 | `AGENT-PROMPT-PROTOTYPE-DEVELOPMENT.md` | 未着手 |

---

## フェーズ 2 — 管理者（Miro・prod に対する追記・ブラッシュアップ）

サイドバーが `href: "#"` の項目は、ページ新設または「準備中」ダイアログ等の最低限の導線を想定しています。

| ID | タスク | 想定ルート / 備考 | ステータス |
|----|--------|-------------------|------------|
| DEV-A01 | **申請管理** — 有償コース等の申請一覧（承認待ち・却下・承認のモック） | `/admin/applications` など新規 | 完了（2026-03-28） |
| DEV-A02 | **メンバー** — 受講者一覧のモック画面 | `/admin/members` など新規 | 完了（2026-03-28） |
| DEV-A03 | **契約** — MAU / ライセンス概要のモック（ダッシュボードウィジェットと役割分担を決める） | `/admin/contracts` または dashboard 内 | 完了（2026-03-28・契約ページに集約） |
| DEV-A04 | **AIアシスタント**（管理者）— ログ閲覧スタブ or プレースホルダー | `/admin/ai-assistant` など | 完了（2026-03-28） |
| DEV-A05 | ダッシュボードに **学習ヘルス / 学習状況 / MAU** のウィジェットを Miro 準拠で追加（モック KPI） | `app/admin/dashboard/page.tsx` | 完了（2026-03-28） |
| DEV-A06 | **TCM（Track Content Manager）** 概念を UI 上で明示（ライブラリのアップロード導線・ラベル・ツールチップ） | `app/admin/library` など | 完了（2026-03-28） |
| DEV-A07 | 公開管理フローとライブラリの文案・遷移を Miro の「マテリアル選定 → コース情報 → 公開」と揃える | `app/admin/publish` | 完了（2026-03-28） |
| DEV-A08 | Sidebar の `#` を上記ルートに接続（未実装は `/admin/...` のプレースホルダーページでも可） | `src/components/layout/Sidebar.tsx` | 完了（2026-03-28） |

---

## フェーズ 3 — 受講者（Skill Hub シェル + Track e-learning）

Miro（従業員フロー）および prod 動画の「同一アカウントでの行き来」をプロトタイプで再現する項目です。

| ID | タスク | 想定ルート / 備考 | ステータス |
|----|--------|-------------------|------------|
| DEV-L01 | **保有スキル一覧** — 一覧ページ（モックデータ） | `/learner/skills/owned` など | 完了（2026-03-28） |
| DEV-L02 | **スキルギャップ分析** — ギャップ一覧 → 詳細（モック） | `/learner/skills/gap` | 完了（2026-03-28・詳細は `/gap/[code]`） |
| DEV-L03 | **AI コースレコメンド** — ギャップ連動のレコメンド UI（モック） | `/learner/skills/recommendations` | 完了（2026-03-28） |
| DEV-L04 | **学習パス自動生成** — レコメンドからパス生成結果画面（モック） | `/learner/skills/learning-path` | 完了（2026-03-28） |
| DEV-L05 | **学習パス**（一覧・進捗ステップ） — Self-Learning 仕様の Locked/Active/Completed | `/learner/skills/paths` | 完了（2026-03-28） |
| DEV-L06 | **学習履歴** | `/learner/skills/history` | 完了（2026-03-28） |
| DEV-L07 | **通知 BOX** — ヘッダーまたは専用ページ | `Header` または `/learner/notifications` | 完了（2026-03-28） |
| DEV-L08 | コースカタログの **絞り込み** をギャップ / レコメンドと連動（クエリ or コンテキスト） | `app/learner/skills/courses/page.tsx` | 完了（2026-03-28・`?source=`） |
| DEV-L09 | **無償 / 有償** — 有償は申請 → `承認待ち` → 受講開始の状態表示（モック） | コースカード CTA 周り | 完了（2026-03-28） |
| DEV-L10 | **自動コース展開** — 管理者配信を想定したバナー or セクション（モック） | `home` または `courses` | 完了（2026-03-28・home バナー） |
| DEV-L11 | スキル診断（**スキル調査・試験**）のプレースホルダーページ | `/learner/diagnostics/...` | 完了（2026-03-28） |
| DEV-L12 | TraineeSidebar の `href: "#"` を DEV-L01〜L11 のルートに接続 | `src/components/layout/TraineeSidebar.tsx` | 完了（2026-03-28・タイムライン `/skills/timeline` 追加） |
| DEV-L13 | prod 動画と並走して **シームレス遷移** の見た目・文言を確認（ログイン後デフォルト遷移・戻る導線） | `login`, `Header`, レイアウト | 保留（手動確認・文言微調整） |

---

## フェーズ 4 — 統合イベント（モック）

Skill Hub と Track の「完了後にスキル・バッジが戻る」ループをフロントのみで見せるための項目です。

| ID | タスク | 備考 | ステータス |
|----|--------|------|------------|
| DEV-I01 | 受講完了（モックアクション）で **スキル取得イベント** を発火 | `localStorage` または React Context | 未着手 |
| DEV-I02 | 同上で **バッジ取得** をホーム / 保有スキルに反映 | DEV-L01 / `home` と連携 | 未着手 |
| DEV-I03 | `05-MOCK-DATA-SCHEMA.md` に受講者用フィールド（例: `pendingApproval`, `recommendedFromGap`）を追記 | ドキュメント + `mockData` | 未着手 |

---

## 確認用チェックリスト（リリース前の手動確認）

実装後、ここをコピーして issue や PR に貼っても構いません。

- [ ] `/login` → 管理者ダッシュボードへ遷移し、Sidebar から主要 admin ページが開ける
- [ ] Header で受講者ビューに切替 → `/learner/home`（または既定の受講者トップ）が表示される
- [ ] 受講者から `/learner/skills/courses` でフィルタ・カード操作ができる
- [ ] prod 動画の主要ステップが、プロトタイプ上で「だいたい同じ順序」でたどれる（完全一致は不要）
- [ ] Miro の優先メダル「1」相当（公開管理・ライブラリ・コース一覧・シームレス）がフェーズ 2〜3 でカバーされている

---

## マスター仕様との対応

| ドキュメント | 役割 |
|--------------|------|
| [00-REBUILD-SPECIFICATION.md](./00-REBUILD-SPECIFICATION.md) | 全体・ルート一覧（要同期） |
| [04-PAGES-AND-FEATURES.md](./04-PAGES-AND-FEATURES.md) | ページ別仕様（要同期） |
| [05-MOCK-DATA-SCHEMA.md](./05-MOCK-DATA-SCHEMA.md) | 型とモックデータ |
| 本ファイル **DEVELOPMENT-PROGRESS.md** | **進捗・実装順の唯一のチェックリスト（運用）** |

新しいタスクが増えたら、**フェーズに合う位置**に ID を振って行を追加してください（ID は飛び番でも構いません）。
