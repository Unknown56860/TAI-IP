async function weather(){
    let city = document.getElementById("search_bar").value;

    let geocode_url = "https://geocoding-api.open-meteo.com/v1/search?name="+city+"&count=1&language=en&format=json";

    let location = await fetch(geocode_url);
    let location_data = await location.json();

    let lat = location_data.results[0].latitude;
    let lon = location_data.results[0].longitude;
    let city_name = location_data.results[0].name;
    let time_zone = location_data.results[0].timezone;

    //console.log(location_data);
    //console.log(city, lat, lon, city_name, time_zone);

    let timezone_url = "http://worldtimeapi.org/api/timezone/"+time_zone;

    let time = await fetch(timezone_url);
    let time_data = await time.json();
    
    let hour = Number(time_data.datetime.split("T")[1].split(":")[0]);

    //console.log(time_data);
    //console.log(hour);

    let weather_url = "https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lon+"&hourly=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&forecast_days=1";

    let weather = await fetch(weather_url);
    let weather_data = await weather.json();

    let weather_value = weather_data.hourly.weather_code;
    let temprature = weather_data.hourly.temperature_2m;
    let humidity = weather_data.hourly.relative_humidity_2m;
    let wind_speed = weather_data.hourly.wind_speed_10m;

    //console.log(weather_data);
    console.log(weather_value, temprature, humidity, wind_speed);

    let weather_sheet = await fetch('json/wmo_code_interpretetion.json');
    let weather_sheet_data = await weather_sheet.json();

    let weather_condition;
    if(hour>=6 && hour<18){
        weather_condition = weather_sheet_data[weather_value[hour]].day;
    }else{
        weather_condition = weather_sheet_data[weather_value[hour]].night;
    }

    //console.log(weather_sheet_data);
    //console.log(weather_condition);

    document.getElementById("weather_icon").src = weather_condition.image;

    document.getElementById("weather_icon").alt = weather_condition.description;
    document.getElementById("weather_cndn").innerHTML = weather_condition.description;

    document.getElementById("city").innerHTML = city_name;
    document.getElementById("temp").innerHTML = temprature[hour] + "°c";

    document.getElementById("h_value").innerHTML = humidity[hour] + "%";
    document.getElementById("ws_value").innerHTML = wind_speed[hour] + " km/h";
}
weather();