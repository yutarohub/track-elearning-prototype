# 本番URLで公開する手順（Vercel）

このプロジェクトは本番ビルド済みです。以下の手順で Vercel にデプロイすると、本番URLでアクセスできます。

## 1. Vercel にログイン

ターミナルで次を実行し、ブラウザでログインします。

```bash
npx vercel login
```

## 2. プロジェクトフォルダでデプロイ

クローンした本リポジトリのルートに移動してから実行します。

```bash
cd /path/to/track-elearning-prototype
npx vercel --prod
```

初回はプロジェクト名や設定の質問が出ます。そのまま Enter で進めて問題ありません。

## 3. 本番URLの確認

デプロイが終わると、次のようなURLが表示されます。

```
Production: https://track-hub-xxxx.vercel.app
```

このURLをブラウザで開くと、本番環境のアプリが表示されます。

---

**補足**

- プレビューのみデプロイする場合: `npx vercel`（`--prod` なし）
- GitHub と連携している場合は、リポジトリを Vercel にインポートすると push のたびに自動デプロイされます
