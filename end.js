const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore");
finalScore.innerText = mostRecentScore;

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

const max_high_scores = 7;

console.log(localStorage.getItem("highScores"));

username.addEventListener("keyup", () => {
  saveScoreBtn.disabled = !username.value;
});

saveScoreBtn.addEventListener("click", (e) => saveHighScore(e));

saveHighScore = (e) => {
  console.log("clicked the button");
  e.preventDefault();

  const score = {
    score: mostRecentScore,
    name: username.value,
  };
  highScores.push(score);

  highScores.sort((a, b) => b.score - a.score);

  highScores.splice(5);

  localStorage.setItem("highScores", JSON.stringify(highScores));
  //window.location.assign("/");
  //Takes you to leaderboard
  localStorage.setItem("highScoresList", score);
  return window.location.assign("highscores.html");
};
