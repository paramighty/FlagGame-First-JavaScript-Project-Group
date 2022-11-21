// DOM elements
const containerEl = document.getElementById("container");

// State
let allCountries = [];
let countriesLeft = [];
let score = 0;

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

async function startGame() {
  allCountries = await getCountries();

  //Copy the countries array
  countriesLeft = [...allCountries]; //FYI: read up about "spread operator" (...) if you wonder about this line

  //Shuffle the gameCountries array
  countriesLeft = shuffleArray(countriesLeft);

  console.log(allCountries);
  console.log(countriesLeft);

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
  containerEl.innerHTML = "";
  const flagEl = document.createElement("img");
  flagEl.src = correctCountry.flag;
  flagEl.classList.add("flag");
  containerEl.append(flagEl);

  //The buttons
  const optionButtonsContainerEl = document.createElement("div");
  optionButtonsContainerEl.id = "options-container";

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
        score += 1;
        document.getElementById("currentScore").innerHTML =
          "Total Score: " + score;
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

  //append buttons container to the main container
  containerEl.append(optionButtonsContainerEl);
}

startGame();

//Satta: Have a current score

const divCurrentScore = document.createElement("div");
divCurrentScore.id = "currentScore";
const scoreText = document.createTextNode("Total Score: 0");

divCurrentScore.appendChild(scoreText);
document.body.insertBefore(
  divCurrentScore,
  document.getElementById("container")
);
document.getElementById("currentScore").style.fontSize = "50px";

//Satta: Have a start button
const startDiv = document.createElement("div");
startDiv.id = "startDiv";
document.body.insertBefore(startDiv, divCurrentScore);

const startButton = document.createElement("button");
startButton.id = "startButton";
startButton.innerText = "Start Game";
startButton.addEventListener("click", () => {
  document.getElementById("container").style.display = "flex";
  document.getElementById("currentScore").style.display = "block";
  document.getElementById("timeDisplay").style.display = "block";
  document.getElementById("startButton").style.display = "none";
  console.log(timeLeftFunction());
});

startDiv.appendChild(startButton);

//Satta: Have a timer
let timeLeft = 45;
let timerInterval;

const divTimeDisplay = document.createElement("div");
divTimeDisplay.id = "timeDisplay";
const timerText = document.createTextNode("Time Left: 45");
divTimeDisplay.appendChild(timerText);
document.body.insertBefore(
  divTimeDisplay,
  document.getElementById("container")
);

function timeLeftFunction() {
  let timeDisplay = document.getElementById("timeDisplay");
  timerInterval = setInterval(function () {
    timeLeft -= 1;

    timeDisplay.innerHTML = "Time Left: " + timeLeft;
    if (timeLeft == 0) {
      clearInterval(timerInterval);
    }
  }, 1000);
}
