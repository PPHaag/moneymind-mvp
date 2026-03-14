import OpenAI from "openai";

function safeParseJSON(text) {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (_) {
    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch (_) {
      return null;
    }
  }
}

function buildCapitalMapPrompt(data, tool) {
  const directCapital = Number(data.directCapital ?? 0);
  const accessibleCapital = Number(data.accessibleCapital ?? 0);
  const lockedCapital = Number(data.lockedCapital ?? 0);
  const netWorth = Number(data.netWorth ?? 0);
  const deployableCapital = Number(data.deployableCapital ?? 0);

  const totalCapital = directCapital + accessibleCapital + lockedCapital;

  const directShare =
    totalCapital > 0 ? ((directCapital / totalCapital) * 100).toFixed(1) : "0.0";
  const accessibleShare =
    totalCapital > 0 ? ((accessibleCapital / totalCapital) * 100).toFixed(1) : "0.0";
  const lockedShare =
    totalCapital > 0 ? ((lockedCapital / totalCapital) * 100).toFixed(1) : "0.0";

  return `
You are the MoneyMind Financial Intelligence Engine.

Your role is NOT to give generic personal finance advice.
Your role is to interpret a person's capital structure clearly, sharply, and strategically.

The user completed the Capital Map tool.

Tool: ${tool}

Capital structure data:
- Direct Capital: €${directCapital}
- Accessible Capital: €${accessibleCapital}
- Locked Capital: €${lockedCapital}
- Net Worth: €${netWorth}
- Deployable Capital: €${deployableCapital}

Capital mix:
- Direct Capital Share: ${directShare}%
- Accessible Capital Share: ${accessibleShare}%
- Locked Capital Share: ${lockedShare}%

Interpret this through a wealth architecture lens.

Focus on:
- concentration of capital
- liquidity versus structural depth
- deployability of capital
- imbalance between flexibility and long-term positioning
- whether the structure feels early-stage, balanced, or under-structured
- whether capital appears available but not yet intentionally layered

Return ONLY valid JSON.
Do not add markdown.
Do not add explanation before or after the JSON.

Use exactly this JSON shape:

{
  "structure_signal": "...",
  "liquidity_signal": "...",
  "what_stands_out": "...",
  "why_it_matters": "...",
  "moneymind_view": "...",
  "reflection": "..."
}

Rules:
- structure_signal: short classification, max 4 words
- liquidity_signal: short classification, max 3 words
- each explanation field: max 2-3 sentences
- intelligent, calm, premium, slightly sharp
- no generic blog language
- no financial advice
- no hype
- no moralizing
- no buy/sell/allocation instructions

Output must be valid JSON only.
`;
}

function buildAllocationPrompt(data, tool) {
  const income = Number(data.income ?? 0);
  const fixed = Number(data.fixed ?? 0);
  const wealth = Number(data.wealth ?? 0);
  const flex = Number(data.flex ?? 0);
  const wealthPct = Number(data.wealthPct ?? 0);
  const fixedPct = Number(data.fixedPct ?? 0);
  const flexPct = Number(data.flexPct ?? 0);

  return `
You are the MoneyMind Financial Intelligence Engine.

Your role is to interpret a person's monthly allocation structure.
Do NOT give generic budgeting tips or financial advice.

The user completed the Allocation Reality Check tool.

Tool: ${tool}

Allocation data:
- Monthly Net Income: €${income}
- Fixed Structural Costs: €${fixed}
- Monthly Wealth Building: €${wealth}
- Flexible Spend: €${flex}

Allocation ratios:
- Wealth Building Ratio: ${wealthPct.toFixed(1)}%
- Structural Cost Load: ${fixedPct.toFixed(1)}%
- Flexible Spend Share: ${flexPct.toFixed(1)}%

Interpret this through a cashflow allocation and wealth-building lens.

Focus on:
- whether the structure supports capital formation
- whether too much income is trapped in structural costs
- whether present consumption dominates future wealth
- whether wealth building is weak, moderate, or strong
- whether this structure looks reactive or intentional

Return ONLY valid JSON.
Do not add markdown.
Do not add explanation before or after the JSON.

Use exactly this JSON shape:

{
  "structure_signal": "...",
  "liquidity_signal": "...",
  "what_stands_out": "...",
  "why_it_matters": "...",
  "moneymind_view": "...",
  "reflection": "..."
}

Signal rules:
- structure_signal: short classification, max 4 words
- liquidity_signal: short classification, max 3 words
- signals must be short labels, not full sentences

Writing rules:
- each explanation field max 2-3 sentences
- intelligent, calm, premium, slightly sharp
- no generic finance blog tone
- no direct financial advice
- no moralizing
- no hype
- no clichés

Good examples of signal style:
- "Weak wealth allocation"
- "Moderate wealth structure"
- "Consumption-heavy"
- "Balanced but tight"
- "Low flexibility"
- "Moderate liquidity"

Output must be valid JSON only.
`;
}

