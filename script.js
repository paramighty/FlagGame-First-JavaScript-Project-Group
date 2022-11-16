// DOM elements

// State
let allCountries = []; //Making an array for all the countries
let countriesLeft = []; // Making an array for all the countries left after one is deleted

// Functions

//Function 1:

async function getCountries() {
  //this is all the countries that we get from API
  const apiCall = "https://restcountries.com/v3.1/all?fields=name,flags"; //extra line to write url
  const res = await fetch(apiCall); //This returns a promise
  const data = await res.json(); //This returns response by parsing it as JSON

  let countries = []; // creating an array. What is the point of this array though?
  for (let country of data) {
    countries.push({
      //why push here?
      name: country.name.common, //are we creating key to objects? why?
      flag: country.flags.svg,
    });
  }

  return countries; //This returns two of the elements from the Flag API: Name and flag pic.
}

// Function 2:
function shuffleArray(array) {
  //TODO: Shuffle the array and return it
  return array;
}

// Function 3:
async function startGame() {
  //just for starting
  allCountries = await getCountries(); //All the countries we get from API is here

  //Copy the countries array
  countriesLeft = [...allCountries]; //FYI: read up about "spread operator" (...) if you wonder about this line
  // Why do we need to copy data? Is it like creating a backup?
  //Shuffle the gameCountries array
  shuffleArray(countriesLeft);

  console.log(allCountries);
  console.log(countriesLeft);
  pickAFlag();
}

// Function 4:
function pickAFlag() {
  let correctCountry = countriesLeft.pop(); //copied API data's last set getting removed
  console.log(correctCountry);

  const flagOptions = getFlagOptions(correctCountry.name);
  shuffleArray(flagOptions);
  console.log(flagOptions);

  for (let flagOption of flagOptions) {
    //For every flagOption(element) in the flagOptions(iterable),run console.log
    //TODO: Render button to the DOM, instead of log to console
    console.log(flagOption); //For 'for..of', console.log will happen with element and so in this case flgOption
  }
}

// Function 5:
function getFlagOptions(correctCountry) {
  //TODO: Real wrong, random, answers
  const flagOptions = [correctCountry, "A", "B", "C"];
  return flagOptions;
}
startGame();
