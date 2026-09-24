# vehicle-planner — Claude Context

生成AIで自動車の商品企画書（コンセプト）を自律生成するWebアプリ。12段階レイヤー（PEST/3C分析〜デザイン思考〜自己批判による再構築）でプロの企画プロセスをエミュレートする。詳細は [`docs/AI_ARCHITECTURE.md`](docs/AI_ARCHITECTURE.md) を参照。

## スタック

- Node.js (v18+) / フロントエンド中心。Google Gemini API を利用
- 可視化: `recharts`（レーダーチャート等）
- XSS対策: `rehype-sanitize`

## 実行

```bash
npm install
npm run dev   # README参照。詳細な起動コマンドはpackage.jsonを確認
```

## デザイン・企画スタイルの好み

個人の企画・デザインスタイルの好みは `CLAUDE.local.md`（非公開・gitignore対象）を参照。存在しない環境（フォーク・クラウドセッション等）では、このセクションの好みは前提とせず、一般的なベストプラクティスに従うこと。
