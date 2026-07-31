# Deployment Guide

## 概要

VOLCANE は Hexo を使って `source/` から `public/` を生成し、Cloudflare Pages の `volcane` プロジェクトへ Wrangler CLI で直接アップロードします。

現在のサイトは、旧静的HTMLを完全再現するために `skip_render` を使っています。Markdown/EJSテンプレートをレンダリングする運用ではなく、`source/*.html`、`source/tools/*.html`、`source/styles/*.css`、`source/public/*` をほぼそのまま `public/` へコピーする構成です。

## 公開先

- Production URL: `https://volcane.pages.dev/`
- Cloudflare Pages project: `volcane`
- Deploy method: Wrangler Direct Upload
- Deploy target directory: `public/`

## 前提

Node.js と npm が利用できること。

依存関係が未インストールの場合:

```bash
npm install
```

Wrangler にログインしていない場合:

```bash
npx wrangler login
```

Wrangler のバージョン確認:

```bash
npx wrangler --version
```

## デプロイ手順

プロジェクトルートで実行します。

```bash
npm run clean
npm run build
npx wrangler pages deploy public --project-name volcane
```

`wrangler pages deploy` が成功すると、以下のようなプレビューURLが表示されます。

```text
https://<deployment-id>.volcane.pages.dev
```

その後、Production URL の `https://volcane.pages.dev/` にも反映されます。

## ローカル確認

デプロイ前にローカルで確認する場合:

```bash
npm run clean
npm run build
npm run server
```

通常は以下で確認できます。

```text
http://localhost:4000/
```

代表的な確認URL:

- `http://localhost:4000/`
- `http://localhost:4000/background-remover.html`
- `http://localhost:4000/tools/background-remover.html`
- `http://localhost:4000/styles/style.css`
- `http://localhost:4000/public/hero-bg.png`

## デプロイ後の確認

本番反映後、最低限以下を確認します。

```bash
curl -I https://volcane.pages.dev/
curl -I https://volcane.pages.dev/background-remover
curl -I https://volcane.pages.dev/tools/background-remover
curl -I https://volcane.pages.dev/styles/style.css
```

PowerShell の場合:

```powershell
(Invoke-WebRequest -Uri 'https://volcane.pages.dev/' -UseBasicParsing -TimeoutSec 30).StatusCode
(Invoke-WebRequest -Uri 'https://volcane.pages.dev/background-remover' -UseBasicParsing -TimeoutSec 30).StatusCode
(Invoke-WebRequest -Uri 'https://volcane.pages.dev/tools/background-remover' -UseBasicParsing -TimeoutSec 30).StatusCode
(Invoke-WebRequest -Uri 'https://volcane.pages.dev/styles/style.css' -UseBasicParsing -TimeoutSec 30).StatusCode
```

期待値はいずれも `200` です。

## URLに関する注意

Cloudflare Pages 側の挙動により、`.html` 付きURLが拡張子なしURLへ `308 Permanent Redirect` される場合があります。

例:

```text
https://volcane.pages.dev/background-remover.html
  -> https://volcane.pages.dev/background-remover

https://volcane.pages.dev/tools/background-remover.html
  -> https://volcane.pages.dev/tools/background-remover
```

これは異常ではありません。最終的に拡張子なしURLで `200` が返れば正常です。

## npm scriptsについて

`package.json` の主なスクリプト:

```json
{
  "clean": "hexo clean",
  "build": "hexo generate",
  "server": "hexo server",
  "deploy": "hexo deploy"
}
```

注意: 現在の `_config.yml` では Hexo の `deploy.type` が空です。そのため、`npm run deploy` は本番デプロイ手順として使いません。

本番デプロイは必ず次を使います。

```bash
npx wrangler pages deploy public --project-name volcane
```

## 生成物とデプロイ対象

`public/` はビルド生成物です。

- Git管理や手作業編集の対象ではありません。
- `npm run clean` で削除されます。
- `npm run build` で再生成されます。
- Cloudflare Pages へアップロードする対象です。

`legacy/` は復元元バックアップです。デプロイ対象ではありません。

## よくあるトラブル

### Wrangler が認証エラーになる

再ログインします。

```bash
npx wrangler login
```

### `public/` に変更が反映されない

キャッシュを消して再生成します。

```bash
npm run clean
npm run build
```

### `npm run deploy` でデプロイできない

現行運用では使いません。Wrangler の直接アップロードを使います。

```bash
npx wrangler pages deploy public --project-name volcane
```

### `.html`付きURLで `308` が返る

Cloudflare Pages のリダイレクト挙動です。拡張子なしURLへアクセスし、`200` が返ることを確認してください。

## 運用ルール

- ページを変更したら、必ず `npm run clean` と `npm run build` を実行する。
- デプロイ前にトップページ、代表的なツールページ、CSS、画像アセットを確認する。
- `source/public/` と `source/styles/` は旧HTMLが参照している本番用アセットなので削除しない。
- 完全再現を維持する間は `_config.yml` の `skip_render` を外さない。
- Cloudflare Pages へは `public/` の中身だけをアップロードする。
