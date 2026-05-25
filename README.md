# Vehicle Planner (次世代車両コンセプトジェネレーター)

Vehicle Plannerは、生成AIを活用してプロフェッショナルレベルの自動車商品企画書（コンセプト）を自律的に生成するWebアプリケーションです。

## 特徴 (Features)
- **10-Layer Architecture**: マクロ分析（PEST/3C）からデザイン思考（インサイト抽出・アイデア創出）に至るまで、トップコンサルタントとトップデザイナーの思考プロセスを10段階のレイヤーでエミュレートします。
- **Dynamic OSINT Research**: ユーザーが入力した条件（セグメント、パワートレイン等）に基づき、AI自身がGoogle検索を実行。最新の技術動向や競合情報をリアルタイムに収集して企画に反映します。
- **Glassmorphism UI**: 「近未来」をテーマにした、洗練されたライトモードUI。
- **Secure by Design**: XSS防御（`rehype-sanitize`）やAPIキー管理など、堅牢なセキュリティアーキテクチャを採用しています。

## 🧠 AIアーキテクチャの全貌
当プロジェクトで構築された「究極のAIプロンプト」と、マルチエージェントによる開発の歴史については、以下のドキュメントをご参照ください。
👉 [AI Architecture & Prompt Engineering (docs/AI_ARCHITECTURE.md)](./docs/AI_ARCHITECTURE.md)

## 開発環境のセットアップ (Getting Started)

### 前提条件
- Node.js (v18以上推奨)
- Google Gemini API Key

### インストールと起動
```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### 使い方
1. ブラウザで `http://localhost:5173` にアクセスします。
2. 初回起動時にGemini APIキーを入力して保存します（キーはローカルブラウザ内に保存されます）。
3. 自社ブランド、セグメント、ボディ形状、パワートレインを入力し、「コンセプトを生成」ボタンを押します。
4. AIが10段階の思考プロセスを経て、究極のコンセプト企画書を出力します。
