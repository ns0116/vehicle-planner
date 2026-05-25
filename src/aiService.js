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
  "Layer 1: 市場調査 (Market Research)\n指定されたセグメント・ボディタイプのグローバル市場における成長性、販売トレンド、主要ターゲット層の人口動態を分析。",
  "Layer 2: 法規制調査 (Regulation Research)\n対象市場における環境規制（排出ガス、燃費）、安全基準、インフラ整備状況（充電網など）の最新動向を整理。",
  "Layer 3: 技術動向調査 (Tech Trends)\n自動運転、電動化、コネクテッドなど、数年後の市場の前提となるマクロな技術トレンドを分析。",
  "Layer 4: ユーザー調査 (Persona Setup)\n主要な顧客層とライフスタイルを分析し、解像度の高いペルソナを設定。",
  "Layer 5: 競合調査 (Competitor Research)\nベンチマークとなる代表的な既存車種の特徴とスペックを分析。",
  "Layer 6: VoC調査 (Voice of Customer)\nユーザーの生の声や不満点（NVH、居住性、操作性など）を抽出。",
  "Layer 7: 自社アセット・ブランド分析 (Company Analysis)\n指定された自社ブランド（OEM）が持つ歴史的資産、コア技術、ブランドイメージを分析し、今回のセグメントにおいて他社には真似できない『自社ならではの強み（Right to Win）』を定義。",
  "Layer 8: インサイト考察 (Insight Extraction)\nマクロ環境と自社の強みを踏まえ、ペルソナが本当に求めている「本質的な価値」と、既存車両が抱える「構造的な妥協点」を深く言語化。",
  "Layer 9: 目標コンセプト立案 (Ideation)\n抽出されたインサイトと『自社の強み』を掛け合わせ、競合には絶対に真似できない「飛躍したコンセプトアイデア」を3案提示。",
  "Layer 10: コンセプトの具体化 (Concept Definition)\n3案のうち最も革新的かつ自社ブランドのコア価値を体現する1案を選定し、以下のフォーマットで詳細を定義。\n- コアコンセプト: （一行定義）\n- ハードウェア構成: （システム出力、モーター/バッテリー配置、駆動方式、サスペンション形式、パッケージングの特長）\n- 必要技術と自社の勝ち筋: （クリアすべき最大の技術的ハードルと、なぜ自社ならそれを解決できるのか）"
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
