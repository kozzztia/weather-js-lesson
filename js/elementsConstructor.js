class WeatherData {
    constructor(data, city) {
        this.cityName = city;
        this.coord = data.coord;
        this.dateForRestart = this.getDateForRestart();
        this.country = data.sys.country;
        this.icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
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
        now.setMinutes(now.getMinutes() + 2);
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

export {LoadingAnimation , WeatherData}
