// using this we can store local storage search value in one array 
var citySearches = [];
// initial function
function init() {
  var citySearchStorage = JSON.parse(localStorage.getItem("citySearchStorage"));
  if (citySearchStorage !== null) {
    citySearches = citySearchStorage;
  }
}
// function for store data in local storage 
function storeCities() {
  // citySearches Array to local Storage
  localStorage.setItem("citySearchStorage", JSON.stringify(citySearches));
}

  var apikey = "7714009117e479094fd9e422bd32ba6c";

function weatherData(city) {
  //api link forCurrent Forecast 
  var queryUrlCurrentForecast ="https://api.openweathermap.org/data/2.5/weather?q=" + city +"&units=imperial&appid=" +apikey;

  $.ajax({
    url: queryUrlCurrentForecast,
    method: "GET",
  }).then(function (response) {
    var currentDate = moment().format("MMM Do YY");
    var currentCity = "<h2>" + city + " " + " (" + currentDate + ")</h2>";
    var currentTemp = "<h5> Temperature: " + response.main.temp + " °F</h5>";
    var currentHumidity = "<h5>Humidty: " + response.main.temp + " %</h5>";
    var currentWindspeed = "<h5>Wind Speed: " + response.wind.speed + " MPH</h5>";
    var long = response.coord.lon;
    var lat = response.coord.lat;
      $("#current-conditions").append(currentCity);
      $("#current-conditions").append(currentTemp);
      $("#current-conditions").append(currentHumidity);
      $("#current-conditions").append(currentWindspeed);
    // api link for UV index 
      var queryUrlUvIndex ="https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + long + "&appid=" + apikey;

      $.ajax({
      url: queryUrlUvIndex,
      method: "GET",
      }).then(function (responseUv) {
      //Apend Current UV Index
    
      var uvIndex = "<h5>UV Index: " + responseUv.value + "</h5>";
        $("#current-conditions").append(uvIndex);
      });
    //Five Day Forecast Data Conditions
      var queryUrlFiveDay = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=hourly&units=imperial&appid=" + apikey;

      $.ajax({
        url: queryUrlFiveDay,
        method: "GET",
      }).then(function (responseFiveDay) {
      //appending the five day forecast elements
      for (var i = 0; i < 5; i++) {
        var forecastConainter = $("#" + i);
        var forecastDate = "<h6>" + moment(responseFiveDay.daily[i].dt * 1000).format("DD MMM YYYY") + "</h6>";
       // link for the weather wedget which is used for sun and cloud images 
        var forecastImageUrl = "https://openweathermap.org/img/wn/" + responseFiveDay.daily[i].weather[0].icon +"@2x.png";
        var forecastTemp = "<h6>Temp: " + responseFiveDay.daily[i].temp.day +" °F</h6>";
        var forecastHumid = "<h6>Humidity: " + responseFiveDay.daily[i].humidity +" %</h6>";
      
        forecastConainter.append(forecastDate);
        $("<img />", { src: forecastImageUrl }).appendTo(forecastConainter);
        forecastConainter.append(forecastTemp);
        forecastConainter.append(forecastHumid);
      
      }
    });
  });
}
// function to clear the forecast 
function clearForecasts() {
  $("#current-conditions").empty();
  $("#0").empty();
  $("#1").empty();
  $("#2").empty();
  $("#3").empty();
  $("#4").empty();
}
 // on click fonction for city search
$("#search-button").on("click", function (event) {
  event.preventDefault();
  var searchCity = $("#city-input").val().trim();
  clearForecasts();
  weatherData(searchCity);
  citySearches.push(searchCity);

  storeCities();
  recentSearches();
});
// list of city which is search by user which is stored in local storage

function recentSearches() {
  $("#search-history").empty();
  for (var i = 0; i < citySearches.length; i++) {
    var searchHistory = '<tr><th scope="row">' + citySearches[i] + "</th></tr>";
    $("#search-history").append(searchHistory);
  }
}
init();
console.log(citySearches.length);
recentSearches();
// shows current weather for olathe 
weatherData("Olathe");
