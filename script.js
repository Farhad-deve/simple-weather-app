const API_URL = "https://api.openweathermap.org/data/2.5/weather?q=Nukus&units=metric&APPID=a045a1a5356155dc5712ab1318762afa"
const API_ICONS = "https://openweathermap.org/payload/api/media/file/10d@2x.png"

const weatherIcon = document.getElementById('weather-icon');
const mainContainer = document.querySelector('main');
const forecastContainer = document.getElementById('forecast-container');

const cityCountryTime = document.getElementById('city-country-time');
const currentTempAndDescription = document.getElementById('current-temp-and-description');
const IconAndDetails = document.getElementById('icon-and-details');

const loadingElem = document.querySelectorAll('#loading');

const form = document.querySelector('form');
const getWeatherNukusBtn = document.getElementById('get-weather-nukus');



async function getWeather(city) {
    try {
        loading(true);

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=a045a1a5356155dc5712ab1318762afa`);
        const data = await response.json();

        if (response.status !== 200) {
            throw new Error(data.message);
        }

        const responseForecast = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=a045a1a5356155dc5712ab1318762afa`);
        const dataForecast = await responseForecast.json();
        const filteredForecast = dataForecast.list.filter(item => item.dt_txt.includes('12:00:00'));

        loading(false)
        showInfos(data, filteredForecast);

    } catch (error) {
        console.log(error);
        errorMsg(error.message);
    }
}

