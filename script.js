import { createElement, styled } from "./js/helpers.js";
import styles from "./js/styles.js";
import { LoadingAnimation, WeatherData } from "./js/elementsConstructor.js";
import { loadingTexts, geoApi, key, weatherApi } from "./js/consts.js"
const cityForm = document.forms["city-form"];
const mainContainer = document.querySelector('main');

let loadingAnimation;

function createPreloader() {
    const preloader = document.createElement('div');
    const { preloaderStyle } = styles;
    styled(preloader, preloaderStyle)
    mainContainer.appendChild(preloader);

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
                const resultWeather = JSON.parse(weather);
                console.log(resultWeather);
                mainContainer.appendChild(createWeatherCard(resultWeather));
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
    const { cardStyle, iconStyle, compassStyle, titleStyle, temperatureStyle, windStyle, windDirectionStyle, windArrowStyle, speedStyle, mainStyle, descriptionStyle } = styles;
    const card = createElement('div');
    styled(card, cardStyle);

    const title = createElement('h2');
    title.innerText = `weather in : ${data.cityName}`.toUpperCase();
    styled(title, titleStyle);

    const icon = createElement('img');
    icon.src = data.icon;
    icon.alt = "weather";
    styled(icon, iconStyle)

    const temperature = createElement('span');
    temperature.innerText = `t: ${data.temperature} °`
    styled(temperature, temperatureStyle);

    const speed = createElement('span');
    speed.innerText = `speed: ${data.windSpeed} km/h`
    styled(speed, speedStyle);

    const main = createElement('span');
    main.innerText = `${data.main}`.toUpperCase();
    styled(main, mainStyle);

    const description = createElement('span');
    description.innerText = `${data.description} today`
    styled(description, descriptionStyle);


    const wind = createElement('div');
        const windDirection = createElement('img');
        windDirection.src = "./assets/compas.svg";
        windDirection.alt = "wind direction";
        styled(windDirection, windDirectionStyle);

        const windArrow = createElement('div');
        windArrow.innerText = "↑";
        windArrow.style.transform = `rotate(${data.windDirection}deg)`
        styled(windArrow , windArrowStyle);
    wind.append(windDirection , windArrow)
    styled(wind, windStyle);

    const compass = createElement('img');
    compass.src = "./assets/compas.svg";
    compass.alt = "compas";
    styled(compass, compassStyle)

    card.append(title, icon, wind, temperature, speed, description, main, compass)
    return card
}


