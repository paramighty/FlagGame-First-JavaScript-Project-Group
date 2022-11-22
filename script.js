// DOM elements
const containerEl = document.getElementById("container");

// State
let allCountries = [];
let countriesLeft = [];
let score;
let timeLeftMs;

// Functions

async function getCountries() {
  //allcountries = getCountries
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

function getFlagOptions(correctCountry) {
  //set total numbers of options/buttons
  const numberOfOptions = 5;

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
    while (!randomCountry || flagOptions.includes(randomCountry.name)) {
      //Staffan: I created a new getRandomItem() function.
      //This functionality could have been written inline here,
      // but it is probably cleaner to do it like this
      randomCountry = getRandomItem(allCountries);
    }

    //all good, we've made sure randomCountry === a unique country, then simply
    // push it to the [flagOptions]
    flagOptions.push(randomCountry.name);
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

function startTimer(gameTimeSeconds) {
  //since this is a very "local" function it is fine to declare it inside the startTimer function
  function renderTimeDisplay() {
    const defaultColor = "green";
    const urgentColor = "red";

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
        alert("GAME OVER!");
        showWelcomeScreen();
      }, 0);
      //-----
    }
  }, 10);
}

async function startGame() {
  //Create DOM elements required by the game
  containerEl.innerHTML = "";

  //The score
  const scoreEl = document.createElement("div");
  scoreEl.id = "currentScore";
  containerEl.append(scoreEl);

  //The timer
  const timerEl = document.createElement("div");
  timerEl.id = "timeDisplay";
  containerEl.append(timerEl);

  //The flag
  const flagEl = document.createElement("img");
  flagEl.id = "flag";
  flagEl.classList.add("flag");
  containerEl.append(flagEl);

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
  startTimer(45);

  //Ask the first question
  pickAFlag();
}

function pickAFlag() {
  let correctCountry = countriesLeft.pop();
  console.log(correctCountry);
  let flagOptions = getFlagOptions(correctCountry.name);
  flagOptions = shuffleArray(flagOptions);
  console.log(flagOptions);

  //Render to the DOM
  //The flag
  // containerEl.innerHTML = "";

  const flagEl = document.getElementById("flag");
  flagEl.src = correctCountry.flag;

  //The buttons
  const optionButtonsContainerEl = document.getElementById("options-container");
  optionButtonsContainerEl.innerHTML = "";

  for (let flagOption of flagOptions) {
    const optionButtonEl = document.createElement("button");
    optionButtonEl.classList.add("button-option");

    optionButtonEl.innerHTML = flagOption; //Satta: Does this create 4 options?

    // Logic for when button is clicked
    optionButtonEl.addEventListener("click", (e) => {
      const clickedOptionButtonEl = e.target; //What does target do?

      // Disable the clicked button to prevent it from being clicked again
      clickedOptionButtonEl.disabled = true;

      //check if the answer is correct or wrong and style the clicked button accordingly
      if (flagOption === correctCountry.name) {
        //C orrect answer
        console.log("CORRECT!");

        clickedOptionButtonEl.classList.add("button-option--correct");

        updateScore(++score);
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
  infoEl.innerHTML = "Welcome to Green Japan";
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
