# Frontend

## はじめに

このプロジェクトをローカル環境で動作させるための手順を説明します。

## 使用バージョン
- Node.js: v22.14.0 ([ダウンロード](https://nodejs.org/en/download))
- pnpm: 10.3.0

## セットアップ手順

1. リポジトリをクローン
   ```sh
   git clone <your-repo-url>
   cd <your-repo-folder>
   ```

2. 依存関係をインストール
   ```sh
   pnpm install
   ```

3. `.env` ファイルをルートフォルダーに作成し、以下のように設定
   ```sh
   VITE_API_URL="Your API URL" # (ローカル or AWS のリンク)
   ```

4. 開発サーバーを起動
   ```sh
   pnpm dev
   ```

5. **(任意)** プロジェクトをビルド
   ```sh
   pnpm run build
   ```
