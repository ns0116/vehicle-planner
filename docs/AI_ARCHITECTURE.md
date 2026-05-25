# Vehicle Planner: AI Architecture & Prompt Engineering

このドキュメントは、当アプリケーションの心臓部である「AIコンセプトジェネレーター」の思考プロセス（10-Layer Architecture）と、それを構築した際のマルチエージェント・オーケストレーションの歴史を記録したものです。

## 🧠 The 10-Layer Thought Architecture

単なるChatGPTのラッパーアプリからの脱却を図り、プロフェッショナルな商品企画職と同等の深さで思考させるため、AIの推論プロセスを**10のレイヤー（階層）**に分割し、直列で実行させるアーキテクチャを採用しています。

前半（Layer 1〜5, 7）は**トップコンサルタント（マーケティング）**の視点で徹底的なPEST/3C分析を行い、後半（Layer 6, 8〜10）は**世界最高峰のデザインファーム（デザイン思考）**の視点で非常識なインサイトとアイデアを生み出します。

### 📊 フェーズ1：戦略的環境分析（PEST & 3C）
*Designed by: Marketing Expert Subagent*

* **Layer 1: 市場調査 (Market Research)**
  * グローバル市場構造を解剖し、TAM/SAM/SOMおよびCAGRを定量的に評価。マクロ経済動向、購買力シフトから市場の真の成長ドライバーと潜在的リスクを洞察。
* **Layer 2: 法規制調査 (Regulation Research)**
  * 環境規制、安全基準、地政学的リスクを「ルール形成による競争優位（Regulatory Moat）」や「参入障壁」という戦略的変数として評価。
* **Layer 3: 技術動向調査 (Tech Trends) - 🔍 Dynamic Web Search**
  * 指定のセグメント・パワートレインに対しリアルタイム検索を実行。技術のSカーブ、破壊的イノベーション（全固体電池、ギガキャスト等）を捉え、数年先の競争前提を定義。
* **Layer 4: ユーザー調査 (Persona Setup)**
  * ペインポイント、真のJobs-to-be-Done（片付けるべき用事）、Willingness to Pay（支払意欲）を冷徹に分析し、Unmet Needsを特定。
* **Layer 5: 競合調査 (Competitor Research) - 🔍 Dynamic Web Search**
  * 実際の競合他社を検索し、バリューチェーン、技術ポートフォリオ、戦略的意図をリバースエンジニアリング。自社の脅威となるKFSの差分を浮き彫りにする。
* **Layer 7: 自社アセット・ブランド分析 (Company Analysis)**
  * VRIOフレームワークを用い、自社ブランドのコア・コンピタンスを評価。他社が構造的に追随できない『勝つための必然性（Right to Win）』と『強固な経済的堀（Moat）』を定義。

### 🎨 フェーズ2：人間中心設計とコンセプト創造（Design Thinking）
*Designed by: Design Thinking Expert Subagent*

* **Layer 6: ディープ・エンパシーと摩擦の発見 (Empathize)**
  * 表面的なクレームを排し、ユーザー自身も言語化できていない「無意識の妥協」や「涙ぐましい工夫」に深く潜り込み、根源的なペインをえぐり出す。
* **Layer 8: プロファウンド・インサイトの抽出 (Define)**
  * 自動車業界が長年「仕方のないトレードオフ」として放置してきた構造的限界と、ペルソナが渇望する本質的価値との間の深い溝（Insight）を鋭利な言葉で言語化。
* **Layer 9: ラディカル・コンセプトの飛躍 (Ideate)**
  * 漸進的な改善を破棄。別領域のパラダイムを衝突させ、既存の競合車両を完全に陳腐化させる「非常識かつ心躍るモビリティのビジョン」を打ち立てる。
* **Layer 10: 究極のUXとアーキテクチャの定義 (Prototype)**
  * コンセプトが実現した世界での「魔法のような瞬間（Magic Moments）」を描写し、それを実現するための必須要件（パッケージング、技術）を定義する。

---

## 🤖 マルチエージェント・オーケストレーションの歴史

このアーキテクチャは、メインAI（Antigravity）が「CTO」として全体指揮を執り、以下の専門サブエージェント（部下）たちをバックグラウンドで並列稼働（オーケストレーション）させることで構築されました。

1. **Refactoring Engineer (`refactoring_engineer`)**
   * モノリシックだった `App.jsx` をリファクタリングし、`InputForm.jsx` や `ProgressTracker.jsx` などのコンポーネントに分割。
2. **UI/UX CSS Designer (`ui_designer`)**
   * 「近未来のライトモード」というビジョンに基づき、Glassmorphismを用いた流麗で洗練されたCSSデザインを実装。
3. **Super Web Researcher (`super_researcher`)**
   * 世界中のWebを絨毯爆撃し、SDV、自動運転、次世代バッテリー、ギガキャストに関するOSINTデータをJSON形式で収集。
4. **Security Auditor (`security_auditor`)**
   * 完成したコードを監査し、「AIが読み込んだHTMLによるXSSの危険性」という重大な脆弱性を発見。`rehype-sanitize` の導入と `sessionStorage` （後に利便性のため `localStorage` ＋完全サニタイズへ移行）への変更を主導。
5. **Marketing Expert & Design Thinking Expert**
   * 上記の10レイヤーのプロンプトを、MBBレベルのビジネス用語とIDEOレベルのクリエイティビティで極限まで高度化。

これにより、Vehicle Plannerは単なるツールを超えた「AIと人間の協働によるプロフェッショナル企画システム」へと進化しました。
