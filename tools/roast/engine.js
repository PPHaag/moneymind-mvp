(function () {
  function toNumber(value) {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function randomItem(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return "";
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function uniquePush(arr, value) {
    if (value && !arr.includes(value)) {
      arr.push(value);
    }
  }

  function getData() {
    return window.ROAST_DATA || {};
  }

  function getCategoryLabel(categoryKey) {
    const categories = getData().categories || [];
    const found = categories.find((item) => item.key === categoryKey);
    return found ? found.label : "Structural Leakage";
  }

  function getHeadline(categoryKey) {
    const data = getData();
    const headlines = data.headlines || {};

    const defaults = {
      financial_chaos: [
        "Your money structure is less a system, more a monthly survival experiment."
      ],
      structural_leakage: [
        "Your income works full-time. Unfortunately not for you."
      ],
      income_without_direction: [
        "Nice income. Shame about the capital discipline."
      ],
      sleeping_capital: [
        "Your money is safe, comfortable, and doing absolutely nothing heroic."
      ],
      fragile_builder: [
        "You are building something, but one bad month could still bully the whole system."
      ],
      wealth_builder: [
        "Finally. Evidence of adult financial behavior."
      ]
    };

    return randomItem(headlines[categoryKey] || defaults[categoryKey] || defaults.structural_leakage);
  }

  function getShareLine(categoryKey, headline) {
    const data = getData();
    const shareLines = data.shareLines || {};

    const defaults = {
      financial_chaos: [
        "Your finances are currently running on hope, timing, and vibes."
      ],
      structural_leakage: [
        "Your cashflow has movement, but very little direction."
      ],
      income_without_direction: [
        "Good income. Weak routing."
      ],
      sleeping_capital: [
        "Your capital is safe, but not exactly ambitious."
      ],
      fragile_builder: [
        "You are building, but the structure still needs thicker walls."
      ],
      wealth_builder: [
        "Your structure shows actual financial intent."
      ]
    };

    return randomItem(shareLines[categoryKey] || defaults[categoryKey] || [headline]) || headline;
  }

  function getRoastLine(trigger) {
    const data = getData();
    const roastBullets = data.roastBullets || {};

    const defaults = {
      low_wealth_allocation: [
       
