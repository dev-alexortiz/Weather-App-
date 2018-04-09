//loading animation
window.setInterval(function(){
    window.setTimeout(function(){
      $('#r2').fadeIn('slow').delay(1000).fadeOut('slow');
    }, 0);
    window.setTimeout(function(){
      $('#r1').fadeIn('slow').delay(1000).fadeOut('slow');
    }, 1000);
    window.setTimeout(function(){
      $('#r3').fadeIn('slow').delay(1000).fadeOut('slow');
    }, 2000);
      window.setTimeout(function(){
      $('#r5').fadeIn('slow').delay(1000).fadeOut('slow');
    }, 3000);
      window.setTimeout(function(){
      $('#r4').fadeIn('slow').delay(1000).fadeOut('slow');
    },4000);
      window.setTimeout(function(){
      $('#r7').fadeIn('slow').delay(1000).fadeOut('slow');
    }, 5000);
      window.setTimeout(function(){
      $('#r6').fadeIn('slow').delay(1000).fadeOut('slow');
    }, 6000);
      window.setTimeout(function(){
      $('#r8').fadeIn('slow').delay(1000).fadeOut('slow');
    }, 7000);
}, 0);

//get location data 
function getLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Unable to retreive location.");
  }
}

//call to DarkSky API and Google Maps 
function showPosition(position) {
  var apiKey = "129bc2cebff400e23178ee82cfc0c494",
    url = "https://api.darksky.net/forecast/",
    lat = position.coords.latitude,
    long = position.coords.longitude,
    api_call =
      url +
      apiKey +
      "/" +
      lat +
      "," +
      long +
      "?exclude=minutely,hourly,daily&callback=?";
  var city = "", state = "";
  
//Google Maps call
  $.get({
    url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +lat+','+long+'&key=AIzaSyC_vpzySTse7ZnrfBtqvhue7QbkTyQHu-c',
    success: function(data){
      for (var l = 0; l < data.results[0].address_components.length; l++) {
         var locationData = data.results[0].address_components[l];
         if(locationData.types[0] == 'locality') {
            city = locationData.long_name;
         }
         if(locationData.types[0] == 'administrative_area_level_1'){
            state = locationData.short_name;
         }
      }
    $("#location").text(city + ", " + state);
   }
  });
  
// Call to the DarkSky API to retrieve JSON
  $.getJSON(api_call, function(forecast) {
    $(".rain-box").fadeOut(500);
    $(".box").fadeIn(2000).delay(1000);
    
    //Skycons
    var iconRequest = forecast.currently.icon;      
    var icons = new Skycons({"color":"white"});
    var iconList = ["clear-day", "clear-night", 
            "partly-cloudy-day", "partly-cloudy-night",
            "cloudy", "rain", "sleet", "snow", "wind","fog"];
    for (i = 0; i < iconList.length; i++) {
				if (iconRequest == iconList[i]) {
						icons.set('icon', iconList[i]);
				} 
    } icons.play();

//fill box with data
  var precip = Number(forecast.currently.precipProbability) * 100; 
  var humidity = Number(forecast.currently.humidity) *100;
  var temp = Number(forecast.currently.temperature);
  $("#temp").text(temp.toFixed(1));
  $("#stats1").text(forecast.currently.summary);
  $("#stats2").text("Precipitation: " + precip + "%");
  $("#stats3").text("Humidity: " + humidity + "%");

//weather advisories
  if(!forecast.alerts){
      $("#alerts").append("<h5 style=\"text-align:center\">... CURRENTLY NO WARNINGS OR ADVISORIES IN EFFECT</h5>");}
  else{
     var array = forecast.alerts;
     for(var x = 0; x < array.length; x++) {
        var details = (array[x].description).replace(/\*\s+/g, "<br>*");
   
        $("#alerts").append("<h3><i class=\"fas fa-exclamation-triangle\"></i>  <strong>" + array[x].title + "</strong></h3><p>" + details +"<br><a href='" + array[x].uri + "' rel='noopener'>MORE INFO..</a></p><br>");
      }}
    });
}

//switching between Celsius and Fahrenheit
  $("#C").click(function () {
    var tempVal = Number($("#temp").text());
    tempVal = (tempVal - 32) * 0.5556;
    $("#temp").text(tempVal.toFixed(1));
    $("#F").css('opacity', 0.6);
    $("#C").prop('disabled', true);
    $("#F").prop('disabled', false);
    $("#C").css('opacity', 1);
 });
  
  $("#F").click(function () {
    var tempVal = Number($("#temp").text());
    tempVal = (tempVal / 0.5556 ) + 32;
    $("#temp").text(tempVal.toFixed(1));
    $("#C").css('opacity', 0.6);
    $("#F").prop('disabled', true);
    $("#C").prop('disabled', false);
    $("#F").css('opacity', 1);
 });

$(document).ready(function() {
  getLocation();
});