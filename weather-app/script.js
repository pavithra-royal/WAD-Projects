const API_KEY = "834d71cdb1ae38d3db2c9f806f175ddc";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const currentWeather = document.getElementById("currentWeather");
const forecastContainer = document.getElementById("forecast");
const errorEl = document.getElementById("error");
const loading = document.getElementById("loading");
const favBtn = document.getElementById("favBtn");
const favoriteList = document.getElementById("favoriteList");

let currentCity = "";

/* ================= FETCH WEATHER BY CITY ================= */
async function getWeatherByCity(city) {
  try {
    loading.classList.remove("hidden");
    errorEl.textContent = "";

    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        city
      )},IN&limit=5&appid=${API_KEY}`
    );

    const geoData = await geoRes.json();

    if (!geoData.length) {
      throw new Error("City not found");
    }

    const place =
      geoData.find(p => p.country === "IN" && p.state) || geoData[0];

    const { lat, lon, name, state } = place;
    currentCity = state ? `${name}, ${state}` : name;

    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    if (!weatherRes.ok) {
      throw new Error("Weather data not available");
    }

    const data = await weatherRes.json();

    displayCurrentWeather(data);
    getForecast(lat, lon);
  } catch (err) {
    errorEl.textContent = "❌ " + err.message;
  } finally {
    loading.classList.add("hidden");
  }
}

/* ================= CURRENT WEATHER DISPLAY ================= */
function displayCurrentWeather(data) {
  if (!data || !data.main) return;

  currentWeather.classList.remove("hidden");

  document.getElementById("cityName").textContent = currentCity;
  document.getElementById("temperature").textContent =
    Math.round(data.main.temp) + "°C";
  document.getElementById("condition").textContent = data.weather[0].main;
  document.getElementById("humidity").textContent = data.main.humidity;
  document.getElementById("wind").textContent = data.wind.speed;
  document.getElementById("pressure").textContent = data.main.pressure;

  document.getElementById("weatherIcon").src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  document.getElementById("dateTime").textContent =
    new Date().toLocaleString();
}

/* ================= 5 DAY FORECAST ================= */
async function getForecast(lat, lon) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    if (!res.ok) return;

    const data = await res.json();
    forecastContainer.innerHTML = "";

    const daily = data.list.filter(item =>
      item.dt_txt.includes("12:00:00")
    );

    daily.forEach(day => {
      const card = document.createElement("div");
      card.className = "forecast-card";

      card.innerHTML = `
        <p>${new Date(day.dt_txt).toDateString()}</p>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
        <p>${day.weather[0].main}</p>
        <p>${Math.round(day.main.temp_min)}° / ${Math.round(
        day.main.temp_max
      )}°</p>
      `;

      forecastContainer.appendChild(card);
    });
  } catch (err) {
    console.log("Forecast error:", err);
  }
}

/* ================= FAVORITES ================= */
function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

function saveFavorites(favs) {
  localStorage.setItem("favorites", JSON.stringify(favs));
  loadFavorites();
}

favBtn.onclick = () => {
  if (!currentCity || currentCity.trim() === "") return;

  let favs = getFavorites().filter(city => city && city.trim() !== "");

  if (!favs.includes(currentCity)) {
    favs.push(currentCity);
    saveFavorites(favs);
  }
};

function loadFavorites() {
  favoriteList.innerHTML = "";

  const favorites = getFavorites().filter(city => city && city.trim() !== "");

  favorites.forEach(city => {
    const li = document.createElement("li");
    li.textContent = city;
    li.onclick = () => getWeatherByCity(city);
    favoriteList.appendChild(li);
  });
}

/* ================= GEOLOCATION ================= */
navigator.geolocation.getCurrentPosition(
  pos => {
    const { latitude, longitude } = pos.coords;
    getWeatherByCoords(latitude, longitude);
  },
  () => {
    console.log("Geolocation denied");
  }
);

async function getWeatherByCoords(lat, lon) {
  try {
    loading.classList.remove("hidden");
    errorEl.textContent = "";

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    if (!res.ok) {
      throw new Error("Location weather failed");
    }

    const data = await res.json();
    currentCity = data.name;

    displayCurrentWeather(data);
    getForecast(lat, lon);
  } catch (err) {
    errorEl.textContent = "❌ " + err.message;
  } finally {
    loading.classList.add("hidden");
  }
}

/* ================= EVENTS ================= */
function triggerSearch() {
  const city = cityInput.value.trim();
  if (city) {
    getWeatherByCity(city);
    cityInput.value = "";
  }
}

searchBtn.onclick = triggerSearch;

/* ✅ ENTER KEY SUPPORT */
cityInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    triggerSearch();
  }
});

/* ================= INIT ================= */
loadFavorites();
