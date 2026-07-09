const TOTAL_QUESTIONS = 7;
const answers = {};
let diagnosisStarted = false;
let diagnosisCompleted = false;

const countEl = document.querySelector("#answered-count");
const resultCard = document.querySelector("#result");
const resultStars = document.querySelector("#result-stars");
const resultTitle = document.querySelector("#result-title");
const resultDescription = document.querySelector("#result-description");

const resultTiers = [
  {
    max: 2,
    key: "low",
    stars: "★☆☆",
    title: "危険度 低",
    description: "今すぐ転職ではなく、まずは条件確認がおすすめです。"
  },
  {
    max: 4,
    key: "mid",
    stars: "★★☆",
    title: "危険度 中",
    description: "他の施設と比較すると、今の職場で損している点が見える可能性があります。"
  },
  {
    max: 7,
    key: "high",
    stars: "★★★",
    title: "危険度 高",
    description: "早めに求人比較・相談をして、今より良い条件があるか確認した方がよい状態です。"
  }
];

function trackEvent(name, detail) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(Object.assign({ event: name }, detail || {}));
}

function markDiagnosisStart() {
  if (diagnosisStarted) return;
  diagnosisStarted = true;
  trackEvent("diagnosis_start");
}

function getResultTier(yesCount) {
  return resultTiers.find((tier) => yesCount <= tier.max);
}

function renderResult() {
  const answeredCount = Object.keys(answers).length;
  countEl.textContent = answeredCount;

  if (answeredCount < TOTAL_QUESTIONS) {
    return;
  }

  const yesCount = Object.values(answers).filter((value) => value === "yes").length;
  const tier = getResultTier(yesCount);

  resultStars.textContent = tier.stars;
  resultTitle.textContent = tier.title;
  resultDescription.textContent = tier.description;
  resultCard.className = `result-card result-${tier.key}`;
  resultCard.hidden = false;

  if (!diagnosisCompleted) {
    diagnosisCompleted = true;
    trackEvent("diagnosis_complete", { yes_count: yesCount, risk_level: tier.key });
    resultCard.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

document.querySelectorAll(".yn-button").forEach((button) => {
  button.addEventListener("click", () => {
    const q = button.dataset.q;
    const answer = button.dataset.answer;
    answers[q] = answer;
    markDiagnosisStart();

    document.querySelectorAll(`.yn-button[data-q="${q}"]`).forEach((btn) => {
      btn.classList.toggle("is-selected", btn === button);
    });

    const questionEl = document.querySelector(`.diag-q[data-q="${q}"]`);
    if (questionEl) questionEl.classList.add("is-answered");

    renderResult();
  });
});

document.querySelectorAll("[data-event]").forEach((el) => {
  if (el.classList.contains("yn-button") || el.id === "result") return;
  el.addEventListener("click", () => {
    if (el.dataset.event === "diagnosis_start") {
      markDiagnosisStart();
      return;
    }
    trackEvent(el.dataset.event, { source: el.dataset.eventSource || null });
  });
});

let scrollFired = false;
function checkScrollDepth() {
  if (scrollFired) return;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight <= 0) return;
  const percent = (scrollTop / docHeight) * 100;
  if (percent >= 75) {
    scrollFired = true;
    trackEvent("scroll_75");
    window.removeEventListener("scroll", checkScrollDepth);
  }
}
window.addEventListener("scroll", checkScrollDepth, { passive: true });
checkScrollDepth();

document.querySelectorAll(".visual-frame img").forEach((image) => {
  const frame = image.closest(".visual-frame");
  const markLoaded = () => frame.classList.add("has-image");
  const markMissing = () => frame.classList.remove("has-image");

  if (image.complete) {
    image.naturalWidth > 0 ? markLoaded() : markMissing();
  }

  image.addEventListener("load", markLoaded);
  image.addEventListener("error", markMissing);
});
