//get event data from local storage
var eventData = JSON.parse(localStorage.getItem('SLCeventData'));
console.log(eventData);  //Remove this line after Ricardo is complete with the page rendering <-----------------------------------------------------

function populateEvent(event) {
    const eventImage = document.getElementById('event-image'); //I created a variable to store information
    const eventDescription = document.getElementById('event-description'); //I created a variable to store information
    const eventVideo = document.getElementById('event-video'); //I created a variable to store information

    // get the fisrt image using the index 0
    if (event.images && event.images.length > 0) {
        eventImage.src = event.images[0].url;
        eventImage.alt = event.name || 'Event Image';
    } else {
        eventImage.src = ''; // path to a placeholder image
        eventImage.alt = 'Placeholder Image';
    }

    // shows the description of the event
    eventDescription.textContent = event.info || 'No description available.';

    // if we get a URL from youtube shows a video using the index 0
    if (event.externalLinks && event.externalLinks.youtube && event.externalLinks.youtube.length > 0) {
        const youtubeUrl = event.externalLinks.youtube[0].url;
        const videoElement = document.createElement('iframe');
        videoElement.src = youtubeUrl;
        videoElement.width = '100%';
        videoElement.height = '200px';
        videoElement.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        videoElement.allowFullscreen = true;

        eventVideo.innerHTML = ''; // clear the previus content
        eventVideo.appendChild(videoElement);
    } else {
        eventVideo.textContent = 'No video available';
    }
}

//Get weather data for the event-----------------------------------------------------------------------------------------------------------
const eventZip = `${eventData._embedded.venues[0].postalCode} US`;
var weatherData;
//API call to tomorrow.io
fetch(`https://api.tomorrow.io/v4/weather/forecast?location=${eventZip}&apikey=9UR5HLWZ6gE10koL7Qpj4zjCsx4NRnCK`)
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
    var weatherEl = document.getElementById('weather-container');  //need this created in HTML  <----------------------------------------
    //if the event selected is more than 5 days in the future, the forecast for the event
    //is not available.  Therefore, the current weather conditions are shown instead.
    console.log(index);
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
    weatherWind.textContent = `${windSpeedData} MPH`;
    weatherHum.textContent = `${humidityData}%`;
    //render to page
    weatherContainer.append(weatherIcon);
    weatherContainer.append(weatherTemp);
    weatherContainer.append(weatherCond);
    weatherContainer.append(weatherWind);
    weatherContainer.append(weatherHum);
    weatherEl.append(weatherContainer);
}
//end weather API call code----------------------------------------------------------------------------------------------------------------
