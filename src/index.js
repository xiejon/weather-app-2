import './styles.css';
// Background images
import DrizzleImg from './images/day/drizzle.jpg';
import RainImg from './images/day/rain.jpg'
import ThunderImg from './images/day/thunderstorm.jpg'
import ClearskyImg from './images/day/clear-sky.jpg';
import FewCloudsImg from './images/day/few-clouds.jpg';
import ScatterCloudsImg from './images/day/scattered-clouds.jpg';
import BrokenCloudsImg from './images/day/broken-clouds.jpg';
import OvercastImg from './images/day/overcast.jpg';
import SnowImg from './images/day/snow.jpg'
import NightClearskyImg from './images/night/night-clear-sky.jpg';
import NightCloudsImg from './images/night/night-clouds.jpg';
import NightRainImg from './images/night/night-rain.jpg';
import NightThunderImg from './images/night/night-thunderstorm.jpg';
import NightSnowImg from './images/night/night-snow.jpg';
// Weather icons
import SearchSvg from './icons/search.svg'
import ThermSvg from './icons/thermometer.svg'
import WindSvg from './icons/wind.svg'
import HumidSvg from './icons/droplet.svg'
import SunSvg from './icons/sun.svg'
import SnowSvg from './icons/cloud-snow.svg'
import DrizzleSvg from './icons/cloud-drizzle.svg'
import RainSvg from './icons/cloud-rain.svg'
import LightningSvg from './icons/cloud-lightning.svg'
import CloudSvg from './icons/cloud.svg'

const WeatherObj = () => {
    let celsius = false;
    return {
        celsius,
        async getUserLocation() {
            const success = position => position;
            const error = error => error;

            let promise = new Promise((resolve, reject) => {
                window.navigator.geolocation.getCurrentPosition(pos => {
                    resolve(success(pos));
                }, err => {
                    reject(error(err));
                });
            });

            return await promise;
        },
        async fetchLocation(city) {
            const raw = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=bb9a4a8b3762bb47a3b7ff329d10b88f`, {mode: 'cors'});
            return raw.json();
        },
        async fetchWeather(lat, lon) {
            const data = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=bb9a4a8b3762bb47a3b7ff329d10b88f`, {mode: 'cors'});
            return data.json();
        },
        convertTemp(kelvin) {
            // Kelvin -> Celcius/Fahrenheit rounded to nearest integer
            if (celsius) {
                return Math.round(kelvin - 273.15);
            } else {
                return Math.round((9/5) * (kelvin - 273.15) + 32);
            }
        },
        setCelsius() {
            this.celsius ? this.celsius = false : this.celsius = true;
        },
        convertDate(data) {
            const date = new Date((data.dt + data.timezone) * 1000);
            // Remove user's local time-zone
            return date.toUTCString();
        }
    }
}

const UI = () => {
    let nightMode = false;
    return {
        nightMode,
        showData(data) { 
            const weatherDesc = document.querySelector('.desc')
            const city = document.querySelector('.city')
            const locDate = document.querySelector('.local-date')
            const locTime = document.querySelector('.local-time')
            const mainTemp = document.querySelector('.main-temp')
            const feelsLike = document.querySelector('.feels-like')
            const wind = document.querySelector('.wind')
            const humid = document.querySelector('.humidity')

            const timestamp = WeatherObj().convertDate(data).substr(17, 5);
        
            weatherDesc.textContent = data.weather[0].description;
            city.textContent = data.name;
            locDate.textContent = WeatherObj().convertDate(data).substring(0, 17);
            locTime.textContent = timestamp;
            mainTemp.textContent = `°${WeatherObj().convertTemp(data.main.temp)}`;
            feelsLike.textContent = WeatherObj().convertTemp(data.main.feels_like);
            wind.textContent = data.wind.speed;
            humid.textContent = data.main.humidity;

            // Change to night mode between 8pm and 7am
            if (parseInt(timestamp) < 7 || parseInt(timestamp) > 20) {
                this.nightMode = true;
            } else {
                this.nightMode = false;
            }

            // test
            const weatherId = data.weather[0].id;
            this.setImages(weatherId)

            this.setSidebarIcons()
        }, 
        setSidebarIcons() {
            const box1 = document.querySelector('.extra .box:nth-child(1)')
            const box2 = document.querySelector('.extra .box:nth-child(2)')
            const box3 = document.querySelector('.extra .box:nth-child(3)')

            const feelsLike = document.createElement('img')
            const wind = document.createElement('img')
            const humid = document.createElement('img')

            feelsLike.src = ThermSvg;
            wind.src = WindSvg;
            humid.src = HumidSvg;

            box1.append(feelsLike);
            box2.append(wind);
            box3.append(humid);
        },
        createDefaultBackground() {
            const container = document.querySelector('.container')

            const img = document.createElement('img');
            img.classList.add('background');
            img.src = NightClearskyImg
            container.append(img);
        },
        createDefaultSvg() {
            const div = document.querySelector('.svg-div')

            const svg = document.createElement('img')
            svg.classList.add('main-svg');
            svg.src = CloudSvg
            div.append(svg);
        },
        setBgImage(link) {
            const img = document.querySelector('.background');

            if (link) {
                img.setAttribute("src", link)
            } else {
                this.createDefaultBackground();
            }
        },
        setIcon(link) {
            const svg = document.querySelector('.main-svg')
            
            if (link) {
                svg.setAttribute("src", link)
            } else {
                this.createDefaultSvg();
            }
        },
        setImages(id) {
            // Default background & icon
            this.createDefaultBackground();
            this.createDefaultSvg();

            if (this.nightMode) {
                if (id >= 200 && id <= 232) this.setBgImage(NightThunderImg);
                if (id >= 300 && id <= 531) this.setBgImage(NightRainImg);
                if (id >= 600 && id <= 622) this.setBgImage(NightSnowImg);
                if (id === 800) this.setBgImage(NightClearskyImg);
                if (id >= 801 && id <= 804) this.setBgImage(NightCloudsImg);
            } else {
                if (id >= 200 && id <= 232) this.setBgImage(ThunderImg);
                if (id >= 300 && id <= 321) this.setBgImage(DrizzleImg);
                if (id >= 500 && id <= 531) this.setBgImage(RainImg);
                if (id >= 600 && id <= 622) this.setBgImage(SnowImg);
                if (id === 800) this.setBgImage(ClearskyImg);
                if (id === 801) {
                    this.setBgImage(FewCloudsImg);
                    this.setIcon(CloudSvg);
                }
                if (id === 802) this.setBgImage(ScatterCloudsImg);
                if (id === 803) this.setBgImage(BrokenCloudsImg);
                if (id === 804) this.setBgImage(OvercastImg);
            }
        }
    }
}

// Get temp at user location
async function getWeather(city) {
    const newWidget = WeatherObj();
    let location;
    let lat;
    let lon;

    if (!city) {
        // Default location
        location = await newWidget.getUserLocation();
        lat = location.coords.latitude;
        lon = location.coords.longitude;
    } else {
        location = await newWidget.fetchLocation(city);
        lat = location[0].lat;
        lon = location[0].lon;
    }

    const weather = await newWidget.fetchWeather(lat, lon);

    const newUI = UI();
    newUI.showData(weather);

    console.log(weather)
}

getWeather('hamburg');
