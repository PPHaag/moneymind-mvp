function mmShowError(msg) {
  const box = document.getElementById("mmErrorBox");
  if (!box) { alert(msg); return; }
  box.style.display = "block";
  box.textContent = "MoneyMind error:\n" + msg;
}

window.addEventListener("error", (e) => {
  mmShowError((e.error && e.error.stack) ? e.error.stack : (e.message || "Unknown error"));
});
window.addEventListener("unhandledrejection", (e) => {
  mmShowError(e.reason?.stack || String(e.reason || "Unhandled promise rejection"));
});

document.addEventListener("DOMContentLoaded", () => {
  // ✅ paste your original CodePen JS inside this block
});
