/**
 * HCOSS インセプションデッキ PowerPoint 生成スクリプト
 *
 * テンプレート: docs/template/インセプションデッキ.pptx のスライド構成に準拠
 * データソース: docs/analysis/inception-deck.md, docs/analysis/business_architecture.md
 */
import PptxGenJS from "pptxgenjs";
import { writeFileSync } from "fs";
import { resolve } from "path";

// ── テーマ設定（テンプレートから抽出） ──
const COLORS = {
  black: "000000",
  white: "FFFFFF",
  darkBlue: "333399",
  teal: "009999",
  lightTeal: "BBE0E3",
  paleBlue: "DAEDEF",
  green: "99CC00",
  gray: "808080",
  lightGray: "D0D0D0",
  orange: "FF6600",
  red: "CC3333",
  yellow: "FFCC00",
};

const FONT = {
  title: "Yu Gothic",
  body: "Yu Gothic",
  code: "Courier New",
};

// ── ヘルパー ──
function titleSlideOpts(title, subtitle) {
  return {
    color: COLORS.white,
    fontFace: FONT.title,
    bold: true,
    fontSize: subtitle ? 32 : 40,
  };
}

function addTitle(slide, text) {
  slide.addText(text, {
    x: 0.5,
    y: 0.2,
    w: 9.0,
    h: 1.0,
    fontSize: 28,
    fontFace: FONT.title,
    bold: true,
    color: COLORS.darkBlue,
  });
}

function addSubtitle(slide, text) {
  slide.addText(text, {
    x: 0.5,
    y: 1.1,
    w: 9.0,
    h: 0.5,
    fontSize: 14,
    fontFace: FONT.body,
    color: COLORS.gray,
  });
}

function addBullets(slide, items, opts = {}) {
  const top = opts.y ?? 1.6;
  const textRows = items.map((item) => ({
    text: item,
    options: {
      fontSize: opts.fontSize ?? 14,
      fontFace: FONT.body,
      color: opts.color ?? COLORS.black,
      bullet: { type: "bullet" },
      paraSpaceAfter: 6,
    },
  }));
  slide.addText(textRows, {
    x: opts.x ?? 0.7,
    y: top,
    w: opts.w ?? 8.6,
    h: opts.h ?? 5.5 - (top - 1.0),
    valign: "top",
  });
}

function addTable(slide, header, rows, opts = {}) {
  const top = opts.y ?? 1.8;
  const tableData = [
    header.map((h) => ({
      text: h,
      options: {
        bold: true,
        fontSize: 11,
        fontFace: FONT.body,
        color: COLORS.white,
        fill: { color: COLORS.darkBlue },
        align: "left",
        valign: "middle",
      },
    })),
    ...rows.map((row) =>
      row.map((cell) => ({
        text: cell,
        options: {
          fontSize: 10,
          fontFace: FONT.body,
          color: COLORS.black,
          align: "left",
          valign: "top",
        },
      }))
    ),
  ];
  slide.addTable(tableData, {
    x: opts.x ?? 0.5,
    y: top,
    w: opts.w ?? 9.0,
    colW: opts.colW,
    border: { type: "solid", pt: 0.5, color: COLORS.lightGray },
    rowH: opts.rowH,
    autoPage: false,
  });
}

function addHighlightBox(slide, text, opts = {}) {
  slide.addText(text, {
    x: opts.x ?? 0.5,
    y: opts.y ?? 1.5,
    w: opts.w ?? 9.0,
    h: opts.h ?? 1.0,
    fontSize: opts.fontSize ?? 16,
    fontFace: FONT.body,
    color: COLORS.darkBlue,
    bold: true,
    fill: { color: COLORS.paleBlue },
    align: "center",
    valign: "middle",
  });
}

