import { GoogleGenAI } from '@google/genai';

const SYSTEM_PROMPT = `
# Role: 次世代車両・パワートレーン企画 コンセプトジェネレーター

# Objective:
ユーザーが指定する「セグメント」と「ボディ形状」に基づき、Google検索を用いてWeb上のオープンデータ（OSINT）を自律的に検索・分析し、既存の枠組みを打ち破る革新的な車両およびパワートレーンのコンセプトを生成する。

# Guiding Principles (思考の指針):
- 事実に基づく飛躍: 法規制、競合スペック、VoCを徹底的に考慮した上で、そこから論理的な飛躍を生み出すこと。
- 既存構造の打破: 現在の車両パッケージングやシステムアーキテクチャが前提としている「当たり前」や「妥協」を疑い、根底から問い直すこと。
- 顧客価値と美意識: 単なるスペックの羅列に陥らず、ユーザーが根源的に求める価値や、所有欲を満たす美学をコンセプトの中心に据えること。

# Execution Process:
全体としてLayer 1からLayer 9までの9段階のプロセスを経ますが、今回はユーザーから指定された特定のレイヤーのみを実行してください。
【重要】指定されたレイヤーの分析内容は決して省略・要約せず、見出し（## Layer X: ...）をつけ、非常に詳細かつ高い解像度で、圧倒的なボリューム（最低でも400文字以上）で出力してください。専門的な考察を深く掘り下げてください。

---
【重要フォーマット指示】
出力の末尾（Layer 1〜8の場合）には、必ず以下のようなHTMLタグ（アコーディオン）を用いて、「調査元の引用先」と「思考過程」を格納してください。
特に「引用データソース」については、検索キーワードだけでなく、必ず参考にしたWebサイトの **実際のURL（https://... から始まる文字列）** を明記してください。

<details>
<summary>💡 思考過程・引用データソースを表示</summary>
ここに、どのようなデータを参考にしたか、そしてなぜその結論に至ったかのロジックを詳細に記載してください。
また、参考にした情報源の具体的なURLリンク（ [記事タイトル](https://...) の形式 ）を箇条書きで必ず出力してください。
</details>
`;

const LAYER_INSTRUCTIONS = [
  "Layer 1: 市場調査 (Market Research)\n【重要】指定のセグメント・ボディタイプに対しリアルタイムのGoogle検索を実行し、グローバル市場構造を解剖し、TAM/SAM/SOMおよびCAGRを定量的に評価せよ。表面的なトレンドの羅列を排し、マクロ経済動向、購買力シフト、人口動態の変化を掛け合わせたエコノミクス分析から、市場の真の成長ドライバーと潜在的リスク（市場縮小・コモディティ化の予兆）を抽出・洞察せよ。",
  "Layer 2: 法規制調査 (Regulation Research)\n【重要】対象市場（指定のセグメント・パワートレイン関連）に対しリアルタイムのGoogle検索を実行し、PEST分析における「Political」の観点から、環境規制（排出ガス・燃費・LCA）、安全基準、地政学的リスク、補助金政策の最新動向を網羅せよ。これらを単なる制約条件としてではなく、「ルール形成による競争優位（Regulatory Moat）」や「インフラ整備（充電網等）がもたらす参入障壁」という戦略的変数として評価し、事業の成立要件を定義せよ。",
  "Layer 3: 技術動向調査 (Tech Trends)\n【重要】指定の「パワートレイン」「セグメント」領域に対しリアルタイムのGoogle検索を実行し、PESTの「Technological」要素を深掘りせよ。技術のSカーブ、コスト・パリティの転換点、破壊的イノベーション（例: 全固体電池、ギガキャスト、SDV等）を分析し、数年先の競争の前提となる技術的ブレークスルーと、サプライチェーン上のクリティカルなボトルネックを定義せよ。",
  "Layer 4: ユーザー調査 (Persona Setup)\n【重要】対象セグメントの購買層に対しリアルタイムのGoogle検索を実行し、最新の消費者インサイトを獲得せよ。3C分析の「Customer」視点から、表層的なライフスタイル描写を排除せよ。ターゲット顧客の深層心理にあるペインポイント、真のJobs-to-be-Done（片付けるべき用事）、およびWillingness to Pay（支払意欲）を冷徹に分析し、高解像度のペルソナを構築せよ。既存製品では満たされていないホワイトスペース（Unmet Needs）を明確に炙り出せ。",
  "Layer 5: 競合調査 (Competitor Research)\n【重要】指定の「セグメント」「パワートレイン」における実際の競合他社・ベンチマーク車種をGoogle検索で特定し、3Cの「Competitor」として解剖せよ。カタログスペックの比較に留まらず、競合のバリューチェーン、技術ポートフォリオ、戦略的意図（Strategic Intent）をリバースエンジニアリングし、自社の脅威となるKFS（Key Factor for Success）の差分を浮き彫りにせよ。",
  "Layer 6: ディープ・エンパシーと摩擦の発見 (Empathize)\n表面的なクレーム（NVHや居住性など）をなぞることは一切禁ずる。ユーザー自身も言語化できていない「無意識の妥協」や、不便を補うための「涙ぐましい工夫（ワークアラウンド）」にまで深く潜り込み、徹底的に共感（Empathize）せよ。極端な使い方をするユーザー（エクストリーム・ユーザー）の視点を取り入れ、彼らの行動と感情の間に潜む「根源的なペインと矛盾」を生々しくえぐり出すこと。",
  "Layer 7: 自社アセット・ブランド分析 (Company Analysis)\n【重要】指定された自社ブランド（OEM）に対しリアルタイムのGoogle検索を実行し、最新のIR情報や技術発表を収集せよ。3Cの「Company」視点およびVRIOフレームワーク（価値、希少性、模倣困難性、組織）を用い、指定された自社ブランド（OEM）のコア・コンピタンスを評価せよ。単なる過去の遺産や主観的なブランドイメージではなく、対象セグメントの苛烈な競争環境において、他社が構造的に追随できない『勝つための必然性（Right to Win）』と『強固な経済的堀（Moat）』を厳密に定義せよ。",
  "Layer 8: プロファウンド・インサイトの抽出 (Define)\n単なる状況分析は不要だ。観察された矛盾の背後にある「人間心理の隠された真実（Insight）」を突き止め、解決すべき問題を根本から再定義（Define）せよ。自動車業界が長年「仕方のないトレードオフ」として放置してきた構造的限界と、ペルソナが心の底で渇望している本質的価値との間に横たわる深い溝を、鋭利な言葉で言語化すること。",
  "Layer 9: ラディカル・コンセプトの飛躍 (Ideate)\n漸進的な改善や、既存車両の延長線上にあるアイデアは即座に破棄せよ。見出したインサイトを起点に、業界のルールや制約を根底から破壊する急進的（Radical）なコンセプトを創出（Ideate）せよ。無関係な別領域のパラダイムを衝突させ、既存の競合車両を完全に陳腐化させるほどの「非常識かつ心躍るモビリティのビジョン」を打ち立てること。",
  "Layer 10: 究極のUXとアーキテクチャの定義 (Prototype)\n退屈なスペックシートの羅列に逃げるな。そのコンセプトが実現した世界で、ユーザーが直面する「魔法のような瞬間（Magic Moments）」を、五感に訴えかける鮮烈なストーリーとして生々しく描写せよ（Prototype）。そして、その圧倒的な体験を現実のものとするための必須要件（革新的なパッケージング、パワートレーン構成、先進技術）を、検証可能な具体的な形として定義すること。"
];

