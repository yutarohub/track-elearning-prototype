# エージェント用プロンプト — Track Hub プロトタイプ開発

このドキュメントは、AIエージェント（Cursor Agent 等）に Track Hub プロトタイプを一から開発させるための指示プロンプトです。このフォルダをワークスペースとして開き、以下の指示をエージェントに渡して実行してください。

---

## 指示プロンプト（コピーして使用）

```
このワークスペースで、Track e-learning の eラーニング統合ダッシュボード「Track Hub」のフロントエンドプロトタイプを一から開発してください。

## 必須参照ドキュメント

- **sytem-documentions/00-REBUILD-SPECIFICATION.md** を最初に読み、ドキュメント一覧・フォルダ構成・ルート一覧・起動方法・再構築の推奨順序を把握すること。
- その後、**01 → 02 → 03 → 05 → 04** の順で sytem-documentions 内の各仕様書に従い実装すること。
- **sytem-documentions/Track e-learning Admin Dashboard UI.md** で管理画面のコンポーネントツリーとスタイル指示を確認すること。
- **sytem-documentions/Track e-learning Self-Learning Workspace UI Prototype.md** は受講者ワークスペースのUX要件（現状は Coming Soon でよい）。

## 技術スタック

- Next.js 16 (App Router)、React 19、TypeScript、Tailwind CSS 4、lucide-react、recharts。
- パスエイリアスは `@/*` → `./src/*` とすること。

## 実装順序

1. **01-TECHNICAL-STACK-AND-CONFIG.md** に従い、package.json（scripts / dependencies / devDependencies）、next.config.ts（turbopack.root）、tsconfig.json（paths）、Tailwind/globals.css、ルート layout（AuthProvider・Inter フォント・metadata）を用意する。
2. **02-AUTH-AND-ROUTING.md** に従い、AuthContext（型・状態・localStorage・login/logout・setView・開発時デモユーザー）、ルート `/` のクライアントリダイレクト（/login）、ログイン画面（フォーム・エラー・アクセシビリティ）を実装する。
3. **03-LAYOUT-AND-COMPONENTS.md** に従い、AppLayout（スキップリンク・Sidebar・Header・main）、Sidebar（ナビ項目・Workspace・フッター）、Header（ビュー切替・通知・設定・アカウント）、globals.css の .skip-link を実装する。
4. **05-MOCK-DATA-SCHEMA.md** に従い、src/lib/mockData.ts に型（Course, Badge, Material 等）と MOCK_COURSES / MOCK_BADGES / MOCK_MATERIALS を定義する。
5. **04-PAGES-AND-FEATURES.md** に従い、以下のページを順に実装する。いずれも AppLayout でラップすること。
   - /admin/dashboard（KPI カード・グラフ・コース一覧・詳細パネル・フィルタ）
   - /admin/courses（検索・フィルタ・テーブル・ProgressIndicator・ページネーション）
   - /admin/publish（ワンストップボタン・公開済み一覧・3ステップウィザードモーダル）
   - /admin/library（マテリアル一覧・検索・種別フィルタ）
   - /admin/badges（バッジ一覧）
   - /learner/workspace（Coming Soon プレースホルダー・管理者に戻るボタン）

## スタイル・UX

- 管理画面メインは白・スレート基調（bg-slate-50）。サイドバー・ログインはダークネイビー #0f1629、アクセントは indigo / violet グラデーション。
- バッジ・ボタン・角丸は 03 および Track e-learning Admin Dashboard UI.md の指示に従う。ProgressIndicator はプログレスバーと完了数バッジの組み合わせとする。
- アクセシビリティ: フォームの label/id、aria-label、role="alert"、スキップリンクを仕様どおり実装すること。

## 動作確認

- 開発サーバーは `npm run dev`（--hostname 127.0.0.1 --turbopack を推奨）。http://127.0.0.1:3000 でアクセスできること。
- ルート `/` は /login へリダイレクトすること。ログイン（yutaro.iwasaki@givery.co.jp / tracklms）で /admin/courses へ遷移すること。
- 開発時に /admin または /learner に直アクセスした場合は、未ログインでもデモユーザーで表示されること。

## 参照

- ui-screenshots フォルダに参考画像がある場合は、それに近い見た目で実装すること。ない場合は仕様書のみでよい。
```

---

## 使い方

1. このフォルダ（`Track-eleanring -prototype`）を Cursor などでワークスペースとして開く。
2. 上記の「指示プロンプト」ブロック全体をコピーする。
3. エージェント（Chat / Agent）に貼り付けて実行する。
4. 必要に応じて「sytem-documentions の 00 から順に読んで実装して」とだけ伝え、この AGENT-PROMPT-PROTOTYPE-DEVELOPMENT.md を参照させることもできます。

## 注意

- 元のプロジェクトに `ui-screenshots` が存在しなかったため、本フォルダでは空の ui-screenshots と README のみ配置しています。参考にしたい画面キャプチャがある場合は、ui-screenshots に画像を追加してください。