async function getCity(lat, long) {
    try {
        loading(true)
        const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`);
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message);
        }

        loading(false)
        getWeather(data.city)
        
    } catch (error) {
        console.log(error)
    }
}

function showInfos(data, forecast) {
    updateBackground(data);

    const IconToFilter = data.weather[0].icon;
    const filteredIcon = filterIcons(IconToFilter);
    const date = new Date().toLocaleTimeString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    currentTempAndDescription.innerHTML = `
        <!-- Current Temp -->
        <h1 class="text-[clamp(3rem,5vw,6rem)] font-[300]" id="current-temp">${data.main.temp}</h1>
        <div class="flex flex-col">
            <div>
                <span class="font-[500] text-[clamp(1.3rem,1.5vw,2rem)]">°C</span>
                <span class="font-[300] text-[clamp(1.3rem,1.5vw,2rem)]">| °F</span>
            </div>
            <!-- Description -->
            <p class="font-[500] capitalize text-[clamp(0.9rem,1.2vw,1.3rem)]">${data.weather[0].description}</p>
        </div>
    `
    IconAndDetails.innerHTML = `
        <!-- Weather Icon -->
        <img src="${filteredIcon}" alt="" id="weather-icon" class="w-[clamp(10rem,15vw,15rem)] pointer-events-none">

        <!-- Weather Details -->
        <div class="flex flex-col gap-[0.5rem]">
            <p class="flex items-center gap-[0.5rem]">
                <span>
                    <img src="assets/icons/feels-like.svg" alt="">
                </span>
                <span id="feels-like">Feels like: ${data.main.feels_like} °C</span>
            </p>

            <p class="flex items-center gap-[0.5rem]">
                <span>
                    <img src="assets/icons/humidity.svg" alt="">
                </span>
                <span id="humidity">Humidity: ${data.main.humidity}%</span>
            </p>

            <p class="flex items-center gap-[0.5rem]">
                <span>
                    <img src="assets/icons/wind.svg" alt="">
                </span>
                <span id="wind-speed">Wind: ${data.wind.speed} km/h</span>
            </p>
        </div>
    `
    cityCountryTime.innerHTML = `
        <h1 class="text-[clamp(1.5rem,2vw,2.5rem)] font-[600]">${data.name}</h1>
        <p class="text-[clamp(0.9rem,1vw,1.2rem)]">${date}</p>
    `

    forecastContainer.innerHTML = '';
    forecast.forEach(item => {
        const dayName = new Date(item.dt_txt).toLocaleDateString('en-US', {
            weekday: "long"
        })
        const icons = filterIcons(item.weather[0].icon);
        const tempMin = Math.round(item.main.temp_min);
        const tempMax = Math.round(item.main.temp_max);

        const forecastCard = document.createElement('div');
        forecastCard.classList.add('flex', 'flex-col', 'items-center', 'text-center', 'py-[0.5rem]', 'gap-[0.5rem]');
        forecastCard.innerHTML = `
            <p>${dayName}</p>
            <img src="${icons}" alt="Weather Icon" class="pointer-events-none">
            <p>
                <span>${tempMax}° </span>
                -
                <span>${tempMin}° </span>
            </p>
            <p class="capitalize text-[clamp(0.9rem,1vw,1.3rem)]">${item.weather[0].description}</p>
            `
        forecastContainer.appendChild(forecastCard);
    })
}

function filterIcons(icon) {
    switch (icon) {
        case "01d":
            return `assets/icons/weather-icons/animated/day.svg`;
            break;
        case "01n":
            return `assets/icons/weather-icons/animated/night.svg`;
            break;
        case "02d":
        case "03d":
            return `assets/icons/weather-icons/animated/cloudy-day-1.svg`;
            break;
        case "02n":
        case "03n":
            return `assets/icons/weather-icons/animated/cloudy-night-1.svg`;
            break;
        case "04d":
        case "04n":
            return `assets/icons/weather-icons/animated/cloudy.svg`;
            break;
        case "09d":
        case "09n":
            return `assets/icons/weather-icons/animated/rainy-6.svg`;
            break;
        case "10d":
        case "10n":
            return `assets/icons/weather-icons/animated/rainy-3.svg`;
            break;
        case "11d":
        case "11n":
            return `assets/icons/weather-icons/animated/thunder.svg`;
            break;
        case "13d":
        case "13n":
            return `assets/icons/weather-icons/animated/snowy-6.svg`;
            break;
        case "50d":
        case "50n":
            return `assets/icons/weather-icons/static/mist.png`;
            break;
    }
}

function loading(state) {
    if (state) {
        currentTempAndDescription.innerHTML = `<div id="loading" class="w-[15rem] h-[4rem] rounded-[12px] bg-[#fff]/[0.3]"></div>`
        IconAndDetails.innerHTML = `<div id="loading" class="w-[20rem] h-[10rem] rounded-[12px] bg-[#fff]/[0.3]"></div>`
        cityCountryTime.innerHTML = `<h1 class="text-[clamp(1.5rem,2vw,2.5rem)] font-[600]" id="loading">Loading...</h1>`
        forecastContainer.innerHTML = `<h1 class="text-[clamp(1.5rem,2vw.2.5rem)] font-[600]" id="loading">Loading...</h1>`
    } else {
        currentTempAndDescription.innerHTML = '';
        IconAndDetails.innerHTML = '';
        cityCountryTime.innerHTML = '';
        forecastContainer.innerHTML = '';
    }
}

function errorMsg(msg) {
    currentTempAndDescription.innerHTML = ``
    IconAndDetails.innerHTML = ``
    cityCountryTime.innerHTML = `<h1 class="italic text-[clamp(1.5rem,2vw,2.5rem)] font-[700]">City not found!</h1>`
    forecastContainer.innerHTML = '';
}

function updateBackground(data) {
    const description = data.weather[0].description;
    const isDay = data.weather[0].icon.includes('d');

    let imageUrl = "";

    if (isDay) {
        switch (description) {
            case "clear sky": imageUrl = "day-sky.jpg"; break;
            case "few clouds": imageUrl = "few-clouds.jpg"; break;
            case "scattered clouds": imageUrl = "scattered-clouds.jpg"; break;
            case "broken clouds": imageUrl = "broken-clouds.jpg"; break;
            case "overcast clouds": imageUrl = "overcast-clouds.jpg"; break;
            case "rain": imageUrl = "rain-sky.jpg"; break;
            case "thunderstorm": imageUrl = "thunderstorm.jpg"; break;
            case "light rain": imageUrl = "light-rain.jpg"; break;
            default: imageUrl = "day-sky.jpg";
        }
    } else {
        imageUrl = "night-sky-stars.jpg";
    }

    mainContainer.style.backgroundImage = `url('assets/images/${imageUrl}')`;
}


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = e.target.cityName.value.trim();
    if (city) {
        getWeather(city);
    } else {
        return;
    }
    form.reset();
});

getWeatherNukusBtn.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition((position) => {
        getCity(position.coords.latitude, position.coords.longitude);
    });
});

getWeather("Nukus");

