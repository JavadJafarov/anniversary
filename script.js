/**
 * Slide navigation + valentine interactions
 * (kept framework-free so you can open index.html directly)
 */

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function getPages() {
  return Array.from(document.querySelectorAll(".page"));
}

function getActivePageNumber() {
  const active = document.querySelector(".page.active");
  if (!active) return 1;
  const n = Number(active.getAttribute("data-page"));
  return Number.isFinite(n) ? n : 1;
}

function getMaxPageNumber() {
  const pages = getPages();
  return pages.reduce((max, p) => Math.max(max, Number(p.getAttribute("data-page")) || 0), 1);
}

function showPage(pageNumber, { updateHash = true } = {}) {
  const pages = getPages();
  const max = getMaxPageNumber();
  const n = clamp(Number(pageNumber) || 1, 1, max);

  for (const p of pages) {
    const isActive = Number(p.getAttribute("data-page")) === n;
    p.classList.toggle("active", isActive);
  }

  if (updateHash) {
    // Keep it copy/paste shareable: index.html#page-3
    history.replaceState(null, "", `#page-${n}`);
  }
}

function readHashPage() {
  const m = (location.hash || "").match(/page-(\d+)/i);
  if (!m) return null;
  return Number(m[1]);
}

function wireNavigation() {
  document.addEventListener("click", (e) => {
    const nextBtn = e.target.closest?.("[data-next]");
    if (nextBtn) {
      const current = getActivePageNumber();
      showPage(current + 1);
      return;
    }

    const gotoBtn = e.target.closest?.("[data-goto]");
    if (gotoBtn) {
      const target = Number(gotoBtn.getAttribute("data-goto"));
      showPage(target);
    }
  });

  // Keyboard navigation (nice for “presentation” vibe)
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "PageDown") showPage(getActivePageNumber() + 1);
    if (e.key === "ArrowLeft" || e.key === "PageUp") showPage(getActivePageNumber() - 1);
    if (e.key === "Home") showPage(1);
    if (e.key === "End") showPage(getMaxPageNumber());
  });

  window.addEventListener("hashchange", () => {
    const n = readHashPage();
    if (n) showPage(n, { updateHash: false });
  });

  // Initialize to hash page if present.
  const start = readHashPage();
  if (start) showPage(start, { updateHash: false });
}

function wireValentineButtons() {
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  const answerRow = document.getElementById("answerRow");
  const hint = document.getElementById("noHint");
  if (!yesBtn || !noBtn || !answerRow) return;

  let noCount = 0;

  function setHint(text) {
    if (!hint) return;
    hint.textContent = text;
  }

  function fleeNoButton() {
    noCount += 1;
    const rowRect = answerRow.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    const margin = 10;
    const maxX = Math.max(0, rowRect.width - btnRect.width - margin * 2);
    const maxY = 40; // keep it playful without flying too far

    const x = Math.round((Math.random() * maxX) - (maxX / 2));
    const y = Math.round((Math.random() * maxY) - (maxY / 2));

    noBtn.style.transform = `translate(${x}px, ${y}px) rotate(${(Math.random() * 10 - 5).toFixed(
      1
    )}deg)`;

    if (noCount === 1) setHint("hmm… that one seems shy.");
    if (noCount === 3) setHint("try the other button, my love.");
    if (noCount === 6) setHint("okay okay… I’ll pretend you didn’t mean that one.");
  }

  yesBtn.addEventListener("click", () => {
    setHint("");
    showPage(5);
  });

  // Make “no” dodge
  noBtn.addEventListener("pointerenter", fleeNoButton);
  noBtn.addEventListener("click", (e) => {
    e.preventDefault();
    fleeNoButton();
  });
}

wireNavigation();
wireValentineButtons();

