const cityForm = document.forms["city-form"];
const key = 'b10a1709279e52171ae6535fa8b02312';
const geoApi = 'http://api.openweathermap.org/geo/1.0/direct';
const weatherApi = 'http://api.openweathermap.org/data/2.5/weather';
const preloader = document.getElementById('preloader');

// classes
class WeatherData {
    constructor(data, city) {
        this.cityName = city;
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
        return now.toLocaleTimeString()
    }

    setDataToLocalStorage() {
        const weatherData = {
            cityName: this.cityName,
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

}

class LoadingAnimation {
    constructor(preloaderElement, loadingTexts, intervalTime = 300) {
        this.preloader = preloaderElement;
        this.loadingTexts = loadingTexts;
        this.intervalTime = intervalTime;
        this.index = 0;
        this.loadingInterval = null;
    }
    start() {
        this.preloader.style.display = "block"; 
        this.index = 0;
        this.loadingInterval = setInterval(() => this.updateText(), this.intervalTime); 
    }
    stop() {
        if (this.loadingInterval) {
            clearInterval(this.loadingInterval); 
            this.loadingInterval = null; 
        }
        this.preloader.style.display = "none"; 
    }

    updateText() {
        this.preloader.innerText = this.loadingTexts[this.index];
        this.index = (this.index + 1) % this.loadingTexts.length;
    }
}

// preloader
const loadingTexts = ["l","lo","loa","load","loadi","loadin", "loading", "loading.", "loading..","loading...",];
const loadingAnimation = new LoadingAnimation(preloader, loadingTexts, 300);


// form handler

cityForm.onsubmit = formHandler;

async function formHandler(e) {
    e.preventDefault();
    let city = e.target.city.value.trim();

    if (city.length > 3) {
        loadingAnimation.start();

        try {
            const data = await getCityWeather(city);
            if (data) {
                const weatherData = new WeatherData(data, city); 
                weatherData.setDataToLocalStorage();

                const weather = localStorage.getItem('weather');
                console.log(JSON.parse(weather));
            }
        } catch (error) {
            console.error("error when try to get information:", error);
        } finally {
            loadingAnimation.stop(); 
        }
    } else {
        e.target.city.placeholder = "insert correct city";
    }

    e.target.city.value = "";
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
