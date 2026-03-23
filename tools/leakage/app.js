(function () {

  function getNumber(id) {
    const el = document.getElementById(id);
    const value = Number(el?.value || 0);
    return Number.isFinite(value) && value >= 0 ? value : 0;
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0
    }).format(value || 0);
  }

  function formatPercent(value) {
    return `${Math.round((value || 0) * 100)}%`;
  }

  function getProfile() {
    try {
      return JSON.parse(localStorage.getItem("mm_profile") || "{}");
    } catch (err) {
      console.warn("Could not read mm_profile", err);
      return {};
    }
  }

  function prefillFromProfile() {
    const profile = getProfile();

    const profileCard = document.getElementById("profileCard");
    const profileName = document.getElementById("profileName");
    const profileText = document.getElementById("profileText");
    const profileBadge = document.getElementById("profileBadge");
    const incomeValue = document.getElementById("incomeValue");
    const buildingValue = document.getElementById("buildingValue");
    const flowValue = document.getElementById("flowValue");

    if (profile.profileName && profileCard) {
      profileCard.style.display = "block";
    }

    if (profileName) {
      profileName.textContent = profile.profileName || "Your profile";
    }

    if (profileText) {
      profileText.textContent = profile.profileDescription || "";
    }

    if (profileBadge) {
      profileBadge.textContent = profile.profileName || "Profile";
    }

    if (incomeValue) {
      incomeValue.textContent = formatCurrency(profile.income || 0);
    }

    if (buildingValue) {
      buildingValue.textContent = formatCurrency(profile.monthlyInvesting || 0);
    }

    if (flowValue) {
      const allocation = profile.allocation || {};
      const buildingRatio = allocation.buildingRatio || 0;

      if (buildingRatio >= 0.2) {
        flowValue.textContent = "Building momentum";
      } else if (buildingRatio >= 0.1) {
        flowValue.textContent = "Some progress";
      } else if (buildingRatio > 0) {
        flowValue.textContent = "Weak build rate";
      } else {
        flowValue.textContent = "No real build";
      }
    }
  }

  function calculateLeakage() {
    const subscriptions = getNumber("subscriptions");
    const impulse = getNumber("impulse");
    const convenience = getNumber("convenience");
    const misc = getNumber("misc");

    const monthlyLeakage = subscriptions + impulse + convenience + misc;
    const annualLeakage = monthlyLeakage * 12;

    const profile = getProfile();
    const income = Number(profile.income || 0);
    const building = Number(profile.monthlyInvesting || 0);

    const leakageRatio = income > 0 ? monthlyLeakage / income : 0;
    const leakageVsBuilding = building > 0 ? monthlyLeakage / building : null;

    return {
      subscriptions,
      impulse,
      convenience,
      misc,
      monthlyLeakage,
      annualLeakage,
      income,
      building,
      leakageRatio,
      leakageVsBuilding
    };
  }

  function getHeadline(data) {
    if (data.monthlyLeakage <= 0) {
      return "There is no obvious leakage here. Good.";
    }

    if (data.leakageRatio >= 0.2) {
      return "A serious part of your income is leaking away.";
    }

    if (data.leakageRatio >= 0.1) {
      return "There is more leakage here than you probably feel month to month.";
    }

    if (data.monthlyLeakage >= 250) {
      return "Small monthly leakage is adding up faster than it looks.";
    }

    return "Your leakage is not catastrophic — but it is still slowing you down.";
  }

  function getInsight(data) {
    if (data.monthlyLeakage <= 0) {
      return "Nothing major stands out here. That does not mean spending is perfect, but there is no clear leakage pattern in this layer.";
    }

    if (data.leakageVsBuilding && data.leakageVsBuilding >= 1) {
      return "Your leakage is at least as large as the amount you are building. That means part of your future is being cancelled out in real time.";
    }

    if (data.leakageRatio >= 0.2) {
      return "A large part of your monthly income is disappearing into spending that does not clearly improve your life or your long-term position.";
    }

    if (data.leakageRatio >= 0.1) {
      return "This is the kind of leakage that feels harmless month to month but becomes expensive over a year.";
    }

    return "This leakage is not dramatic, but it is still competing with your future capital every single month.";
  }

  function buildBreakdown(data) {
    const rows = [
      {
        key: "subscriptions",
        title: "Subscriptions",
        note: "Usually invisible because they feel small and automatic.",
        value: data.subscriptions
      },
      {
        key: "impulse",
        title: "Impulse spending",
        note: "Random spending that feels minor until it stacks up.",
        value: data.impulse
      },
      {
        key: "convenience",
        title: "Convenience spending",
        note: "Comfort is expensive when it becomes a habit.",
        value: data.convenience
      },
      {
        key: "misc",
        title: "Hidden / forgotten spend",
        note: "The category that usually hurts more than expected.",
        value: data.misc
      }
    ];

    return rows.sort((a, b) => b.value - a.value);
  }

  function renderBreakdown(data) {
    const breakdownList = document.getElementById("breakdownList");
    if (!breakdownList) return;

    const items = buildBreakdown(data);

    breakdownList.innerHTML = items.map(item => `
      <div class="mm-breakdownItem">
        <div class="mm-breakdownLeft">
          <div class="mm-breakdownTitle">${item.title}</div>
          <div class="mm-breakdownNote">${item.note}</div>
        </div>
        <div class="mm-breakdownValue">${formatCurrency(item.value)}</div>
      </div>
    `).join("");
  }

  function render() {
    const data = calculateLeakage();

    const resultBlock = document.getElementById("resultBlock");
    const headlineText = document.getElementById("headlineText");
    const monthlyLeakageValue = document.getElementById("monthlyLeakageValue");
    const annualLeakageValue = document.getElementById("annualLeakageValue");
    const leakageRatioValue = document.getElementById("leakageRatioValue");
    const insightText = document.getElementById("insightText");

    if (headlineText) {
      headlineText.textContent = getHeadline(data);
    }

    if (monthlyLeakageValue) {
      monthlyLeakageValue.textContent = formatCurrency(data.monthlyLeakage);
    }

    if (annualLeakageValue) {
      annualLeakageValue.textContent = formatCurrency(data.annualLeakage);
    }

    if (leakageRatioValue) {
      leakageRatioValue.textContent = formatPercent(data.leakageRatio);
    }

    if (insightText) {
      insightText.textContent = getInsight(data);
    }

    renderBreakdown(data);

    if (resultBlock) {
      resultBlock.style.display = "grid";
      resultBlock.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }

    try {
      const profile = getProfile();

      localStorage.setItem("mm_profile", JSON.stringify({
        ...profile,
        leakage: data,
        leakageUpdatedAt: new Date().toISOString()
      }));
    } catch (err) {
      console.warn("Could not save leakage data", err);
    }
  }

  function init() {
    prefillFromProfile();

    const calculateBtn = document.getElementById("calculateBtn");
    if (calculateBtn) {
      calculateBtn.addEventListener("click", render);
    }
  }

  document.addEventListener("DOMContentLoaded", init);

})();
