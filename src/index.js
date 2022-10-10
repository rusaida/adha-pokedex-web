const pokemonContainer = document.getElementById("pokemon_container");
const spinner = document.querySelector("#spinner_loading");
const searchInput = document.getElementById("search");
const pokemonsNumber = 151;
const backgroundColors = {
  fire: "#fddfdf",
  grass: "#defde0",
  electric: "#eaeda1",
  water: "#def3fd",
  ground: "#f4e7da",
  rock: "#d5d5d4",
  fairy: "#fceaff",
  poison: "#b97fc9",
  bug: "#5ca10e",
  dragon: "#97b3e6",
  psychic: "#fcf7de",
  flying: "#6acbec",
  fighting: "#e6e0d4",
  ghost: "#7b62a3",
  ice: "#51c4e7",
  normal: "#f5f5f5",
};
const badgeColors = {
  fire: "#ff3333",
  grass: "#66cc00",
  electric: "#e3d79b",
  water: "#004c99",
  ground: "#dbba98",
  rock: "#a6a6a6",
  fairy: "#dca5e6",
  poison: "#a680b8",
  bug: "#dfad66",
  dragon: "#5d84cc",
  psychic: "#abb34d",
  flying: "#7ea6e0",
  fighting: "#ccb993",
  ghost: "#c3abd0",
  ice: "#007fff",
  steel: "#b8b8d0",
  normal: "#dcb0b0",
};

const ListAdhaPokemon = async () => {
  for (let i = 1; i <= pokemonsNumber; i++) {
    spinner.style.display = "block";
    await fetchAdhaPokemonById(i);
  }
};

const fetchAdhaPokemonById = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const res = await fetch(url);
  const pokemon = await res.json();
  renderPokemonCard(pokemon);
};

function renderPokemonCard(pokemon) {
  const pokemonCard = document.createElement("div");
  const arrayPokemonTypes = pokemon.types.map((type) => type.type.name);
  pokemonCard.classList.add("pokemon-card");
  pokemonCard.style.background = backgroundColors[arrayPokemonTypes[0]];

  // Card Front
  const pokemonCardFront = document.createElement("div");
  pokemonCardFront.classList.add("pokemon-card-front");
  pokemonCard.appendChild(pokemonCardFront);
  // Card Back
  const pokemonCardBack = document.createElement("div");
  pokemonCardBack.classList.add("pokemon-card-back");
  pokemonCardBack.appendChild(pokemonCardBackContainer(pokemon.stats, pokemon.sprites.other.dream_world.front_default));
  pokemonCard.appendChild(pokemonCardBack);
  // Sprite
  const pokemonSprite = document.createElement("div");
  const pokemonImage = document.createElement("img");
  pokemonImage.src = pokemon.sprites.other["official-artwork"].front_default;
  pokemonSprite.classList.add("img-container");
  pokemonSprite.appendChild(pokemonImage);
  pokemonCardFront.appendChild(pokemonSprite);
  // Information about Pokemon
  const pokemonInfo = document.createElement("div");
  pokemonInfo.classList.add("info");
  const pokemonName = document.createElement("h3");
  pokemonName.classList.add("name");
  pokemonName.textContent = pokemon.name;
  const pokemonNumber = document.createElement("span");
  pokemonNumber.classList.add("number");
  pokemonNumber.textContent = `#${pokemon.id.toString().padStart(3, 0)}`;
  pokemonInfo.appendChild(pokemonName);
  pokemonInfo.appendChild(pokemonNumber);
  pokemonCardFront.appendChild(pokemonInfo);
  // Badge for Pokemon types
  const pokemonType = document.createElement("div");
  pokemonType.classList.add("type");
  createBadgePokemonType(arrayPokemonTypes, pokemonType, pokemonCardFront);
  // Pokemon weight and height
  const pokemonWeightAndHeight = document.createElement("div");
  pokemonWeightAndHeight.classList.add("pokemon_height_and_weight");
  const pokemonWeight = document.createElement("div");
  const pokemonHeight = document.createElement("div");
  const pokemonWeightNumber = document.createElement("div");
  pokemonWeightNumber.classList.add("pokemon_weight");
  pokemonWeightNumber.textContent = `${parseFloat(pokemon.weight / 10)} KG`;
  const pokemonWeightLabel = document.createElement("div");
  pokemonWeightLabel.classList.add("weight_label");
  pokemonWeightLabel.textContent = "Weight";
  pokemonWeight.appendChild(pokemonWeightNumber);
  pokemonWeight.appendChild(pokemonWeightLabel);
  const pokemonHeightNumber = document.createElement("div");
  pokemonHeightNumber.classList.add("pokemon_height");
  pokemonHeightNumber.textContent = `${parseFloat(pokemon.height / 10)} M`;
  const pokemonHeightLabel = document.createElement("div");
  pokemonHeightLabel.classList.add("weight_label");
  pokemonHeightLabel.textContent = "Height";
  pokemonHeight.appendChild(pokemonHeightNumber);
  pokemonHeight.appendChild(pokemonHeightLabel);
  pokemonWeightAndHeight.appendChild(pokemonWeight);
  pokemonWeightAndHeight.appendChild(pokemonHeight);
  pokemonCardFront.appendChild(pokemonWeightAndHeight);

  pokemonContainer.appendChild(pokemonCard);
  spinner.style.display = "none";
}

