
// getting current date
let currentDay = moment().format('L'); 
let citySearch = [];


function getWeather(cityName) {
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=984c41e22d016a17febb9302c3224c83";
    $('.clear').html('')
   
    // ajax call to get current weather conditions
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // getting and setting current weather display
        let convertedTemp = ((response.main.temp - 273.15) * (9 / 5) + 32).toFixed(1);
        let windSpeed = (response.wind.speed).toFixed(1);

        let weatherIcon = $('<img class="icon">');
        weatherIcon.attr("src", "https://openweathermap.org/img/wn/" + response.weather[0].icon + ".png")


        $("#cityDisplay").text(response.name + " " + "(" + currentDay + ")").append(weatherIcon);
        
        $("#temperatureDisplay").text("Temperature: " + convertedTemp + " \u00B0F");

        $("#humidityDisplay").text("Humidity: " + response.main.humidity + "%");

        $("#windSpeedDisplay").text("Wind Speed: " + windSpeed + " MPH");

        // ajax one call for UV Index
        let oneCallQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&appid=984c41e22d016a17febb9302c3224c83"

        $.ajax({
            url: oneCallQueryURL,
            method: "GET"
        }).then(function (response) {
            // getting and setting the UV index
            let uvIndex = response.current.uvi

            if(uvIndex < 2.9){
                $('#uvIndexDisplay').text("UV Index: ").append("<span class='favorable'>" + uvIndex + '</span');
            } else if (uvIndex > 3.0 && uvIndex < 7.9) {
                $('#uvIndexDisplay').text("UV Index: ").append("<span class='moderate'>" + uvIndex + '</span');
            } else if (uvIindex > 8.0){
                $('#uvIndexDisplay').text("UV Index: ").append("<span class='severe'>" + uvIndex + '</span');
            }

            //setting the 5-day forecast

            $('#forecast-header').text("5-Day Forecast:");

            let days = ['day-1', 'day-2', 'day-3', 'day-4', 'day-5']

            for (let i = 1; i < days.length +1 ; i++) {
                
                let cardDiv = $('<div class="card col">');
                let dayHeader = $('<p class="next-day">');
                let dayIcon = $('<img class="icon">');
                let dayTemp = $('<p class="temp">');
                let dayHumidity = $('<p class="humid">');

                let tempConvert = ((response.daily[i].temp.day - 273.15) * (9 / 5) + 32).toFixed(1);
                let timestamp = response.daily[i].dt * 1000;
                
                const d = new Date(timestamp);
                date = d.toDateString();

                
                dayHeader.text(date)
                dayIcon.attr("src", "https://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon +".png");
                dayTemp.text("Temp: " + tempConvert + " \u00B0F");
                dayHumidity.text("Humidity: " + response.daily[i].humidity + "%");


                $('.forecast-display').append(cardDiv);
                cardDiv.append(dayHeader, dayIcon, dayTemp, dayHumidity);

            }
    })
    
    })
}
// getting items from the local storage to display as buttons on page
function getItems() {
    if (localStorage.getItem('myCities') !== null) {
        let mySearch = JSON.parse(localStorage.getItem('myCities'));
        

        for (let i = 0; i < mySearch.length; i++) {
            let displayDiv = $('<button>');
            displayDiv.addClass("search-btn");
            displayDiv.text(mySearch[i]);
            displayDiv.attr('value', mySearch[i]);
            $("#searchHistory").append(displayDiv);
            
        }
        
    }
}
getItems();

// adding functionality to search button
$("#searchButton").on('click', function(event){
    event.preventDefault();

    let cityName = $('.userInput').val()
    
    getWeather(cityName);

    if (localStorage.getItem('myCities') !== null) {
        let existing = JSON.parse(localStorage.getItem('myCities'));
        existing.push(cityName);
        localStorage.setItem('myCities', JSON.stringify(existing));
        
    } 
     else if (localStorage.getItem('myCities') === null){
        citySearch.push(cityName);
        localStorage.setItem('myCities', JSON.stringify(citySearch));
    }
    
}) 

// starting a new search
$('#new-search').on('click', function(){
    location.reload();
})

// clearing the history from local storage
$('#clear-history').on('click', function(){
    localStorage.clear();
    location.reload();
})

// search history button click
$('.search-btn').on('click', function(){
    cityName = $(this).val();
    getWeather(cityName);
    $('.clear').html('');
      
})