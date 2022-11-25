const playAgainBtnEl = document.getElementById("playAgainBtn");
const highScoreListContainerEl = document.getElementById(
  "highscore-list-container"
);
let highScores = JSON.parse(localStorage.getItem("highScores")) || [];

function getRankIcon(rank) {
  const rankIcons = {
    1: { icon: "🥇", scale: 2 },
    2: { icon: "🥈", scale: 1.5 },
    3: { icon: "🥉", scale: 1 },
  };

  const rankIcon = rankIcons[rank];

  if (rankIcon) {
    return `<span class="emoji" style="scale:${rankIcon.scale}">${rankIcon.icon}</span>`;
  }

  return rank;
}

for (let [i, score] of highScores.entries()) {
  let itemClass = ["highscore-list-container__item"];

  if (score.mostRecent) {
    itemClass.push("highscore-list-container__item--emphasis");
    itemClass.push("animate__animated");
    itemClass.push("animate__tada");
  }

  highScoreListContainerEl.innerHTML += `
  <div class="${itemClass.join(" ")}">
    <div>${getRankIcon(i + 1)}</div>
    <div>${score.name}</div>
    <div>${score.score}</div>
  </div>
  `;
}

playAgainBtnEl.addEventListener("click", () => window.location.assign("/"));
