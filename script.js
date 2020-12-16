
let currentDay = moment().format('L'); 
let citySearch = [];

$("#searchButton").on('click', function(event){
    event.preventDefault();

    let queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + $('.userInput').val() + "&appid=984c41e22d016a17febb9302c3224c83";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);

        let cityName = response.city.name;
        $("#cityDisplay").text(cityName + " " + "(" + currentDay + ")");
    
        let currTemp = response.list[0].main.temp; 
        let convertedTemp = ((currTemp - 273.15) * (9 / 5) + 32).toFixed(1);
        $("#temperatureDisplay").text("Temperature: " + convertedTemp + " \u00B0F");

        let currentHumidity = response.list[0].main.humidity;
        $("#humidityDisplay").text("Humidity: " + currentHumidity + "%");

        let windSpeed = (response.list[0].wind.speed).toFixed(1);
        $("#windSpeedDisplay").text("Wind Speed: " + windSpeed + " MPH");

    })

    if (localStorage.getItem('myCities') !== null) {
        citySearch.push($('.userInput').val());
        localStorage.setItem('myCities', JSON.stringify(citySearch));
    }
    getItems()
}) 
 
function getItems(){
    if (localStorage.getItem('myCities') !== null) {
    let mySearch = JSON.parse(localStorage.getItem('myCities'));
   
    for (let i = 0; i < mySearch.length; i++){
        let displayDiv = $('<div>');
        displayDiv.addClass("search-div")
        displayDiv.text(mySearch[i]);
        $("#searchHistory").append(displayDiv)
    } 

    }
}

getItems()



