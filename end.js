const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore");
finalScore.innerText = mostRecentScore;

let highScores = JSON.parse(localStorage.getItem("highScores")) || [];

const max_high_scores = 7;

console.log(localStorage.getItem("highScores"));

username.addEventListener("keyup", () => {
  saveScoreBtn.disabled = !username.value;
});

saveScoreBtn.addEventListener("click", (e) => saveHighScore(e));

saveHighScore = (e) => {
  console.log("clicked the button");
  e.preventDefault();

  highScores = highScores.map((v) => {
    v.mostRecent = false;
    return v;
  });

  const score = {
    mostRecent: true,
    score: mostRecentScore,
    name: username.value,
  };

  highScores.push(score);

  highScores.sort((a, b) => b.score - a.score);

  highScores.splice(10);

  localStorage.setItem("highScores", JSON.stringify(highScores));

  //Takes you to leaderboard
  localStorage.setItem("highScoresList", score);
  return window.location.assign("highscores.html");
};
