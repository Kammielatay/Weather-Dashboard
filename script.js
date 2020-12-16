
// getting current date
let currentDay = moment().format('L'); 
let citySearch = [];

function call() {
    let queryURL = "https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?q=" + $('.userInput').val() + "&appid=984c41e22d016a17febb9302c3224c83";


   
    // ajax call to get current weather conditions
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        let convertedTemp = ((response.main.temp - 273.15) * (9 / 5) + 32).toFixed(1);
        let windSpeed = (response.wind.speed).toFixed(1);

        $("#cityDisplay").text(response.name + " " + "(" + currentDay + ")");
        
        $("#temperatureDisplay").text("Temperature: " + convertedTemp + " \u00B0F");

        $("#humidityDisplay").text("Humidity: " + response.main.humidity + "%");

        $("#windSpeedDisplay").text("Wind Speed: " + windSpeed + " MPH");

        // ajax one call for UV Index
        let oneCallQueryURL = "https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/onecall?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&appid=984c41e22d016a17febb9302c3224c83"

        $.ajax({
            url: oneCallQueryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            // getting and setting the UV index
            let uvIndex = response.current.uvi
            console.log()
            
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
                
                let cardDiv = $('<div class="card col">')
                let dayHeader = $('<p class="next-day">')
                let dayTemp = $('<p class="temp">')
                let dayHumidity = $('<p class="humid">')

                let tempConvert = ((response.daily[i].temp.day - 273.15) * (9 / 5) + 32).toFixed(1)
                let timestamp = response.daily[i].dt * 1000
                
                const d = new Date(timestamp);
                date = d.toDateString();
                console.log(date);
        

                dayHeader.text(date)
                dayTemp.text("Temp: " + tempConvert + " \u00B0F")
                dayHumidity.text("Humidity: " + response.daily[i].humidity + "%")

                $('.forecast-display').append(cardDiv)
                cardDiv.append(dayHeader)
                cardDiv.append(dayTemp)
                cardDiv.append(dayHumidity)


            }

    })
    
    })
}

function getItems() {
    if (localStorage.getItem('myCities') !== null) {
        let mySearch = JSON.parse(localStorage.getItem('myCities'));

        for (let i = 0; i < mySearch.length; i++) {
            let displayDiv = $('<div>');
            displayDiv.addClass("search-div")
            displayDiv.text(mySearch[i]);
            $("#searchHistory").append(displayDiv)

        }
      
    }
}

getItems()


$("#searchButton").on('click', function(event){
    event.preventDefault();
    
    call();

    let value = $('.userInput').val()

    if (localStorage.getItem('myCities') !== null) {
        let existing = JSON.parse(localStorage.getItem('myCities'));
        existing.push(value)
        localStorage.setItem('myCities', JSON.stringify(existing))
        
    } 
     else if (localStorage.getItem('myCities') === null){
        citySearch.push(value);
        localStorage.setItem('myCities', JSON.stringify(citySearch));
    }
    
}) 

$('#new-search').on('click', function(){
    location.reload();
})

$('#clear-history').on('click', function(){
    localStorage.clear();
    location.reload();
})