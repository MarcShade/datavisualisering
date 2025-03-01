const canvasX = 1000;
const canvasY = 700;

let longitude;
let latitude;

let weatherData;
let timeData;
let dateData;

let date;

let forecastDays = 1;

let maxTemp;
let minTemp;  

let boundary;

const d = new Date();
let hour = d.getHours();
let currentTemp;
let currentWeatherCode

const graphHeight = 500;
const graphY = (canvasY - graphHeight) / 2;

const weatherCodes = {
  0: "Clear sky",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Freezing fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Heavy drizzle",
  56: "Light freezing drizzle",
  57: "Heavy freezing drizzle",
  61: "Light rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Light snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Light rain showers",
  81: "Moderate rain showers",
  82: "Heavy rain showers",
  85: "Light snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with small hail",
  99: "Thunderstorm with heavy hail"
};

function createWeatherGraph() {
  let canvas = createCanvas(canvasX, canvasY);
  canvas.parent("#canvas")
  loadFont("assets/Inter-Regular.woff")
  textFont("Inter");
  textAlign(CENTER);
  textSize(16);

  fill("white")
  stroke("darkgrey")
  strokeWeight(5);


  // Drawing up the graph

  // x-axis
  line(20, graphY + graphHeight, canvasX - 20, graphY + graphHeight);

  // y-axis
  line(40, graphY + graphHeight, 40, graphY)

  let originX = 40;
  let originY = graphY + graphHeight/2;

  strokeWeight(1);
  let tempSteps = (boundary + boundary) / 5 + 1;
  let divisor = tempSteps

  // numbers on the y-axis and a line for every number
  for (let i = 0; i <= boundary/5 * 2; i++) {
    let temp = -boundary + i*5;
    let iter = -boundary/5 + i*1
    line(40, originY - graphHeight/divisor * iter, canvasX - 20, originY - graphHeight/divisor * iter);
    strokeWeight(0)
    text(temp + "°", -32, originY - graphHeight/divisor * iter - 5, 100, 100);
    strokeWeight(1)
  } 

  let currX = null;
  let currY = null;

  let prevX = null;
  let prevY = null;

  // Drawing horizontal lines and dates on the graph
  forecastDays = int(forecastDays) // Fuck Javascript
  for (let i = 1; i <= forecastDays; i++) {
    if (i != forecastDays) {
      let x = 1000 / (forecastDays) * i + 40 * (forecastDays - i)/ forecastDays;
      line(x, graphY, x, graphHeight + graphY);  
    }
    text(dateData[i-1], 940/forecastDays * (i-1) + (1/(forecastDays * 2)) * 940, 100, 100, 100);
  }

  let step;
  if (forecastDays < 5) step = forecastDays
  else step = 6;

  // Drawing the graph 
  for (let i = 0; i < 24 * forecastDays; i++) {
    strokeWeight(2);
    if (i  % step != 0) {
      continue;
    }
    currX = originX + i * (canvasX-40)/(24 * forecastDays);
    currY = originY - graphHeight/divisor * (float(weatherData[i]))/5;
    if (prevX != null) {
      line(currX, currY, prevX, prevY);
    }
    prevX = currX
    prevY = currY

    line(currX, graphHeight + graphY - 10, currX, graphHeight + graphY + 10)
    strokeWeight(0)
    text(i % 24, currX - 50, graphHeight + graphY + 20, 100, 100);
  }
  
  // Drawing points on the graph
  for (let i = 0; i < 24 * forecastDays; i++) {
    strokeWeight(2);
    if (i % step != 0) {
      continue;
    }

    currX = originX + i * (canvasX-40)/(24 * forecastDays);
    currY = originY - graphHeight/divisor * (float(weatherData[i]))/5;
    
    circle(currX, currY, 10);
  }
  // Setting the current temperature and displaying it in HTML 
  currentTemp = int(weatherData[hour])
  document.getElementById("current-temp").innerHTML = currentTemp + "°C"
  document.getElementById("current-weather").innerHTML = weatherCodes[currentWeatherCode]
}

// Function for processing the relevant weather data
function processWeatherData(data) {
  weatherData = data.hourly.temperature_2m;
  timeData = data.hourly.time;
  dateData = timeData.map(element => element.substring(5, 10))
  // Removing duplicates with a set
  dateData = [...new Set(dateData)];
  currentWeatherCode = data.current.weather_code

  maxTemp = 5 * (Math.floor(Math.max(...weatherData) / 5) + 1)
  minTemp = 5 * (Math.floor(Math.min(...weatherData) / 5))

  boundary = Math.max(Math.abs(maxTemp), Math.abs(minTemp))

  // Wacky hack for switching the date format to the european standard
  for (let i = 0; i < dateData.length; i++) {
    let month = dateData[i].substring(0,2)
    let date = dateData[i].substring(3,5)
    dateData[i] = date + "/" + month
  }

  date = timeData[0].substring(0, 10);

  timeData = timeData.map(element => element.substring(11, 16))
  // Actually creating the graph
  createWeatherGraph()
}

// function for processing the relevant IP data.
function processIPData(data) {
  longitude = data.longitude
  latitude = data.latitude
  
  // Displaying your approximate location and current weather information in HTML
  document.getElementById("city-text").innerHTML = data.city
  document.getElementById("region-text").innerHTML = `${data.region}, ${data.country}`

  loadJSON(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&forecast_days=${forecastDays}&current=weather_code`, processWeatherData);
}

function setup() {
  mySelect = createSelect();
  mySelect.parent("forecast-days")

  // Setting up the drop-down menu.
  for (let i = 1; i <= 7; i++) {
    mySelect.option(i);
  }

  loadJSON("https://get.geojs.io/v1/ip/geo.json", processIPData);
}

let buffer = 0;

// Retrieving the new data based on the selected forecast day
function draw() {
  forecastDays = mySelect.value();
  if (forecastDays != buffer) {
    loadJSON(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&forecast_days=${forecastDays}&current=weather_code`, processWeatherData);
  }
  buffer = forecastDays;
}