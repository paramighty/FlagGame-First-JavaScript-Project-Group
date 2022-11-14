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
const allCountries = await getCountries();
console.log(allCountries);
