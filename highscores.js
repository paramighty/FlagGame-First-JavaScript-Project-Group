const playAgainBtnEl = document.getElementById("playAgainBtn");
const highScoreListContainerEl = document.getElementById(
  "highscore-list-container"
);
let highScores = JSON.parse(localStorage.getItem("highScores")) || [];

for (let [i, score] of highScores.entries()) {
  let itemClass = ["highscore-list-container__item"];

  if (score.mostRecent) {
    itemClass.push("highscore-list-container__item--emphasis");
    itemClass.push("animate__animated");
    itemClass.push("animate__tada");
  }

  highScoreListContainerEl.innerHTML += `
  <div class="${itemClass.join(" ")}">
    <div>${i + 1}</div>
    <div>${score.name}</div>
    <div>${score.score}</div>
  </div>
  `;
}

playAgainBtnEl.addEventListener("click", () => window.location.assign("/"));
