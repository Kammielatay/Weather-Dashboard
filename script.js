
let currentDay = moment().format('L'); 
let citySearch = [];

function call() {
    let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + $('.userInput').val() + "&appid=984c41e22d016a17febb9302c3224c83";

    

    //https://cors-anywhere.herokuapp.com/

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        let convertedTemp = ((response.list[0].main.temp - 273.15) * (9 / 5) + 32).toFixed(1);
        let windSpeed = (response.list[0].wind.speed).toFixed(1);

        $("#cityDisplay").text(response.city.name + " " + "(" + currentDay + ")");
        
        $("#temperatureDisplay").text("Temperature: " + convertedTemp + " \u00B0F");

        $("#humidityDisplay").text("Humidity: " + response.list[0].main.humidity + "%");

        $("#windSpeedDisplay").text("Wind Speed: " + windSpeed + " MPH");


         let uvQueryURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + response.city.coord.lat + "&lon=" + response.city.coord.lon + "&appid=984c41e22d016a17febb9302c3224c83"

        $.ajax({
            url: uvQueryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            let uvIndex = response.value
            console.log()
            
            if(uvIndex < 2.9){
                $('#uvIndexDisplay').text("UV Index: ").append("<span class='favorable'>" + uvIndex + '</span');
            } else if (uvIndex > 3.0 && uvIndex < 7.9) {
                $('#uvIndexDisplay').text("UV Index: ").append("<span class='moderate'>" + uvIndex + '</span');
            } else if (uvIindex > 8.0){
                $('#uvIndexDisplay').text("UV Index: ").append("<span class='severe'>" + uvIndex + '</span');
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