const resultPatterns = [
  {
    min: 0,
    max: 2,
    key: "stable",
    title: "安定寄り",
    description: "今すぐ動く必要は低めです。ただし比較材料を持っておくと安心です。"
  },
  {
    min: 3,
    max: 5,
    key: "confirm",
    title: "要確認",
    description: "今の職場だけで判断せず、他施設の条件も見ておくと安心です。"
  },
  {
    min: 6,
    max: 8,
    key: "compare",
    title: "要比較",
    description: "負担が重なっている可能性があります。まずは条件だけでも比較してみてください。"
  }
];

const form = document.querySelector("#diagnosis-form");
const countText = document.querySelector("#checked-count");
const resultCard = document.querySelector("#result");
const resultTitle = document.querySelector("#result-title");
const resultDescription = document.querySelector("#result-description");
let hasInteracted = false;

function getResultPattern(count) {
  return resultPatterns.find((pattern) => count >= pattern.min && count <= pattern.max);
}

function updateResult() {
  const checkedCount = form.querySelectorAll("input[type='checkbox']:checked").length;
  if (!hasInteracted && checkedCount === 0) {
    countText.textContent = checkedCount;
    resultTitle.textContent = "チェックすると結果が表示されます";
    resultDescription.textContent = "気になる項目を選ぶと、今の職場を見る目安を整理できます。";
    resultCard.className = "result-card result-pending";
    return;
  }

  const pattern = getResultPattern(checkedCount);

  countText.textContent = checkedCount;
  resultTitle.textContent = pattern.title;
  resultDescription.textContent = pattern.description;
  resultCard.className = `result-card result-${pattern.key}`;
}

document.querySelectorAll(".visual-frame img").forEach((image) => {
  const frame = image.closest(".visual-frame");

  function markLoaded() {
    frame.classList.add("has-image");
    image.classList.remove("is-missing");
  }

  function markMissing() {
    frame.classList.remove("has-image");
    image.classList.add("is-missing");
  }

  if (image.complete) {
    if (image.naturalWidth > 0) {
      markLoaded();
    } else {
      markMissing();
    }
  }

  image.addEventListener("load", markLoaded);
  image.addEventListener("error", () => {
    markMissing();
  });
});

form.addEventListener("change", () => {
  hasInteracted = true;
  updateResult();
});
updateResult();
