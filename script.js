const cityForm = document.forms["city-form"];
const key = 'b10a1709279e52171ae6535fa8b02312';
const geoApi = 'http://api.openweathermap.org/geo/1.0/direct';
const weatherApi = 'http://api.openweathermap.org/data/2.5/weather'; // Use Current Weather API

cityForm.onsubmit = formHandler;

async function formHandler(e) {
    e.preventDefault();
    let city = e.target.city;
    
    const { lat, lon } = await getCityCoordinates(city.value);
    
    if (lat && lon) {
        const weatherData = await fetchWeatherData(lat, lon);
        console.log(weatherData);
    } else {
        console.error("City not found.");
    }

    city.value = "";
}

async function getCityCoordinates(city) {
    try {
        const response = await fetch(`${geoApi}?q=${city}&limit=1&appid=${key}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
            return { lat: data[0].lat, lon: data[0].lon };
        }
    } catch (error) {
        console.error("Error fetching city coordinates:", error);
    }
    return {};
}

async function fetchWeatherData(lat, lon) {
    try {
        const response = await fetch(`${weatherApi}?lat=${lat}&lon=${lon}&appid=${key}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}
