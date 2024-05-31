//get event data from local storage
var eventData = JSON.parse(localStorage.getItem('SLCeventData'));
console.log(eventData);  //event object saved in local storage

    const eventTitle = document.getElementById('event-title');
    const eventImage = document.getElementById('event-image'); //I created a variable to store information
    const eventDescription = document.getElementById('des-container'); //I created a variable to store information
    const seatMap = document.getElementById('seat-map-container'); //I created a variable to store information
    const buyButton = document.getElementById('buyButton');
    const venue = document.getElementById('venue-container');
    
    const eventTitleInfo = document.createElement("p");
    eventTitleInfo.textContent = eventData.name;
    eventTitle.append(eventTitleInfo);

    eventImage.setAttribute('src',eventData.images[2].url);

    const venueAddress = document.createElement('p');
    const venueAddress2 = document.createElement('p');
    venueAddress.textContent = eventData._embedded.venues[0].address.line1;
    venueAddress2.textContent = `${eventData._embedded.venues[0].city.name}, UT ${eventData._embedded.venues[0].postalCode}`;
    venue.append(venueAddress);
    venue.append(venueAddress2);

    buyButton.setAttribute('onclick',`window.open('${eventData.url}');`);
    
    const seatMapImage = document.createElement('img');
    if (typeof eventData.seatmap !== "undefined") {
        seatMapImage.setAttribute('src', eventData.seatmap.staticUrl);
    } else {seatMapImage.setAttribute('src', "./assets/images/noSeatMap.png");}
    seatMap.append(seatMapImage);
//This code is for adding various pieces of information found scattered throughout the API------------------------------------------------
    const addlInfo = document.getElementById("info-container");

    function populateAddlInfo (data) {
        const newInfo = document.createElement('p');
        newInfo.textContent = data;
        addlInfo.append(newInfo);
    }
    if (typeof (eventData.ticketLimit) !== "undefined") {
        populateAddlInfo(eventData.ticketLimit.info);
    }

    if (typeof (eventData.info) !== "undefined") {
        populateAddlInfo(eventData.info);
    }
//End code for adding additional information-----------------------------------------------------------------------------------------------

//Get weather data for the event-----------------------------------------------------------------------------------------------------------
const eventLat = eventData._embedded.venues[0].location.latitude;
const eventLon = eventData._embedded.venues[0].location.longitude;
var weatherData;
//API call to tomorrow.io
fetch(`https://api.tomorrow.io/v4/weather/forecast?location=${eventLat},${eventLon}&apikey=9UR5HLWZ6gE10koL7Qpj4zjCsx4NRnCK`)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        compareDates(data);
    })
//Compare event date with forecast data to get correct information
function compareDates(data) {
    weatherData = data;
    var forecastArray = data.timelines.hourly;
    var eventStart = dayjs(eventData.dates.start.dateTime).format('YYYY-MM-DD HH:00');  //minutes rounded down to :00 for forecast purposes
    var index = -1;
    for (i=0;i<forecastArray.length;i++) {
        var forecastTime = dayjs(forecastArray[i].time).format('YYYY-MM-DD HH:mm');
        if (eventStart === forecastTime) {index = i;}
    }
    renderWeather(forecastArray, index)
}
function renderWeather(forecastArray, index) {
    var weatherEl = document.getElementById('weather-container');
    //if the event selected is more than 5 days in the future, the forecast for the event
    //is not available.  Therefore, the current weather conditions are shown instead.
    if (index === -1) {
        const futureAlert = document.createElement('p');
        futureAlert.textContent = "Forecast unavailable. Current conditions shown.";
        weatherEl.append(futureAlert);
        index = 0;
    }
    //weatherCode descriptions
    const weatherCode = {
        0: 'Unknown',
        1000 : "Clear, Sunny",
        1100: "Mostly Clear",
        1101: "Partly Cloudy",
        1102: "Mostly Cloudy",
        1001: "Cloudy",
        2000: "Fog",
        2100: "Light Fog",
        4000: "Drizzle",
        4001: "Rain",
        4200: "Light Rain",
        4201: "Heavy Rain",
        5000: "Snow",
        5001: "Flurries",
        5100: "Light Snow",
        5101: "Heavy Snow",
        6000: "Freezing Drizzle",
        6001: "Freezing Rain",
        6200: "Light Freezing Rain",
        6201: "Heavy Freezing Rain",
        7000: "Ice Pellets",
        7101: "Heavy Ice Pellets",
        7102: "Light Ice Pellets",
        8000: "Thunderstorm"
    };
    //Define weather data types
    var humidityData = forecastArray[index].values.humidity;
    var temperatureData = Math.round((forecastArray[index].values.temperature) * (9/5) + 32); //converted to Fahrenheit and rounded
    var windSpeedData = Math.round(forecastArray[index].values.windSpeed * 2.237);  //converted to MPH and rounded
    var eventWeatherData = weatherCode[forecastArray[index].values.weatherCode];
    var iconData = `./assets/images/icons/${forecastArray[index].values.weatherCode}.png`;
    //create elements
    var weatherContainer = document.createElement('div');
    var weatherIcon = document.createElement('img');
    var weatherTemp = document.createElement('h1')
    var weatherCond = document.createElement('h2');
    var weatherWind = document.createElement('p');
    var weatherHum = document.createElement('p');
    //set content of these elements
    weatherIcon.setAttribute('src', iconData);
    weatherTemp.textContent = `${temperatureData}° F`;
    weatherCond.textContent = eventWeatherData;
    weatherWind.textContent = `Wind: ${windSpeedData} MPH`;
    weatherHum.textContent = `Humidity: ${humidityData}%`;
    //render to page
    weatherContainer.append(weatherIcon);
    weatherContainer.append(weatherTemp);
    weatherContainer.append(weatherCond);
    weatherContainer.append(weatherWind);
    weatherContainer.append(weatherHum);
    weatherEl.append(weatherContainer);
}
//end weather API call code----------------------------------------------------------------------------------------------------------------

//Get information for map------------------------------------------------------------------------------------------------------------------
const mapEl = document.getElementById('mapInfo')
const eventAddress = eventData._embedded.venues[0].address.line1;
const userlocation = navigator.geolocation.getCurrentPosition(success);
var userLat;
var userLon;

function success(position) {
    userLat = position.latitude;
    userLon = position.longitude;
}

const mapLink = `https://www.google.com/maps/embed/v1/directions?origin=${userLat},${userLon}&destination=${eventAddress},+Salt+Lake+City,+UT,+USA&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`;
mapEl.setAttribute('src', mapLink);
//end information for map------------------------------------------------------------------------------------------------------------------