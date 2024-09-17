import {createElement,styled} from "./js/helpers.js";
import styles from "./js/styles.js";
import {LoadingAnimation,WeatherData} from "./js/elementsConstructor.js";
import {loadingTexts, geoApi,key,weatherApi} from "./js/consts.js"
const cityForm = document.forms["city-form"];
const main = document.querySelector('main');

let loadingAnimation; 

function createPreloader() {
    const preloader = document.createElement('div');
    const {preloaderStyle} = styles;
    preloader.id = 'preloader';
    styled(preloader, preloaderStyle)
    main.appendChild(preloader);

    loadingAnimation = new LoadingAnimation(preloader, loadingTexts, 300);
}

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

                const weather = localStorage.getItem('weather');
                main.appendChild(createWeatherCard(JSON.parse(weather)));
            }
        } catch (error) {
            console.error("bid troble with error:", error);
        } finally {
            loadingAnimation.stop();
            removePreloader();
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
            console.error("Город не найден.");
            return null;
        }
    } catch (error) {
        console.error("Ошибка при запросе данных о погоде:", error);
    }
    return null;
}


function createWeatherCard(data) {
    // card
    const {cardStyle,iconStyle} = styles;
    const card = createElement('div');
    styled(card , cardStyle);

    // icon
    const icon = createElement('img');
    icon.src = data.icon;
    icon.alt = "weather";
    styled(icon , iconStyle)

    card.appendChild(icon)
    return card
}


