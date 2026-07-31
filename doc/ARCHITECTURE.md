# VOLCANE Architecture

## 概要

VOLCANE は Hexo をビルド基盤として使う静的サイトです。

現在の運用では、Markdown や EJS テーマでページを再構成するのではなく、旧静的サイトの HTML/CSS/JS/画像を `source/` 配下に配置し、Hexo の `skip_render` によってそのまま `public/` へコピーします。これは旧サイトのレイアウト、テキスト、スクリプト、URL をできる限り完全再現するための構成です。

公開先は Cloudflare Pages の `volcane` プロジェクトです。

## 現在のディレクトリ構造

```text
/
├─ _config.yml              # Hexo 設定。skip_render で旧HTML/旧アセットをそのまま出力する
├─ package.json             # npm scripts と Hexo 依存関係
├─ package-lock.json        # npm 依存関係のロックファイル
├─ source/                  # 配信元。ここが現在の実質的なサイト本体
│  ├─ index.html            # トップページ
│  ├─ 404.html              # 404ページ
│  ├─ *.html                # 旧サイトの各ページ。ルート直下URL用
│  ├─ tools/                # /tools/ 配下URL用のツールページ複製
│  │  ├─ index.html         # /tools/ の一覧ページ
│  │  ├─ tools-index.html   # 旧URL互換用
│  │  ├─ metadata-eraser.html # metadata-cleaner.html の移行先互換用
│  │  └─ *.html
│  ├─ styles/               # 旧HTMLが参照するCSS。削除不可
│  │  ├─ style.css
│  │  ├─ app-details.css
│  │  ├─ tools.css
│  │  └─ tool-details.css
│  ├─ public/               # 旧HTMLが ../public/ として参照する画像/JS/manifest等。削除不可
│  │  ├─ script.js
│  │  ├─ sidebar.js
│  │  ├─ sw.js
│  │  ├─ manifest.json
│  │  └─ *.png, *.ico, *.txt, *.xml
│  └─ _data/                # 旧Markdown/EJS運用時のデータ。現行HTML配信では基本未使用
├─ legacy/                  # 復元元の旧サイト一式。バックアップ/照合用
│  ├─ html/
│  ├─ styles/
│  └─ public/
├─ themes/volcane/          # 旧Markdown/EJS移行時のテーマ。現行HTML配信では必須ではない
├─ public/                  # Hexoビルド生成物。デプロイ対象。再生成可能
├─ doc/                     # 運用ドキュメント
├─ scaffolds/               # Hexo新規投稿用テンプレート。現行運用ではほぼ未使用
├─ node_modules/            # npm install で復元可能
├─ db.json                  # Hexoキャッシュ。再生成可能
└─ .wrangler/               # Wrangler一時ファイル
```

## ビルドの仕組み

`_config.yml` の `skip_render` が現在の構成の要です。

```yaml
skip_render:
  - '*.html'
  - 'tools/*.html'
  - 'styles/*.css'
  - 'public/*'
```

この設定により、`source/*.html`、`source/tools/*.html`、`source/styles/*.css`、`source/public/*` は Hexo の Markdown/EJS レンダリングを通らず、ファイル内容がそのまま `public/` に出力されます。

そのため、HTML 内のパスも旧サイト互換のまま維持します。

- ルート直下ページ: `../public/...`、`../styles/...` を参照する旧HTMLがそのまま置かれている
- `/tools/` 配下ページ: `../public/...`、`../styles/...` を参照する
- Cloudflare Pages 側では `.html` 付きURLが拡張子なしURLへリダイレクトされる場合がある

## URL構成

現在は互換性を優先し、同じ内容のページが複数のURLで参照できる場合があります。

```text
/                         -> source/index.html
/tools/                   -> source/tools/index.html
/tools/tools-index.html   -> source/tools/tools-index.html
/background-remover       -> source/background-remover.html
/tools/background-remover -> source/tools/background-remover.html
/metadata-cleaner         -> source/metadata-cleaner.html
/tools/metadata-eraser    -> source/tools/metadata-eraser.html
```

