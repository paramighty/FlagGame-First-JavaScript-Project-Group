import { mathHelpers } from "./mathHelpers.js";

// DOM elements
const containerEl = document.getElementById("container");

// State
let allCountries = [];
let countriesLeft = [];
let score;
let timeLeftMs;

// Functions
async function getCountries() {
  const apiCall = "https://restcountries.com/v3.1/all?fields=name,flags";
  const res = await fetch(apiCall);
  const data = await res.json();
  console.log(data);

  let countries = [];
  for (let country of data) {
    const name =
      country.name.common === "Bangladesh"
        ? "Green Japan"
        : country.name.common; //if and else's modern version
    const flag = country.flags.svg;

    countries.push({ name, flag });
  }

  return countries;
}

function shuffleArray(array) {
  //Satta: why are we shuffling array??Unclear about the point of this function
  const newArray = [...array];
  const length = newArray.length;
  for (let start = 0; start < length; start++) {
    const randomPosition = Math.floor(
      (newArray.length - start) * Math.random()
    );
    const randomItem = newArray.splice(randomPosition, 1); //
    newArray.push(...randomItem); //Satta: Not clear what is happening here
  }
  return newArray;
}

function getRandomItem(arr) {
  // @ Marcin: This is basically exactly your code, with some fixed typos

  // get random index value
  const randomIndex = Math.floor(Math.random() * arr.length);

  // get random item
  const item = arr[randomIndex];

  return item;
}

