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
  //TODO: Shuffle the array and return it
  return array;
}

async function startGame() {
  allCountries = await getCountries();

  //Copy the countries array
  countriesLeft = [...allCountries]; //FYI: read up about "spread operator" (...) if you wonder about this line

  //Shuffle the gameCountries array
  shuffleArray(countriesLeft);

  console.log(allCountries);
  console.log(countriesLeft);
  pickAFlag();
}

function pickAFlag() {
  let correctCountry = countriesLeft.pop();
  console.log(correctCountry);
  const flagOptions = getFlagOptions(correctCountry.name);
  shuffleArray(flagOptions);
  console.log(flagOptions);

  for (let flagOption of flagOptions) {
    //TODO: Render button to the DOM, instead of log to console
    console.log(flagOption);
  }
}
function getFlagOptions(correctCountry) {
  //TODO: Real wrong, random, answers
  const flagOptions = [correctCountry, "A", "B", "C"];
  return flagOptions;
}
startGame();
