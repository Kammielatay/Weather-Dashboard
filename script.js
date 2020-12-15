

$("#searchButton").on('click', function(event){
    event.preventDefault();

    let queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + $('.userInput').val() + "&appid=984c41e22d016a17febb9302c3224c83"

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);

        let cityName = response.city.name;
        console.log(cityName);
        
        let currTemp = response.list[0].main.temp; 
        console.log(currTemp);

        let windSpeed = response.list[0].wind.speed;
        console.log(windSpeed)

        let currentHumidity = response.list[0].main.humidity;
        console.log(currentHumidity)


})

})