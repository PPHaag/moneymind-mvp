document.addEventListener("DOMContentLoaded", () => {

// ===== Wealth Snapshot (MVP) =====
const PROFILE_KEY = "moneymindProfile";

function getMMProfile(){
  const raw = localStorage.getItem(PROFILE_KEY);
  if(!raw) return null;

  try{
    return JSON.parse(raw);
  }catch(e){
    return null;
  }
}
function prefillSnapshot(){

  const p = getMMProfile();
  if(!p) return;

  // PAS IDS AAN ALS ZE ANDERS HETEN
  const capitalInput = document.getElementById("capital");
  const monthlyInput = document.getElementById("monthly");
  const incomeInput  = document.getElementById("income");

  const investable =
    p?.inputs?.investableCapital ??
    p?.answers?.investableCapital ??
    null;

  const monthly =
    p?.inputs?.monthlyContribution ??
    p?.answers?.monthlyContribution ??
    null;

  const targetIncome =
    p?.inputs?.targetPassiveIncome ??
    p?.answers?.targetPassiveIncome ??
    null;

  if(capitalInput && !capitalInput.value && investable)
    capitalInput.value = investable;

  if(monthlyInput && !monthlyInput.value && monthly)
    monthlyInput.value = monthly;

  if(incomeInput && !incomeInput.value && targetIncome)
    incomeInput.value = targetIncome;
}







const INPUTS_KEY = "moneymindSnapshotInputs";

// Update these when you want deep-linking to your tools
const LINKS = {
  builder: "https://codepen.io/PPHaagie/full/VYjoRBb",
  leakage: "https://codepen.io/PPHaagie/full/wBWVOoy", // if you have a full link later, swap in
  boarding: "https://codepen.io/PPHaagie/full/GgjKZVj"  // your clean boarding
};

const $ = (id) => document.getElementById(id);

function euro(n){
  if (n == null || isNaN(n)) return "—";
  return new Intl.NumberFormat("nl-NL", { style:"currency", currency:"EUR", maximumFractionDigits:0 }).format(n);
}

function loadProfile(){
  const raw = localStorage.getItem(PROFILE_KEY);
  if(!raw){
    $("raw").textContent = "No profile found in localStorage. Run Boarding first.";
    $("kProfileType").textContent = "—";
    $("kPrimaryFocus").textContent = "—";
    $("kNextMove").textContent = "Run Boarding";
    $("kNextMoveNote").textContent = "Create a local profile, then return here.";
    return null;
  }

  try{
    const p = JSON.parse(raw);
    $("raw").textContent = JSON.stringify(p, null, 2);

    const type = p?.derived?.profileType || p?.profileType || "—";
    const focus = p?.derived?.primaryFocus || p?.primaryFocus || "—";
    const next = p?.derived?.nextStep || "Wealth Builder";
    const note = p?.derived?.nextStepNote || "Start with projections, then optimize leakage.";

    $("kProfileType").textContent = type;
    $("kPrimaryFocus").textContent = focus;
    $("kNextMove").textContent = next;
    $("kNextMoveNote").textContent = note;

    return p;
  }catch(e){
    $("raw").textContent = "Profile data exists but is not valid JSON.";
    return null;
  }
}

function loadInputs(){
  const raw = localStorage.getItem(INPUTS_KEY);
  if(!raw) return { capital:"", monthly:"", income:"" };
  try{ return JSON.parse(raw); }catch(e){ return { capital:"", monthly:"", income:"" }; }
}

function saveInputs(){
  const data = {
    capital: $("capital").value,
    monthly: $("monthly").value,
    income: $("income").value
  };
  localStorage.setItem(INPUTS_KEY, JSON.stringify(data));
  computeIncome();
}

function clearInputs(){
  localStorage.removeItem(INPUTS_KEY);
  $("capital").value = "";
  $("monthly").value = "";
  $("income").value = "";
  computeIncome();
}

function computeIncome(){
  const income = Number($("income").value || 0);
  if(!income){
    $("cap4").textContent = "—";
    $("cap6").textContent = "—";
    $("cap8").textContent = "—";
    return;
  }

  const yearly = income * 12;
  $("cap4").textContent = euro(yearly / 0.04);
  $("cap6").textContent = euro(yearly / 0.06);
  $("cap8").textContent = euro(yearly / 0.08);
}

function wire(){
  $("reloadBtn").addEventListener("click", () => loadProfile());
  $("saveBtn").addEventListener("click", saveInputs);
  $("clearBtn").addEventListener("click", clearInputs);

  $("income").addEventListener("input", computeIncome);

  $("goBuilder").addEventListener("click", () => window.location.href = LINKS.builder);
  $("goLeakage").addEventListener("click", () => window.location.href = LINKS.leakage);
  $("goBoarding").addEventListener("click", () => window.location.href = LINKS.boarding);
}

(function init(){
  const p = loadProfile();
  const inputs = loadInputs();
  $("capital").value = inputs.capital ?? "";
  $("monthly").value = inputs.monthly ?? "";
  $("income").value = inputs.income ?? "";

  computeIncome();
  wire();
})();
prefillSnapshot();
computeIncome();
const HUB_URL = "https://codepen.io/PPHaagie/full/yyaBgxr";
const backBtn = document.getElementById("backToHub");
if(backBtn) backBtn.addEventListener("click", () => location.href = HUB_URL);


});
