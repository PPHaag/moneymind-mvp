# MoneyMind System Architecture v1.1

---

## CORE FLOW

/tools/roast → /apps/dashboard → /tools/... → /apps/dashboard

---

## LAYERS

### 1. Entry Layer
/tools/roast

- primary data input
- first insight moment
- triggers dashboard

---

### 2. Decision Layer
/apps/dashboard

- central decision engine
- shows:
  - AI insight
  - next best step
  - guided actions
  - academy context

---

### 3. Execution Layer
/tools/*

Tools:

- /tools/capital-map
- /tools/spending-vs-building
- /tools/leakage
- /tools/builder
- /tools/cost-of-delay
- /tools/snapshot

---

## NAVIGATION RULES

- Roast → Dashboard
- Tool → Dashboard
- Dashboard → Tool (via Next Step)

---

## PRODUCT PRINCIPLE

Dashboard owns the journey  
Tools execute the journey  
AI explains the journey  
Data remembers the journey  

---

## UX PRINCIPLE

User must always know:

"What should I do next?"
