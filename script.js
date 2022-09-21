var today = new Date();
var cityFormEl = document.querySelector("#city-form");
var cityNameInputEl = document.querySelector("#cityname");
var currentWeatherEl = document.querySelector("#current-weather");
var currentWeatherCardEl = document.querySelector("#current-weather-card");
var fiveDayCardEl = document.querySelector("#five-day-card");
var fiveDayEl = document.querySelector("#five-day-body");
var weatherStatusEl = document.querySelector("#weather-status");
var searchEl = document.querySelector("#search");
var historyButtonsEl = document.querySelector("#history-buttons");
var historyCardEl = document.querySelector("#history");
var trashEl = document.querySelector("#trash");
var searchHistoryArray = [];


var formSubmitHandler = function(event) {
    event.preventDefault();
    
    var cityname = cityNameInputEl.value.trim();

    if (cityname) {
        searchHistoryArray.push(cityname);
        localStorage.setItem("weatherSearch", JSON.stringify(searchHistoryArray));

        var searchHistoryEl = document.createElement("button");
        searchHistoryEl.className = "btn";
        searchHistoryEl.setAttribute("data-city", cityname)
        searchHistoryEl.innerHTML = cityname;
        historyButtonsEl.appendChild(searchHistoryEl);
        historyCardEl.removeAttribute("style");
        getWeatherInfo(cityname);
        cityNameInputEl.value = "";
    }
    else {
        alert("Please enter a city name");
    }
}

var getWeatherInfo = function (cityname) {
    var apiCityUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=imperial&appid=96df23e80d2fc7a334647a8dedac1f8c";
    
    fetch(apiCityUrl)
        .then(function (cityResponse) {
            return cityResponse.json();
        })
        .then(function (cityResponse) {
            console.log(cityResponse)
            var latitude = cityResponse.coord.lat;
            var longitude = cityResponse.coord.lon;

            var city = cityResponse.name;
            var date = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
            var weatherIcon = cityResponse.weather[0].icon;
            var weatherDescription = cityResponse.weather[0].description;
            var weatherIconLink = "<img src='http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png' alt='" + weatherDescription + "' title='" + weatherDescription + "'  />"

            currentWeatherEl.textContent = "";
            fiveDayEl.textContent = "";

            weatherStatusEl.innerHTML = city + "(" + date +") " + weatherIconLink;

            currentWeatherCardEl.classList.remove("hidden");
            fiveDayCardEl.classList.remove("hidden");

            return fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=alerts,minutely,hourly&units=imperial&appid=96df23e80d2fc7a334647a8dedac1f8c');
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            console.log(response);
            displayWeather(response);
        });
};


var displayWeather = function (weather) {
    if (weather.length === 0) {
        weatherContainerEl.textContent = "No weather data found.";
        return;
    }

    var temperature = document.createElement("p");
    temperature.id = "temperature";
    temperature.innerHTML = "<strong>Temperature:</strong>" + weather.current.temp.toFixed(1) + "°F";
    currentWeatherEl.appendChild(temperature);

    var humidity = document.createElement("p");
    humidity.id = "humidity";
    humidity.innerHTML = "<strong>Humidity:</strong>" + weather.current.humidity + "%";
    currentWeatherEl.appendChild(humidity);

    var windSpeed = document.createElement("p");
    windSpeed.id = "wind-speed";
    windSpeed.innerHTML = "<strong>Wind Speed:</strong>" + weather.current.wind_speed.toFixed(1) + "MPH";
    currentWeatherEl.appendChild(windSpeed);

    var forecastArray = weather.daily;

    for (let i = 0; i < forecastArray.length - 3; i++) {
        var date = (today.getMonth() + 1) + "/" + (today.getDate() + i + 1) + "/" + today.getFullYear();
        var weatherIcon = forecastArray[i].weather[0].icon;
        var weatherDescription = forecastArray[i].weather[0].description;
        var weatherIconLink = "<img src='http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png' alt='" + weatherDescription + "' title='" + weatherDescription + "'  />"
        var dayEl = document.createElement("div");
        dayEl.className = "day";
        dayEl.innerHTML = "<p><strong>" + date + "</strong></p>" + "<p>" + weatherIconLink + "</p>" + "<p><strong>Temp:</strong>" + forecastArray[i].temp.day.toFixed(1) + "°F</p>" + "<p><strong>Humidity:</strong>" + forecastArray[i].humidity + "%</p>"

        fiveDayEl.appendChild(dayEl);
    }
}


var loadHistory = function () {

    searchArray = JSON.parse(localStorage.getItem("weatherSearch"));
    
    if (searchArray) {
    searchHistoryArray = JSON.parse(localStorage.getItem("weatherSearch"));
    for (let i = 0; i < searchArray.length; i++) {
        var searchHistoryEl = document.createElement("button");
        searchHistoryEl.className = "btn";
        searchHistoryEl.setAttribute("data-city", searchArray[i]);
        searchHistoryEl.innerHTML = searchArray[i];
        historyButtonsEl.appendChild(searchHistoryEl);
        historyCardEl.removeAttribute("style");
    }
}

};

var buttonClickHandler = function (event) {
    var cityname = event.target.getAttribute("data-city");
    if (cityname) {
        getWeatherInfo(cityname);
    }
}

var clearHistory = function (event) {
    localStorage.removeItem("weatherSearch");
    historyCardEl.setAttribute("style", "display:none");
}

cityFormEl.addEventListener("submit", formSubmitHandler);
historyButtonsEl.addEventListener("click", buttonClickHandler);
trashEl.addEventListener("click", clearHistory);

loadHistory();