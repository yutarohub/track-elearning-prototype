# オープンバッジ画像（Gemini 生成・アセット）

`MOCK_BADGES`（`src/lib/mockData.ts`）の `imageSrc` と対応しています。

| ファイル | バッジ名（モック id） |
|----------|------------------------|
| `badge-1-chatgpt-master.png` | ChatGPT マスター (1) |
| `badge-2-google-ai-explorer.png` | Google AI Explorer (2) |
| `badge-3-data-science-intro.png` | データサイエンティスト初級 (3) |
| `badge-4-javascript-dev.png` | JavaScript Developer (4) |
| `badge-5-dx-leader.png` | DX推進リーダー (5) |

## 白背景の透明化

リポジトリで `scripts/make-badge-transparent.mjs` を実行済みです（画像外周の近白を境界から flood-fill で透明化）。  
内側の薄い背景まで抜きたい場合は、Figma / Photoshop / Photopea 等で手動調整してください。

再生成例（元 PNG を置いたあと）:

```bash
node scripts/make-badge-transparent.mjs /path/to/source.png public/badges/badge-N-name.png
```