function buildLeakagePrompt(data, tool) {
  const income = Number(data.income ?? 0);
  const wealth = Number(data.wealth ?? 0);
  const lifestyle = Number(data.lifestyle ?? 0);
  const subscriptions = Number(data.subscriptions ?? 0);
  const monthlyLeakage = Number(data.monthlyLeakage ?? 0);
  const annualLeakage = Number(data.annualLeakage ?? 0);
  const leakagePct = Number(data.leakagePct ?? 0);

  return `
You are the MoneyMind Financial Intelligence Engine.

Your role is to interpret a person's wealth leakage pattern.
Do NOT give generic budgeting advice and do NOT moralize spending.

The user completed the Wealth Leakage tool.

Tool: ${tool}

Leakage data:
- Monthly Net Income: €${income}
- Monthly Wealth Building: €${wealth}
- Lifestyle Spending: €${lifestyle}
- Subscriptions and Small Drains: €${subscriptions}
- Monthly Leakage: €${monthlyLeakage}
- Annual Leakage: €${annualLeakage}
- Leakage Ratio: ${leakagePct.toFixed(1)}%

Interpret this through a wealth leakage and behavioral finance lens.

Focus on:
- whether leakage is low, moderate, or high
- whether lifestyle spending competes with wealth building
- whether recurring small drains are structurally meaningful
- whether this pattern suggests lifestyle drift, loose spending discipline, or controlled leakage
- whether leakage is quietly slowing wealth formation

Return ONLY valid JSON.
Do not add markdown.
Do not add explanation before or after the JSON.

Use exactly this JSON shape:

{
  "leakage_signal": "...",
  "behavior_signal": "...",
  "what_stands_out": "...",
  "why_it_matters": "...",
  "moneymind_view": "...",
  "reflection": "..."
}

Signal rules:
- leakage_signal: short classification, max 4 words
- behavior_signal: short classification, max 4 words
- signals must be short labels, not full sentences

Writing rules:
- each explanation field max 2-3 sentences
- intelligent, calm, premium, slightly sharp
- no guilt language
- no moralizing
- no direct advice
- no blog clichés
- no hype

Good signal examples:
- "Controlled leakage"
- "Moderate leakage"
- "Heavy leakage"
- "Lifestyle drift"
- "Consumption creep"
- "Discipline pressure"

Output must be valid JSON only.
`;
}

function normalizeCapitalMapResponse(parsed) {
  return {
    success: true,
    structure_signal: parsed.structure_signal || "",
    liquidity_signal: parsed.liquidity_signal || "",
    what_stands_out: parsed.what_stands_out || "No section returned.",
    why_it_matters: parsed.why_it_matters || "No section returned.",
    moneymind_view: parsed.moneymind_view || "No section returned.",
    reflection: parsed.reflection || "No section returned."
  };
}

function normalizeAllocationResponse(parsed) {
  return {
    success: true,
    structure_signal: parsed.structure_signal || "",
    liquidity_signal: parsed.liquidity_signal || "",
    what_stands_out: parsed.what_stands_out || "No section returned.",
    why_it_matters: parsed.why_it_matters || "No section returned.",
    moneymind_view: parsed.moneymind_view || "No section returned.",
    reflection: parsed.reflection || "No section returned."
  };
}

function normalizeLeakageResponse(parsed) {
  return {
    success: true,
    leakage_signal: parsed.leakage_signal || "",
    behavior_signal: parsed.behavior_signal || "",
    what_stands_out: parsed.what_stands_out || "No section returned.",
    why_it_matters: parsed.why_it_matters || "No section returned.",
    moneymind_view: parsed.moneymind_view || "No section returned.",
    reflection: parsed.reflection || "No section returned."
  };
}

export default async function handler(req, res) {
  console.log("METHOD:", req.method);

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
      receivedMethod: req.method
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY missing");
    return res.status(500).json({
      error: "OpenAI API key missing"
    });
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  try {
    const { tool, data } = req.body || {};

    console.log("REQ BODY:", JSON.stringify(req.body, null, 2));

    if (!tool) {
      return res.status(400).json({
        error: "Missing tool identifier"
      });
    }

    if (!data) {
      return res.status(400).json({
        error: "Missing data payload"
      });
    }

    let prompt = "";
    let normalizeResponse;

    if (tool === "capital-map") {
      prompt = buildCapitalMapPrompt(data, tool);
      normalizeResponse = normalizeCapitalMapResponse;
    } else if (tool === "allocation-reality-check") {
      prompt = buildAllocationPrompt(data, tool);
      normalizeResponse = normalizeAllocationResponse;
    } else if (tool === "wealth-leakage") {
      prompt = buildLeakagePrompt(data, tool);
      normalizeResponse = normalizeLeakageResponse;
    } else {
      return res.status(400).json({
        error: "Unsupported tool",
        tool
      });
    }

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: prompt
    });

    const rawText =
      response.output_text ||
      response.output
        ?.map((item) =>
          (item.content || [])
            .map((c) => c.text || c.content || "")
            .join("")
        )
        .join("\n")
        .trim() ||
      "";

    console.log("RAW AI TEXT:", rawText);

    const parsed = safeParseJSON(rawText);

    if (!parsed) {
      console.error("JSON PARSE FAILED");
      return res.status(500).json({
        error: "AI returned invalid JSON",
        raw_insight: rawText
      });
    }

    return res.status(200).json(normalizeResponse(parsed));
  } catch (error) {
    console.error("OPENAI ERROR FULL:", error);
    console.error("OPENAI ERROR MESSAGE:", error?.message);
    console.error("OPENAI ERROR STATUS:", error?.status);

    if (error?.status === 429) {
      return res.status(500).json({
        error: "OpenAI quota exceeded",
        details:
          "The OpenAI API key is connected, but the project has no available quota or billing is not active."
      });
    }

    return res.status(500).json({
      error: "AI request failed",
      details: error?.message || "Unknown error"
    });
  }
}
