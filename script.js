const cityForm = document.forms["city-form"];
const key = 'b10a1709279e52171ae6535fa8b02312';
const geoApi = 'http://api.openweathermap.org/geo/1.0/direct';
const weatherApi = 'http://api.openweathermap.org/data/2.5/weather';
const preloader = document.getElementById('preloader');

// preloader
const loadingTexts = ["l","lo","loa","load","loadi","loadin", "loading", "loading.", "loading..","loading...",];
let index = 0;

function updateText() {
    preloader.innerText = loadingTexts[index];
    index = (index + 1) % loadingTexts.length;
}

setInterval(updateText, 100);

// form handler

cityForm.onsubmit = formHandler;

class WeatherData {
    constructor(data) {
        this.coord = data.coord;
        this.dateForRestart = this.getDateForRestart();
        this.country = data.sys.country;
        this.icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        this.description = data.weather[0].description;
        this.main = data.weather[0].main;
        this.temperature = (data.main.temp - 273.15).toFixed(1);
        this.windSpeed = data.wind.speed;
        this.windDirection = data.wind.deg;
        this.humidity = data.main.humidity;
        this.pressure = data.main.pressure;
    }

    getDateForRestart() {
        const now = new Date();
        now.setHours(now.getHours() + 2);
        return now.toLocaleTimeString();
    }

    setDataToLocalStorage() {
        const weatherData = {
            coord: this.coord,
            dateForRestart: this.dateForRestart,
            country: this.country,
            icon: this.icon,
            description: this.description,
            main: this.main,
            temperature: this.temperature,
            feelsLike: this.feelsLike,
            windSpeed: this.windSpeed,
            windDirection: this.windDirection,
            humidity: this.humidity,
            pressure: this.pressure,
        };
        window.localStorage.setItem('weather', JSON.stringify(weatherData));
    }

    getDataFromLocalStorage() {
        const storedData = window.localStorage.getItem('weather');
        if (storedData) {
            return JSON.parse(storedData);
        }
        return null;
    }
}

async function formHandler(e) {
    e.preventDefault();
    let city = e.target.city;

    if (city.value.length > 3) {
        const weatherData = await getCityWeather(city.value);
        if (weatherData) {
            const cityWeather = new WeatherData(weatherData);

            cityWeather.setDataToLocalStorage();

            const cityWeatherFromLocalStorage = cityWeather.getDataFromLocalStorage();

            console.log(cityWeatherFromLocalStorage); 
        }
    } else {
        city.placeholder = "Insert correct city";
    }

    city.value = "";
}

async function getCityWeather(city) {
    try {
        const geoResponse = await fetch(`${geoApi}?q=${city}&limit=1&appid=${key}`);
        const geoData = await geoResponse.json();

        if (geoData && geoData.length > 0) {
            const { lat, lon } = geoData[0];
            const weatherResponse = await fetch(`${weatherApi}?lat=${lat}&lon=${lon}&appid=${key}`);
            const weatherData = await weatherResponse.json();
            return weatherData;
        } else {
            console.error("City not found.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching city weather data:", error);
    }
    return null;
}
