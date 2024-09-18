import { createElement, styled } from "./js/helpers.js";
import styles from "./js/styles.js";
import { LoadingAnimation, WeatherData } from "./js/elementsConstructor.js";
import { loadingTexts, geoApi, key, weatherApi } from "./js/consts.js";

const cityForm = document.forms["city-form"];
const mainContainer = document.querySelector('main');
let loadingAnimation;
let banner;

// Создание прелоадера при загрузке страницы
createPreloader();

// Проверка и загрузка данных из localStorage при старте
initializeWeatherFromLocalStorage();

// Обработчик формы
cityForm.onsubmit = formHandler;

function createPreloader() {
    const preloader = document.createElement('div');
    const { preloaderStyle } = styles;
    styled(preloader, preloaderStyle);
    mainContainer.appendChild(preloader);

    loadingAnimation = new LoadingAnimation(preloader, loadingTexts, 300);
}

function removePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.remove();
    }
}

// Инициализация данных из localStorage
function initializeWeatherFromLocalStorage() {
    const savedWeather = localStorage.getItem('weather');
    if (savedWeather) {
        const resultWeather = JSON.parse(savedWeather);
        console.log("Loaded from localStorage:", resultWeather);
        mainContainer.appendChild(createWeatherCard(resultWeather));
    }else{
        banner = createElement('h2')
        styled(banner, styles.bannerStyle);
        banner.innerText = `dont foget insert city`;
        mainContainer.appendChild(banner);
    }
}

// Обработчик формы
async function formHandler(e) {
    e.preventDefault();
    
    let city = e.target.city.value.trim().toLowerCase();  // Приводим название города к нижнему регистру и удаляем лишние пробелы
    
    const savedWeather = localStorage.getItem('weather');
    let lastCity = null;
    
    // Если есть сохраненные данные о погоде, извлекаем название города и нормализуем его
    if (savedWeather) {
        const parsedWeather = JSON.parse(savedWeather);
        lastCity = parsedWeather.cityName.toLowerCase().trim();  // Нормализуем название сохраненного города
    }

    // Проверяем, валидно ли название города и отличается ли оно от последнего сохраненного города
    if (city.length > 3 && city !== lastCity) {
        if (banner) banner.remove();  // Убираем баннер, если он есть
        loadingAnimation.start();  // Запускаем анимацию загрузки

        try {
            const data = await getCityWeather(city);  // Получаем данные о погоде
            if (data) {
                const weatherData = new WeatherData(data, city);  // Создаем новый объект WeatherData
                weatherData.setDataToLocalStorage();  // Сохраняем данные в localStorage

                mainContainer.innerHTML = "";  // Очищаем предыдущие данные на странице

                const weather = localStorage.getItem('weather');
                const resultWeather = JSON.parse(weather);  // Извлекаем сохраненные данные о погоде
                console.log(resultWeather);
                mainContainer.appendChild(createWeatherCard(resultWeather));  // Добавляем новую карточку с погодой
            }
        } catch (error) {
            e.target.city.placeholder = "have a big problems";
        } finally {
            loadingAnimation.stop();  // Останавливаем анимацию загрузки
            removePreloader();  // Убираем прелоадер
        }
    } else if (city === lastCity) {
        e.target.city.placeholder = "dont need to fetch";  // Уведомляем пользователя, что повторный запрос не нужен
    } else {
        e.target.city.placeholder = "insert correct city";  // Уведомляем пользователя, если введено некорректное название
    }

    e.target.city.value = "";  // Очищаем поле ввода после отправки формы
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
    const { cardStyle, iconStyle, compassStyle, titleStyle, temperatureStyle, windStyle, windDirectionStyle, windArrowStyle, speedStyle, mainStyle, descriptionStyle, coordinateStyle, humidityStyle, pressureStyle} = styles;
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

    const coordinate = createElement('span');
    coordinate.innerText = `lat ${data.coord.lat}: lon ${data.coord.lon} as ${data.country}`;
    styled(coordinate, coordinateStyle);

    const humidity = createElement('span');
    humidity.innerText = `humidity: ${data.humidity}%`;
    styled(humidity, humidityStyle);

    const pressure = createElement('span');
    pressure.innerText = `pressure : ${data.pressure}P`;
    styled(pressure, pressureStyle);


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

    card.append(title, icon, wind, temperature, speed, description, main, compass, coordinate, humidity, pressure)
    return card
}


