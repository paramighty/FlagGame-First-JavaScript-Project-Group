// DOM elements

// State
let allCountries = [];
let countriesLeft = [];

// Functions

async function getCountries() {
  const apiCall = "https://restcountries.com/v3.1/all?fields=name,flags";
  const res = await fetch(apiCall);
  const data = await res.json();

  let countries = [];
  for (let country of data) {
    countries.push({
      name: country.name.common,
      flag: country.flags.svg,
    });
  }

  return countries;
}

function shuffleArray(array) {
  const newArray = [...array];
  const length = newArray.length;
  for (let start = 0; start < length; start++) {
    const randomPosition = Math.floor(
      (newArray.length - start) * Math.random()
    );
    const randomItem = newArray.splice(randomPosition, 1);
    newArray.push(...randomItem);
  }
  return newArray;
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

  //The buttons
  for (let flagOption of flagOptions) {
    document.getElementById("container").innerHTML +=
      "<button>" + flagOption + "</button>";
  }
}

function getFlagOptions(correctCountry) {
  //TODO: Real wrong, random, answers
  const flagOptions = [correctCountry, "A", "B", "C"];
  return flagOptions;
}
startGame();