function asyncTimeout(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getFlagOptions(correctCountry) {
  //set total numbers of options/buttons
  const numberOfOptions = 4;

  //add the correct option to our options
  const flagOptions = [correctCountry]; //correct option to our options

  //loop to add random countries to our options.
  for (let i = 0; i < numberOfOptions - 1; i++) {
    let randomCountry = "";

    // this while loop makes sure that the picked random country is not already in [flagOptions]
    // in plain language:
    // while (!randomCountry || flagOptions.includes(randomCountry)) {
    // basically means:
    // "While the variable randomCountry is NOT empty OR the value of
    // randomCountry is already in [flagOptions] please give us a new random country"
    while (!randomCountry || flagOptions.includes(randomCountry)) {
      //Staffan: I created a new getRandomItem() function.
      //This functionality could have been written inline here,
      // but it is probably cleaner to do it like this
      randomCountry = getRandomItem(allCountries);
    }

    //all good, we've made sure randomCountry === a unique country, then simply
    // push it to the [flagOptions]
    flagOptions.push(randomCountry);
  }

  //after loop is done, return [flagOptions]
  return flagOptions;
}

function updateScore(newScore) {
  console.log("newScore", newScore);
  //update "score" in "state"
  score = newScore;

  //update DOM
  const scoreEl = document.getElementById("currentScore");
  scoreEl.innerHTML = `Score: ${score}`;
}

async function flagAnimation(flagOptions, flagsContainerEl) {
  for (let [i, flagOption] of flagOptions.entries()) {
    const flagEl = document.createElement("img");
    flagEl.id = "flag" + i;
    flagEl.classList.add("flag");
    flagEl.classList.add("hidden");
    flagEl.src = flagOption.flag;
    await flagEl.decode();
    flagsContainerEl.append(flagEl);
  }

  const animTimeMs = 300;
  const startTime = Date.now();

  let animProgress = (Date.now() - startTime) / animTimeMs;

  let flagIndex = 0;
  while (animProgress < 1) {
    animProgress = mathHelpers.clamp(
      (Date.now() - startTime) / animTimeMs,
      0,
      1
    );

    const timeOut = mathHelpers.curvefit3(animProgress, 10, 20, 100);
    const flagEl = flagsContainerEl.children[flagIndex % flagOptions.length];
    flagEl.classList.remove("hidden");
    await asyncTimeout(timeOut);
    flagEl.classList.add("hidden");
    flagIndex++;
  }

  flagsContainerEl.innerHTML = "";
}

function calculateScoreToAdd(startTime) {
  const endTime = Date.now();
  const bonusTimeMs = 10000;
  const maxScore = 10000;
  const middleScore = 1000;
  const minScore = 10;

  const bonusTimeLeftMs = mathHelpers.clamp(
    bonusTimeMs - (endTime - startTime),
    0,
    bonusTimeMs
  );

  const bonusRatio = bonusTimeLeftMs / bonusTimeMs;
  return Math.floor(
    mathHelpers.curvefit3(bonusRatio, minScore, middleScore, maxScore)
  );
}

function startTimer(gameTimeSeconds) {
  //since this is a very "local" function it is fine to declare it inside the startTimer function
  function renderTimeDisplay() {
    const defaultColor = "#eee";
    const urgentColor = "#f00";

    const timeDisplay = document.getElementById("timeDisplay");

    const progress = timeLeftMs / timeLeftMsStart;
    timeDisplay.style.setProperty("--progress", `${progress * 100}%`);
    timeDisplay.style.setProperty(
      "--progress-color",
      timeLeftMs <= urgentTimeMs ? urgentColor : defaultColor
    );
  }

  const urgentTimeMs = 10000;
  const timeLeftMsStart = gameTimeSeconds * 1000;
  const startTimeMs = Date.now(); //store the time when game was started
  timeLeftMs = timeLeftMsStart - (Date.now() - startTimeMs);
  let timeLeftSeconds = Math.floor(timeLeftMs / 1000);

  renderTimeDisplay();

  let timerInterval = setInterval(function () {
    timeLeftMs = timeLeftMsStart - (Date.now() - startTimeMs);
    renderTimeDisplay();

    //This for being able to tick the seconds (play sound)
    let newTimeLeftSeconds = Math.floor(timeLeftMs / 1000);
    if (newTimeLeftSeconds !== timeLeftSeconds) {
      if (timeLeftMs <= urgentTimeMs) {
        //if time left is less than 10 seconds
        //@Marcin: This would be a good place for putting a "tick" sound
        console.log(timeLeftSeconds);
      }
      timeLeftSeconds = newTimeLeftSeconds;
    }

    if (timeLeftMs <= 0) {
      clearInterval(timerInterval);
      containerEl.innerHTML = "";

      //THIS IS A TEMPORARY "end game" solution:
      //This should be replaced with any "high score" stuff

      setTimeout(() => {
        //Gives your score and asks for your name
        localStorage.setItem("mostRecentScore", score);
        return window.location.assign("end.html");
      }, 0);
      //-----
    }
  }, 10);
}

async function startGame() {
  //Create DOM elements required by the game
  containerEl.innerHTML = "";

  const headerEl = document.createElement("div");
  headerEl.id = "header";

  const scoreEl = document.createElement("div");
  scoreEl.id = "currentScore";
  headerEl.append(scoreEl);

  const timerEl = document.createElement("div");
  timerEl.id = "timeDisplay";
  headerEl.append(timerEl);

  containerEl.append(headerEl);

  //The flag container

  const flagsContainerEl = document.createElement("div");
  flagsContainerEl.id = "flags-container";
  flagsContainerEl.classList.add("flags-container");
  containerEl.append(flagsContainerEl);

  //Buttons container
  const optionButtonsContainerEl = document.createElement("div");
  optionButtonsContainerEl.id = "options-container";
  containerEl.append(optionButtonsContainerEl);

  //initialize game state
  updateScore(0);
  allCountries = await getCountries();
  countriesLeft = [...allCountries]; //FYI: read up about "spread operator" (...) if you wonder about this line
  countriesLeft = shuffleArray(countriesLeft); //Shuffle the gameCountries array

  console.log(allCountries);
  console.log(countriesLeft);

  //Start the timer
  // startTimer(45);

  //Ask the first question
  pickAFlag();
}

async function pickAFlag() {
  let bonusStartTime;

  let correctCountry = countriesLeft.pop();
  console.log(correctCountry);
  let flagOptions = getFlagOptions(correctCountry);
  flagOptions = shuffleArray(flagOptions);
  console.log(flagOptions);
  let animDelay = 0;

  //Render to the DOM
  const animationClasses = ["appear-anim"];

  //The flag
  const flagsContainerEl = document.getElementById("flags-container");
  flagsContainerEl.innerHTML = "";
  const optionButtonsContainerEl = document.getElementById("options-container");
  optionButtonsContainerEl.innerHTML = "";

  await flagAnimation(flagOptions, flagsContainerEl);

  const flagEl = document.createElement("img");
  flagEl.id = "flag";
  flagEl.classList.add("flag");
  flagEl.src = correctCountry.flag;
  flagsContainerEl.append(flagEl);

  //The buttons

  for (let [i, flagOption] of flagOptions.entries()) {
    const isLastEl = i === flagOptions.length - 1;

    const optionButtonEl = document.createElement("button");
    optionButtonEl.classList.add("button-option");
    optionButtonEl.classList.add("hidden");
    setTimeout(() => {
      optionButtonEl.classList.remove("hidden");
      optionButtonEl.classList.add(...animationClasses);

      //start the bonus timer when the last element is added
      if (isLastEl) {
        bonusStartTime = Date.now();
      }
    }, animDelay++ * 30);

    optionButtonEl.innerHTML = flagOption.name; //Satta: Does this create 4 options?

    // Logic for when button is clicked
    optionButtonEl.addEventListener("click", (e) => {
      const clickedOptionButtonEl = e.target; //What does target do?

      // Disable the clicked button to prevent it from being clicked again
      clickedOptionButtonEl.disabled = true;
      clickedOptionButtonEl.classList.remove(...animationClasses);

      //check if the answer is correct or wrong and style the clicked button accordingly
      if (flagOption.name === correctCountry.name) {
        //C orrect answer
        console.log("CORRECT!");

        clickedOptionButtonEl.classList.add("button-option--correct");

        updateScore(score + calculateScoreToAdd(bonusStartTime));
      } else {
        // Wrong answer
        console.log("WRONG!");
        clickedOptionButtonEl.classList.add("button-option--wrong");
      }

      // Style the other buttons accordingly by looping over the children of
      // optionButtonsContainerEl.
      for (let otherOptionButtonEl of optionButtonsContainerEl.children) {
        // if the current button is the same as the clicked button we don't
        // want to do anything, because we have already styled the clicked button.
        // so, then we simply 'continue'. Continue means SKIP to next iteration of the loop
        if (otherOptionButtonEl === clickedOptionButtonEl) {
          continue;
        }

        // Disable the current "other button" to prevent it from being clicked again
        otherOptionButtonEl.disabled = true;
        otherOptionButtonEl.classList.remove(...animationClasses);

        // if the current "other button" is the correct one (user clicked the wrong button),
        // let's color the button GREEN
        if (otherOptionButtonEl.textContent === correctCountry.name) {
          otherOptionButtonEl.classList.add("button-option--correct");
        } else {
          // else, make it look "inactive"
          otherOptionButtonEl.classList.add("button-option--inactive");
        }
      }

      //ask next question, this is basically "the game loop"
      setTimeout(pickAFlag, 1000);
    });

    optionButtonsContainerEl.append(optionButtonEl);
  }
}

function showWelcomeScreen() {
  containerEl.innerHTML = "";

  const infoEl = document.createElement("div");
  infoEl.innerHTML = `
  <div class="text_block ">
  <p>
  How many flags can you recognize in 45 seconds? 
  </p><p>
  Let’s find out! 
</p>
<ul>
  <li><div class="emoji">⏳</div><div>45 seconds</div></li>
  <li><div class="emoji">✅</div><div>4 options but 1 correct answer</div></li>
  <li><div class="emoji">🚀</div><div>Answer fast to get more points</div></li>
  <li><div class="emoji">🏆</div><div>Chance to win a steaming cup of coffee for having the best score in the room!</div></li>
</ul>
</div>
  `;
  containerEl.append(infoEl);

  const startButtonEl = document.createElement("button");
  startButtonEl.id = "startButton";
  startButtonEl.innerText = "Start Game";
  startButtonEl.addEventListener("click", () => {
    startGame();
  });
  containerEl.append(startButtonEl);
}

showWelcomeScreen();