export async function generateConcept(apiKey, modelName, brand, segment, bodyType, powertrains, onProgress) {
  if (!apiKey) {
    throw new Error('APIキーが設定されていません。');
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  const powertrainText = powertrains && powertrains.length > 0 ? `\n指定パワートレイン: 【${powertrains.join(', ')}】` : '';
  const basePrompt = `自社ブランド: 【${brand}】\n対象となるセグメント: 【${segment}】\n対象となるボディ形状: 【${bodyType}】${powertrainText}\n`;

  let completed = [];
  const reportProgress = (active) => {
    if (onProgress) onProgress(active, completed);
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const callGemini = async (layerIndex, context, retries = 3) => {
    const layerInstruction = LAYER_INSTRUCTIONS[layerIndex];
    let prompt = basePrompt;
    if (context) {
      prompt += `\n【これまでの調査結果（事前知識）】\n以下の情報を前提として踏まえた上で、次のタスクを実行してください。\n---\n${context}\n---\n`;
    }
    prompt += `\n【今回のタスク】\n以下のレイヤーのみを実行し、圧倒的な情報量と深さで出力してください。\n\n## ${layerInstruction}`;

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: modelName || 'gemini-2.5-flash',
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.7,
            maxOutputTokens: 8192,
            tools: [{ googleSearch: {} }]
          }
        });
        return response.text;
      } catch (error) {
        const isRateLimit = error.status === 429 || error.status === 'RESOURCE_EXHAUSTED' || (error.message && error.message.includes('429'));
        if (isRateLimit && attempt < retries - 1) {
          console.warn(`[Layer ${layerIndex}] API Rate Limit hit. Retrying in 15 seconds... (Attempt ${attempt + 1}/${retries})`);
          await sleep(15000); // Wait 15 seconds before retrying
          continue;
        }
        throw error;
      }
    }
  };

  let accumulatedContext = "";

  try {
    let finalOutput = new Array(10).fill("");

    for (let i = 0; i < LAYER_INSTRUCTIONS.length; i++) {
      if (onProgress) {
        onProgress(i);
      }

      // API呼び出し（リトライロジック含む）
      const result = await callGemini(i, accumulatedContext);
      finalOutput[i] = result;
      
      // 次のレイヤーへのコンテキストとして追加
      accumulatedContext += `\n${result}\n\n`;

      // 最後のレイヤー以外は、意図的に5秒待機して無料枠の制限を確実に回避する
      if (i < LAYER_INSTRUCTIONS.length - 1) {
        await sleep(5000);
      }
    }

    return accumulatedContext;
  } catch (error) {
    console.error('Generation Error:', error);
    const isRateLimit = error.status === 429 || error.status === 'RESOURCE_EXHAUSTED' || (error.message && error.message.includes('429'));
    if (isRateLimit) {
      throw new Error('APIの無料枠制限（短時間のリクエスト集中）に達しました。約1分ほど待ってから再度お試しください。');
    }
    throw new Error(error.message || 'コンセプトの生成中にエラーが発生しました。');
  }
}