トップページ内の旧リンクは `tools-index.html` や各ルート直下ページを参照しているため、ルート直下のHTMLは削除しないでください。`/tools/` 配下の複製は、Hexo移行後の新しいURL互換のために残しています。

## 主要ファイルの役割

- `source/*.html`: 旧サイトの各ページ本体
- `source/tools/*.html`: `/tools/` 配下URLのための複製ページ
- `source/styles/style.css`: トップページとアプリ詳細ページの基本スタイル
- `source/styles/app-details.css`: アプリ詳細ページ用スタイル
- `source/styles/tools.css`: ツール一覧系ページ用スタイル
- `source/styles/tool-details.css`: 個別ツールページ用スタイル
- `source/public/sidebar.js`: ツールページのサイドバー生成
- `source/public/script.js`: トップページなどの共通挙動
- `source/public/sw.js`: Service Worker
- `legacy/`: 復元元の原本。差分確認や再復元に使う

## 通常の更新手順

### ページ本文やレイアウトを変更する

1. 対象の `source/*.html` または `source/tools/*.html` を編集します。
2. 同じページをルート直下と `/tools/` 配下の両方で公開している場合は、両方を同じ内容に更新します。
3. HTML内の参照パスは既存形式に合わせます。
4. `npm run clean` と `npm run build` を実行します。
5. ローカルで表示確認します。

### CSSを変更する

1. `source/styles/` 内のCSSを編集します。
2. 旧バックアップとして残したい場合は、対応する `legacy/styles/` との差分を把握しておきます。
3. `npm run build` を実行し、`public/styles/` に反映されることを確認します。

### 画像やJSを変更する

1. `source/public/` 内のファイルを更新します。
2. HTMLが `../public/...` を参照しているため、ファイル名変更は慎重に行います。
3. 必要に応じてルート直下ページと `/tools/` 配下ページの参照を同時に更新します。

## ビルドと確認

```bash
npm run clean
npm run build
npm run server
```

ローカルサーバーは通常 `http://localhost:4000/` で起動します。

代表的な確認対象:

- `http://localhost:4000/`
- `http://localhost:4000/background-remover.html`
- `http://localhost:4000/tools/background-remover.html`
- `http://localhost:4000/styles/style.css`
- `http://localhost:4000/public/hero-bg.png`

## デプロイ

Cloudflare Pages へ直接アップロードします。

```bash
npm run clean
npm run build
npx wrangler pages deploy public --project-name volcane
```

公開URL:

- Production: `https://volcane.pages.dev/`
- Wrangler が出力するプレビューURL: `https://<deployment-id>.volcane.pages.dev/`

## 削除してよいもの / 残すべきもの

### 再生成可能

- `public/`
- `db.json`
- `node_modules/`
- `.wrangler/tmp/`

### 現行配信に必須

- `source/*.html`
- `source/tools/*.html`
- `source/styles/`
- `source/public/`
- `_config.yml`
- `package.json`
- `package-lock.json`

### バックアップとして残すもの

- `legacy/`

旧サイトの復元元です。今回の完全再現状態を保つ間は削除しない方が安全です。

### 不要候補

- `_config.landscape.yml`: 0バイトのため不要
- `scaffolds/`: `hexo new` を使わない限り不要
- `source/_data/`: 現行の静的HTMLコピー運用では基本未使用
- `themes/volcane/`: 現行配信では必須ではない。ただし削除する場合は `_config.yml` の `theme: volcane` を `theme: false` に変更してからビルド確認する

## 今後の運用方針

当面は「旧HTMLを正として、Hexoは静的ファイルのビルド/デプロイ基盤として使う」方針です。

Markdown/EJSテーマ運用へ戻す場合は、以下を別作業として計画してください。

1. `source/*.html` の内容をMarkdownまたはEJSテンプレートへ再分解する
2. `themes/volcane/` のレイアウトとCSSを現行デザインに合わせて再整備する
3. URL互換を保つためのリダイレクトまたは複製ページ方針を決める
4. `skip_render` を段階的に外して、生成結果を旧HTMLと比較する

完全再現が優先される間は、`skip_render` を外さないでください。
