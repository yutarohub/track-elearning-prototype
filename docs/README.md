# ドキュメント索引（Track e-learning プロトタイプ）

このリポジトリの**正規の仕様・進捗・調査**は `docs/` 以下に集約しています（旧 `sytem-documentions/` は廃止）。

## 構成

| パス | 内容 |
|------|------|
| [DEVELOPMENT-PROGRESS.md](./DEVELOPMENT-PROGRESS.md) | 実装タスクのチェックリスト（運用の中心） |
| [spec/00-REBUILD-SPECIFICATION.md](./spec/00-REBUILD-SPECIFICATION.md) | 再構築エントリ・ルート一覧・フォルダ構成 |
| [spec/01-TECHNICAL-STACK-AND-CONFIG.md](./spec/01-TECHNICAL-STACK-AND-CONFIG.md) 〜 [05-MOCK-DATA-SCHEMA.md](./spec/05-MOCK-DATA-SCHEMA.md) | 技術・認証・レイアウト・ページ・モック |
| [spec/Track e-learning Admin Dashboard UI.md](./spec/Track%20e-learning%20Admin%20Dashboard%20UI.md) | 管理画面 UI ツリー |
| [spec/Track e-learning Self-Learning Workspace UI Prototype.md](./spec/Track%20e-learning%20Self-Learning%20Workspace%20UI%20Prototype.md) | 受講者ワークスペース UX |
| [research/](./research/) | 経営・LXP・人的資本などの調査メモ（コード非依存） |
| [research/GEMINI-BADGE-DESIGN-PROMPTS.md](./research/GEMINI-BADGE-DESIGN-PROMPTS.md) | Gemini 向けバッジ／クレデンシャル画像プロンプト集 |

## リポジトリ直下

| ファイル | 内容 |
|----------|------|
| [エージェントルール.md](../エージェントルール.md) | **AI エージェント向け運用ルール（必読）** |
| [AGENTS.md](../AGENTS.md) | Cursor 等向け短いエントリ（ルールへのリンク） |
| [AGENT-PROMPT-PROTOTYPE-DEVELOPMENT.md](../AGENT-PROMPT-PROTOTYPE-DEVELOPMENT.md) | ゼロから再現させるときのコピペ用長文プロンプト |
| [DEPLOY.md](../DEPLOY.md) | Vercel デプロイ手順 |
| [ui-screenshots/](../ui-screenshots/) | 参考画像・動画（README 参照） |

## エージェント向け読み順（実装時）

1. ルートの **エージェントルール.md**
2. **docs/spec/00-REBUILD-SPECIFICATION.md**
3. タスクに応じて **01 → 02 → 03 → 05 → 04**（00 に記載の推奨順）
4. 進捗・スコープは **DEVELOPMENT-PROGRESS.md**