function createBadgePokemonType(types, pokemonType, pokemonCardFront) {
  types.forEach(function (type) {
    let labelType = document.createElement("span");
    labelType.classList.add("badge", "rounded-pill");
    labelType.style.backgroundColor = badgeColors[type];
    labelType.textContent = type;
    pokemonType.append(labelType);
    pokemonType.innerHTML += "&nbsp;";
  });
  pokemonCardFront.appendChild(pokemonType);
}

function pokemonCardBackContainer(stats, srcImage) {
  const statsContainer = document.createElement("div");
  const pokemonImage = document.createElement("img");
  pokemonImage.src = srcImage;
  pokemonImage.style.height = "100px";
  pokemonImage.style.width = "200px";
  statsContainer.appendChild(pokemonImage);
  statsContainer.classList.add("stats-container");

  for (let i = 0; i < 6; i++) {
    const stat = stats[i];

    const statPercent = stat.base_stat / 2 + "%";
    const statContainer = document.createElement("stat-container");
    statContainer.classList.add("stat-container");

    const statName = document.createElement("div");
    statName.textContent = stat.stat.name;

    const progress = document.createElement("div");
    progress.classList.add("progress");

    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    progressBar.setAttribute("aria-valuenow", stat.base_stat);
    progressBar.setAttribute("aria-valuemin", 0);
    progressBar.setAttribute("aria-valuemax", 200);
    progressBar.style.width = statPercent;
    progressBar.textContent = stat.base_stat;

    progress.appendChild(progressBar);
    statContainer.appendChild(statName);
    statContainer.appendChild(progress);

    statsContainer.appendChild(statContainer);
  }
  return statsContainer;
}

function searchPokemonbyName() {
  const searchvalue = searchInput.value;
  const filterSearchValue = searchvalue.toLowerCase();
  searchPokemon(filterSearchValue, ".name");
}

function searchPokemonByType(type) {
  const filterSearchValue = type.toLowerCase();
  searchPokemon(filterSearchValue, ".type");
}

function searchPokemon(filterSearchValue, searchType) {
  const cards = document.querySelectorAll(".pokemon-card");
  for (let i = 0; i < cards.length; i++) {
    const search = cards[i].querySelector(searchType).innerText.toLowerCase();
    if (search.indexOf(filterSearchValue) > -1) {
      cards[i].style.display = "";
    } else {
      cards[i].style.display = "none";
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      document.getElementById("navbar_top").classList.add("fixed-top");
      navbar_height = document.querySelector(".navbar").offsetHeight;
      document.body.style.paddingTop = navbar_height + "px";
    } else {
      document.getElementById("navbar_top").classList.remove("fixed-top");
      document.body.style.paddingTop = "0";
    }
  });
});

function clearsearchPokemon() {
  searchInput.value = "";
  searchPokemonbyName();
}

searchInput.addEventListener("keyup", () => {
  searchPokemonbyName();
});

searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
  }
});

ListAdhaPokemon();