function addSliderBar(slide, label, level, y) {
  // level: 1-4 (1=MIN, 4=MAX)
  const barX = 3.5;
  const barW = 5.0;
  const segW = barW / 4;

  slide.addText(label, {
    x: 0.5,
    y,
    w: 3.0,
    h: 0.45,
    fontSize: 11,
    fontFace: FONT.body,
    color: COLORS.black,
    valign: "middle",
  });

  for (let i = 0; i < 4; i++) {
    const isFilled = i < level;
    slide.addShape("rect", {
      x: barX + i * segW,
      y: y + 0.05,
      w: segW - 0.05,
      h: 0.35,
      fill: { color: isFilled ? COLORS.darkBlue : COLORS.lightGray },
      line: { color: COLORS.gray, width: 0.5 },
    });
  }

  slide.addText("MIN", {
    x: barX - 0.05,
    y: y + 0.38,
    w: 0.5,
    h: 0.2,
    fontSize: 7,
    fontFace: FONT.body,
    color: COLORS.gray,
  });
  slide.addText("MAX", {
    x: barX + barW - 0.45,
    y: y + 0.38,
    w: 0.5,
    h: 0.2,
    fontSize: 7,
    fontFace: FONT.body,
    color: COLORS.gray,
  });
}

// ── メイン ──
async function main() {
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "SCREEN_4x3", width: 10, height: 7.5 });
  pptx.layout = "SCREEN_4x3";
  pptx.author = "HCOSS Project";
  pptx.title = "HCOSS インセプションデッキ v0.1.0";

  // ───────────────────────────────────────
  // Slide 1: タイトル
  // ───────────────────────────────────────
  {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.darkBlue };
    slide.addText(
      [
        {
          text: "HCOSS",
          options: {
            fontSize: 48,
            fontFace: FONT.title,
            bold: true,
            color: COLORS.white,
            breakLine: true,
          },
        },
        {
          text: "統合業務管理システム",
          options: {
            fontSize: 28,
            fontFace: FONT.title,
            color: COLORS.lightTeal,
            breakLine: true,
          },
        },
        {
          text: "インセプションデッキ",
          options: {
            fontSize: 24,
            fontFace: FONT.title,
            color: COLORS.white,
            breakLine: true,
          },
        },
      ],
      { x: 1.0, y: 1.5, w: 8.0, h: 3.5, align: "center", valign: "middle" }
    );
    slide.addText("ヘルシーカンパニー株式会社", {
      x: 1.0,
      y: 5.5,
      w: 8.0,
      h: 0.5,
      fontSize: 16,
      fontFace: FONT.body,
      color: COLORS.lightTeal,
      align: "center",
    });
    slide.addText("v0.1.0 | 2026-02-27", {
      x: 1.0,
      y: 6.2,
      w: 8.0,
      h: 0.4,
      fontSize: 12,
      fontFace: FONT.body,
      color: COLORS.gray,
      align: "center",
    });
  }

  // ───────────────────────────────────────
  // Slide 2: 我われはなぜここにいるのか
  // ───────────────────────────────────────
  {
    const slide = pptx.addSlide();
    addTitle(slide, "我われはなぜここにいるのか");
    addSubtitle(
      slide,
      "正社員 6 名・パート 10 名の小規模体制で 4 つのショッピングモールを運営する課題"
    );
    addBullets(slide, [
      "受注管理の分散：4 モールからの受注データが統合されておらず、個別処理の非効率が発生",
      "在庫管理の複雑性：自社在庫と Amazon FBA 在庫の二元管理が手作業中心",
      "データ分析の不在：売上・顧客データの分析基盤がなく、データに基づく意思決定ができていない",
      "マーケティング戦略の未整備：効果的なマーケティング施策を立案・実行できていない",
      "コーポレートサイトの活用不足：企業情報・製造所情報の発信が不十分",
    ]);

    addHighlightBox(slide, "小規模組織の手作業の限界が、業務の品質と効率を圧迫している", {
      y: 5.8,
      h: 0.7,
      fontSize: 14,
    });
  }

  // ───────────────────────────────────────
  // Slide 3: エレベーターピッチ
  // ───────────────────────────────────────
  {
    const slide = pptx.addSlide();
    addTitle(slide, "エレベーターピッチ");

    const pitchParts = [
      {
        text: "マルチモール運営を効率化",
        options: {
          fontSize: 14,
          fontFace: FONT.body,
          color: COLORS.darkBlue,
          bold: true,
        },
      },
      {
        text: " したい\n",
        options: { fontSize: 14, fontFace: FONT.body, color: COLORS.black },
      },
      {
        text: "正社員 6 名・パート 10 名の小規模食品加工業者",
        options: {
          fontSize: 14,
          fontFace: FONT.body,
          color: COLORS.darkBlue,
          bold: true,
        },
      },
      {
        text: " 向けの、\n",
        options: { fontSize: 14, fontFace: FONT.body, color: COLORS.black },
      },
      {
        text: "HCOSS（統合業務管理システム）",
        options: {
          fontSize: 14,
          fontFace: FONT.body,
          color: COLORS.darkBlue,
          bold: true,
        },
      },
      {
        text: " というプロダクトは、\n",
        options: { fontSize: 14, fontFace: FONT.body, color: COLORS.black },
      },
      {
        text: "マルチモール統合業務管理システム",
        options: {
          fontSize: 14,
          fontFace: FONT.body,
          color: COLORS.darkBlue,
          bold: true,
        },
      },
      {
        text: " です。\nこれは ",
        options: { fontSize: 14, fontFace: FONT.body, color: COLORS.black },
      },
      {
        text: "4 モールの受注・在庫・出荷を統合管理し、\n食品トレーサビリティを一貫して管理",
        options: {
          fontSize: 14,
          fontFace: FONT.body,
          color: COLORS.darkBlue,
          bold: true,
        },
      },
      {
        text: " ができ、\n",
        options: { fontSize: 14, fontFace: FONT.body, color: COLORS.black },
      },
      {
        text: "各モール個別の手作業管理",
        options: {
          fontSize: 14,
          fontFace: FONT.body,
          color: COLORS.darkBlue,
          bold: true,
        },
      },
      {
        text: " とは違って、\n",
        options: { fontSize: 14, fontFace: FONT.body, color: COLORS.black },
      },
      {
        text: "シンプルで運用負荷の低い統合基盤",
        options: {
          fontSize: 14,
          fontFace: FONT.body,
          color: COLORS.darkBlue,
          bold: true,
        },
      },
      {
        text: " が備わっている。",
        options: { fontSize: 14, fontFace: FONT.body, color: COLORS.black },
      },
    ];

    slide.addText(pitchParts, {
      x: 0.8,
      y: 1.5,
      w: 8.4,
      h: 4.5,
      fill: { color: COLORS.paleBlue },
      valign: "middle",
      paraSpaceAfter: 8,
    });
  }

  // ───────────────────────────────────────
  // Slide 4: どんな価値をもたらすのか？
  // ───────────────────────────────────────
  {
    const slide = pptx.addSlide();
    addTitle(slide, "どんな価値をもたらすのか？");
    addTable(
      slide,
      ["#", "ビジネス目標", "期待される効果"],
      [
        ["1", "マルチモール受注の統合管理", "4 モールの受注を一元管理し、処理時間を短縮"],
        [
          "2",
          "在庫の統合管理",
          "自社在庫と FBA 在庫を統合管理し、在庫切れ・過剰在庫を防止",
        ],
        [
          "3",
          "トレーサビリティの確保",
          "原材料から出荷までの追跡で食品安全基準への対応を強化",
        ],
        [
          "4",
          "データに基づく意思決定",
          "売上・顧客データの分析基盤を構築しマーケティング戦略を立案可能に",
        ],
        [
          "5",
          "業務効率の向上",
          "手作業を削減し、小規模体制でも持続可能な業務運営を実現",
        ],
        [
          "6",
          "顧客満足度の向上",
          "迅速かつ正確な受注・出荷処理により顧客体験を改善",
        ],
      ],
      { colW: [0.4, 3.0, 5.6] }
    );
  }

  // ───────────────────────────────────────
  // Slide 5: やらないことリスト（スコープ）
  // ───────────────────────────────────────
  {
    const slide = pptx.addSlide();
    addTitle(slide, "やらないことリスト");
    addSubtitle(slide, "スコープの範囲");

    // Three columns
    const colW = 2.85;
    const colGap = 0.15;
    const cols = [
      {
        title: "やる（スコープ内）",
        color: COLORS.teal,
        items: [
          "マルチモール受注管理",
          "在庫管理（自社 + FBA）",
          "出荷管理",
          "商品管理",
          "品質管理・トレーサビリティ",
          "調達管理",
          "売上・顧客データ分析",
          "カスタマーサポート管理",
        ],
      },
      {
        title: "やらない（スコープ外）",
        color: COLORS.red,
        items: [
          "財務・会計管理",
          "人事・労務管理",
          "コーポレートサイトの構築",
          "モール API 以外の外部連携",
        ],
      },
      {
        title: "あとで決める",
        color: COLORS.orange,
        items: [
          "外部製造委託管理の範囲",
          "製造所固有記号管理",
          "マーケティング自動化",
        ],
      },
    ];

    cols.forEach((col, i) => {
      const x = 0.5 + i * (colW + colGap);
      slide.addText(col.title, {
        x,
        y: 1.7,
        w: colW,
        h: 0.45,
        fontSize: 13,
        fontFace: FONT.body,
        bold: true,
        color: COLORS.white,
        fill: { color: col.color },
        align: "center",
        valign: "middle",
      });
      const bullets = col.items.map((item) => ({
        text: item,
        options: {
          fontSize: 11,
          fontFace: FONT.body,
          color: COLORS.black,
          bullet: { type: "bullet" },
          paraSpaceAfter: 4,
        },
      }));
      slide.addText(bullets, {
        x,
        y: 2.2,
        w: colW,
        h: 4.8,
        valign: "top",
      });
    });
  }

  // ───────────────────────────────────────
  // Slide 6: 主なステークホルダー
  // ───────────────────────────────────────
  {
    const slide = pptx.addSlide();
    addTitle(slide, "プロジェクトコミュニティ");
    addSubtitle(slide, "主なステークホルダーと関心事");
    addTable(
      slide,
      ["ステークホルダー", "役割", "主な関心事"],
      [
        [
          "経営者",
          "プロジェクトオーナー",
          "投資対効果、業務効率化、売上向上",
        ],
        [
          "販売部門",
          "主要ユーザー",
          "受注・出荷業務の効率化、在庫可視化",
        ],
        [
          "製造部門",
          "ユーザー",
          "在庫引当の正確性、品質管理の効率化",
        ],
        ["顧客", "エンドユーザー", "正確な在庫情報、迅速な配送"],
        [
          "提携製造所",
          "外部パートナー",
          "製造指示の明確化、納品プロセスの効率化",
        ],
        [
          "モール運営会社",
          "プラットフォーム",
          "API 連携の安定性、商品情報の正確性",
        ],
        [
          "配送業者",
          "外部パートナー",
          "出荷情報の正確性、集荷スケジュールの安定",
        ],
      ],
      { y: 1.7, colW: [2.0, 2.2, 4.8] }
    );
  }

  // ───────────────────────────────────────
  // Slide 7: 技術的な解決策の概要
  // ───────────────────────────────────────
  {
    const slide = pptx.addSlide();
    addTitle(slide, "技術的な解決策の概要");

    // Architecture diagram using shapes
    const boxH = 0.5;

    // Mall boxes at top
    const malls = ["楽天市場", "Yahoo!", "Amazon", "au PAY"];
    malls.forEach((name, i) => {
      slide.addShape("rect", {
        x: 0.5 + i * 2.2,
        y: 1.5,
        w: 2.0,
        h: boxH,
        fill: { color: COLORS.lightTeal },
        line: { color: COLORS.teal, width: 1 },
      });
      slide.addText(name, {
        x: 0.5 + i * 2.2,
        y: 1.5,
        w: 2.0,
        h: boxH,
        fontSize: 10,
        fontFace: FONT.body,
        color: COLORS.black,
        align: "center",
        valign: "middle",
      });
    });

    // Arrow label
    slide.addText("API", {
      x: 4.0,
      y: 2.05,
      w: 1.0,
      h: 0.3,
      fontSize: 9,
      fontFace: FONT.body,
      color: COLORS.gray,
      align: "center",
    });

    // HCOSS main box
    slide.addShape("rect", {
      x: 0.5,
      y: 2.5,
      w: 9.0,
      h: 2.8,
      fill: { color: "F8F8FF" },
      line: { color: COLORS.darkBlue, width: 2 },
    });
    slide.addText("HCOSS 統合業務管理システム", {
      x: 0.5,
      y: 2.5,
      w: 9.0,
      h: 0.4,
      fontSize: 12,
      fontFace: FONT.body,
      bold: true,
      color: COLORS.darkBlue,
      align: "center",
    });

    // Internal modules
    const modules = [
      "受注管理",
      "在庫管理",
      "出荷管理",
      "商品管理",
      "品質管理",
      "調達管理",
      "分析",
    ];
    modules.forEach((name, i) => {
      const row = Math.floor(i / 4);
      const col = i % 4;
      slide.addShape("roundRect", {
        x: 0.8 + col * 2.15,
        y: 3.0 + row * 0.7,
        w: 1.95,
        h: 0.55,
        fill: { color: COLORS.darkBlue },
        rectRadius: 0.05,
      });
      slide.addText(name, {
        x: 0.8 + col * 2.15,
        y: 3.0 + row * 0.7,
        w: 1.95,
        h: 0.55,
        fontSize: 10,
        fontFace: FONT.body,
        color: COLORS.white,
        align: "center",
        valign: "middle",
      });
    });

    // External services at bottom
    const extServices = [
      { name: "Amazon FBA", x: 0.5 },
      { name: "配送業者", x: 3.0 },
      { name: "自社工場", x: 5.5 },
      { name: "提携製造所", x: 7.5 },
    ];
    extServices.forEach((svc) => {
      slide.addShape("rect", {
        x: svc.x,
        y: 5.6,
        w: 2.0,
        h: boxH,
        fill: { color: "FFF3E0" },
        line: { color: COLORS.orange, width: 1 },
      });
      slide.addText(svc.name, {
        x: svc.x,
        y: 5.6,
        w: 2.0,
        h: boxH,
        fontSize: 10,
        fontFace: FONT.body,
        color: COLORS.black,
        align: "center",
        valign: "middle",
      });
    });

    // Tech stack note
    slide.addText("技術方針: シンプルで運用負荷の低いシステム / マルチモール統合基盤 / トレーサビリティ対応", {
      x: 0.5,
      y: 6.4,
      w: 9.0,
      h: 0.4,
      fontSize: 10,
      fontFace: FONT.body,
      color: COLORS.gray,
      align: "center",
    });
  }

  // ───────────────────────────────────────
  // Slide 8: 夜も眠れなくなるような問題
  // ───────────────────────────────────────
  {
    const slide = pptx.addSlide();
    addTitle(slide, "夜も眠れなくなるような問題は何だろう？");
    addTable(
      slide,
      ["#", "リスク", "影響度", "対策"],
      [
        [
          "1",
          "モール API の変更・制約",
          "高",
          "アダプタパターンによる API 変更への対応力確保",
        ],
        [
          "2",
          "小規模チームでの開発・運用リソース不足",
          "高",
          "シンプルな設計を最優先。段階的リリース",
        ],
        [
          "3",
          "FBA 在庫と自社在庫の同期ズレ",
          "中",
          "Amazon API での定期的な在庫同期。差異検知アラート",
        ],
        [
          "4",
          "既存業務プロセスとの不整合",
          "中",
          "現場ヒアリングの徹底。段階的な業務移行",
        ],
        [
          "5",
          "食品安全・法令遵守の不備",
          "高",
          "食品衛生法の要件を設計段階から組み込む",
        ],
        [
          "6",
          "データ移行の失敗",
          "中",
          "段階的な移行計画。並行稼動期間の確保",
        ],
      ],
      { colW: [0.4, 3.0, 0.8, 4.8] }
    );
  }

  // ───────────────────────────────────────
  // Slide 9: 俺たちの "A チーム"
  // ───────────────────────────────────────
  {
    const slide = pptx.addSlide();
    addTitle(slide, '俺たちの "A チーム"');
    addTable(
      slide,
      ["役割", "人数", "備考"],
      [
        ["プロジェクトオーナー", "1 名", "経営者が兼務"],
        ["開発者", "1〜2 名", "AI エージェントとの協働開発"],
        [
          "業務担当（販売・製造）",
          "2〜3 名",
          "要件確認・受入テスト",
        ],
      ],
      { y: 1.8, colW: [2.5, 1.5, 5.0] }
    );

    addHighlightBox(
      slide,
      "AI エージェント（Claude Code）との協働開発により、少人数でも高品質な開発を実現",
      { y: 4.0, h: 0.8, fontSize: 14 }
    );
  }

  // ───────────────────────────────────────
  // Slide 10: 期間を見極める
  // ───────────────────────────────────────
  {
    const slide = pptx.addSlide();
    addTitle(slide, "期間を見極める");

    const phases = [
      {
        name: "Phase 1: 分析・設計",
        desc: "要件定義、アーキテクチャ設計、データモデル設計",
        weeks: "2〜3 週間",
        color: COLORS.lightTeal,
      },
      {
        name: "Phase 2: コア機能開発",
        desc: "受注管理、在庫管理、出荷管理、商品管理",
        weeks: "4〜6 週間",
        color: COLORS.teal,
      },
      {
        name: "Phase 3: 品質管理・調達管理",
        desc: "品質管理、調達管理機能の開発",
        weeks: "2〜3 週間",
        color: COLORS.lightTeal,
      },
      {
        name: "Phase 4: 分析・サポート",
        desc: "分析ダッシュボード、カスタマーサポート",
        weeks: "2〜3 週間",
        color: COLORS.teal,
      },
      {
        name: "Phase 5: リリース準備",
        desc: "受入テスト、データ移行、本番稼動",
        weeks: "2〜3 週間",
        color: COLORS.lightTeal,
      },
    ];

    const barStartX = 0.5;
    const barMaxW = 9.0;
    const totalWeeks = 18;
    const phaseWeeks = [3, 6, 3, 3, 3];

    phases.forEach((phase, i) => {
      const y = 1.8 + i * 1.0;
      const startWeek = phaseWeeks.slice(0, i).reduce((a, b) => a + b, 0);
      const x = barStartX + (startWeek / totalWeeks) * barMaxW;
      const w = (phaseWeeks[i] / totalWeeks) * barMaxW;

      slide.addShape("rect", {
        x,
        y,
        w,
        h: 0.45,
        fill: { color: phase.color },
        line: { color: COLORS.teal, width: 1 },
      });
      slide.addText(phase.name, {
        x,
        y,
        w,
        h: 0.45,
        fontSize: 10,
        fontFace: FONT.body,
        bold: true,
        color: COLORS.darkBlue,
        align: "center",
        valign: "middle",
      });
      slide.addText(`${phase.desc}（${phase.weeks}）`, {
        x,
        y: y + 0.45,
        w,
        h: 0.35,
        fontSize: 8,
        fontFace: FONT.body,
        color: COLORS.gray,
        align: "center",
      });
    });

    // MVP marker
    const mvpX =
      barStartX +
      ((phaseWeeks[0] + phaseWeeks[1]) / totalWeeks) * barMaxW;
    slide.addShape("line", {
      x: mvpX,
      y: 1.5,
      w: 0,
      h: 5.0,
      line: { color: COLORS.red, width: 2, dashType: "dash" },
    });
    slide.addText("MVP\nリリース", {
      x: mvpX - 0.5,
      y: 6.5,
      w: 1.2,
      h: 0.5,
      fontSize: 10,
      fontFace: FONT.body,
      bold: true,
      color: COLORS.red,
      align: "center",
    });

    slide.addText("あくまで推測であって、確約するものではありません。", {
      x: 0.5,
      y: 7.0,
      w: 9.0,
      h: 0.3,
      fontSize: 9,
      fontFace: FONT.body,
      color: COLORS.gray,
      align: "right",
    });
  }

  // ───────────────────────────────────────
  // Slide 11: トレードオフ・スライダー
  // ───────────────────────────────────────
  {
    const slide = pptx.addSlide();
    addTitle(slide, "トレードオフ・スライダー");

    // labels and levels (1=MIN..4=MAX)
    addSliderBar(
      slide,
      "機能をぜんぶ揃える（スコープ）",
      3,
      1.8
    );
    addSliderBar(slide, "予算内に収める（予算）", 2, 2.5);
    addSliderBar(slide, "期日を死守する（時間）", 2, 3.2);
    addSliderBar(
      slide,
      "高い品質、少ない欠陥（品質）",
      4,
      3.9
    );

    // Additional quality characteristics
    slide.addText("品質特性の優先順位", {
      x: 0.5,
      y: 4.8,
      w: 9.0,
      h: 0.4,
      fontSize: 14,
      fontFace: FONT.body,
      bold: true,
      color: COLORS.darkBlue,
    });

    addTable(
      slide,
      ["優先度", "品質特性", "理由"],
      [
        ["1", "正確性", "受注・在庫データの正確性は業務の根幹"],
        ["2", "使いやすさ", "小規模チームが日常的に使うため、直感的な操作性が必須"],
        ["3", "信頼性", "受注処理の停止は直接的な売上損失につながる"],
        ["4", "保守性", "小規模チームでの長期運用を見据えたシンプルな設計"],
      ],
      { y: 5.2, colW: [0.8, 1.8, 6.4] }
    );
  }

  // ───────────────────────────────────────
  // Slide 12: 初回のリリースに必要なもの
  // ───────────────────────────────────────
  {
    const slide = pptx.addSlide();
    addTitle(slide, "初回のリリースに必要なもの");

    addHighlightBox(
      slide,
      "Phase 2 完了時点で MVP（最小実行可能製品）をリリース",
      { y: 1.5, h: 0.7, fontSize: 16 }
    );

    slide.addText("MVP スコープ", {
      x: 0.5,
      y: 2.5,
      w: 9.0,
      h: 0.4,
      fontSize: 14,
      fontFace: FONT.body,
      bold: true,
      color: COLORS.darkBlue,
    });

    addBullets(
      slide,
      [
        "マルチモール受注管理（楽天市場、Yahoo!、Amazon、au PAY）",
        "在庫管理（自社在庫 + Amazon FBA 在庫の統合管理）",
        "出荷管理（受注に基づく出荷指示・梱包・配送手配）",
        "商品管理（商品マスタの一元管理、各モールへの同期）",
      ],
      { y: 2.9, h: 2.5, fontSize: 13 }
    );

    slide.addText("リリース戦略", {
      x: 0.5,
      y: 5.2,
      w: 9.0,
      h: 0.4,
      fontSize: 14,
      fontFace: FONT.body,
      bold: true,
      color: COLORS.darkBlue,
    });

    addBullets(
      slide,
      [
        "以降のフェーズは段階的にリリースし、フィードバックを反映しながら改善",
        "各フェーズ完了時にステークホルダーレビューを実施し、次フェーズの優先順位を見直す",
      ],
      { y: 5.6, h: 1.5, fontSize: 12 }
    );
  }

  // ───────────────────────────────────────
  // Save
  // ───────────────────────────────────────
  const outputPath = resolve(
    "docs/analysis/slide/HCOSS_v0.1.0.pptx"
  );
  const dataBuffer = await pptx.write({ outputType: "nodebuffer" });
  writeFileSync(outputPath, dataBuffer);
  console.log("Generated:", outputPath);
}

main().catch(console.error);
