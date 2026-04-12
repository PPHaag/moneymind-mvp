# MoneyMind Design System v1

## Purpose
Starter structure for all MoneyMind tools.

## Core rules
- Use the same dark premium layout across all tools
- Use `.mm-toolnav` pill navigation on every tool page
- Use question-mark tooltips for field clarification
- Keep flow consistent:
  Input → Calculate → Result → Insight → AI Insight
- Use the same AI block structure everywhere
- Keep copy calm, sharp, minimal, and insight-first

## Standard tool order
1. Capital Map
2. Allocation Check
3. Wealth Leakage
4. Cost of Delay
5. Wealth Builder

## Template location
`/docs/templates/moneymind-tool-starter.html`

## Notes
When building a new tool:
1. Copy the starter template
2. Rename title, intro, fields, CTA, and metrics
3. Replace `calculateToolData()`
4. Replace `getToolInsight()`
5. Update AI `tool` slug in `fetchAIInsight()`
6. Keep layout and navigation style unchanged unless deliberately evolving the design system
