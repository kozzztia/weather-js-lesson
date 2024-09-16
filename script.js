const cityForm = document.forms["city-form"];
const key = 'b10a1709279e52171ae6535fa8b02312';
const geoApi = 'http://api.openweathermap.org/geo/1.0/direct';
const weatherApi = 'http://api.openweathermap.org/data/2.5/weather';
const main = document.querySelector('main');

// классы
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

// Прелоадер
const loadingTexts = ["l","lo","loa","load","loadi","loadin", "loading", "loading.", "loading..","loading..."];
let loadingAnimation;  // Прелоадер для динамической загрузки

// Создаем и добавляем прелоадер в main
function createPreloader() {
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.style.display = 'none';
    preloader.style.textAlign = 'center';
    preloader.style.fontSize = '24px';
    main.appendChild(preloader);

    // Инициализация анимации с новым элементом прелоадера
    loadingAnimation = new LoadingAnimation(preloader, loadingTexts, 300);
}

// Удаление прелоадера из main
function removePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.remove();
    }
}

// Инициализация прелоадера при загрузке страницы
createPreloader();

// Обработчик формы
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

                const weather = localStorage.getItem('weather')
                main.innerHTML = createWeatherCard(JSON.parse(weather));
            }
        } catch (error) {
            console.error("Ошибка при получении данных:", error);
        } finally {
            loadingAnimation.stop(); 
            removePreloader();
        }
    } else {
        e.target.city.placeholder = "Введите правильный город";
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
            console.error("Город не найден.");
            return null;
        }
    } catch (error) {
        console.error("Ошибка при запросе данных о погоде:", error);
    }
    return null;
}

function createWeatherCard(data){
    return`
    <div class="weather-card">
        <img src="${data.icon}" alt="icon"/>
    </div>
    `
}