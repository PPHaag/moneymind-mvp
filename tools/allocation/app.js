document.addEventListener("DOMContentLoaded", () => {
  alert("app.js running ✅");

  const calcBtn = document.getElementById("calcBtn");
  if (!calcBtn) {
    alert("calcBtn not found ❌");
    return;
  }

  calcBtn.addEventListener("click", () => {
    alert("calcBtn click works ✅");
  });
});
