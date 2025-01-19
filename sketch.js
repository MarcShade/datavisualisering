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

const graphHeight = 500;
const graphY = (canvasY - graphHeight) / 2;

function createWeatherGraph() {
  let canvas = createCanvas(canvasX, canvasY);
  canvas.parent("#canvas")
  loadFont("assets/Inter-Regular.woff2")
  textFont("Inter");
  // background("#2D2F3F");
  textAlign(CENTER);
  textSize(16);

  fill("white")
  stroke("darkgrey")


  //Setting up the graph
  strokeWeight(5);

  // x-axis
  line(20, graphY + graphHeight, canvasX - 20, graphY + graphHeight);

  // y-axis
  line(40, graphY + graphHeight, 40, graphY)

  let originX = 40;
  let originY = graphY + graphHeight/2;

  strokeWeight(1);

  // numbers on the y-axis and a line from every number
  for (let i = -25; i < 30; i += 5) {
    line(40, originY - graphHeight/60 * i, canvasX - 20, originY - graphHeight/60 * i);
    strokeWeight(0)
    text(i + "°", -32, originY - graphHeight/60 * i - 5, 100, 100);
    strokeWeight(1)
  } 

  let currX = null;
  let currY = null;

  let prevX = null;
  let prevY = null;

  // Drawing horizontal lines and dates on the graph
  forecastDays = int(forecastDays)
  for (let i = 1; i <= forecastDays; i++) {
    if (i != forecastDays) {
      let x = 1000 / (forecastDays) * i + 40 * (forecastDays - i)/ forecastDays;
      line(x, graphY, x, graphHeight + graphY);  
    }
    text(dateData[i-1], 940/forecastDays * (i-1) + (1/(forecastDays * 2)) * 940, 100, 100, 100);
  }

  // Drawing the graph 
  for (let i = 0; i < 24 * forecastDays; i++) {
    strokeWeight(2);
    if (i  % forecastDays != 0) {
      continue;
    }
    currX = originX + i * (canvasX-40)/(24 * forecastDays);
    currY = originY - graphHeight/60 * weatherData[i];
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
    if (i % forecastDays != 0) {
      continue;
    }
    currX = originX + i * (canvasX-40)/(24 * forecastDays);
    currY = originY - graphHeight/60 * weatherData[i];
    
    circle(currX, currY, 10);
  }
}

function processWeatherData(data) {
  console.log(data)
  weatherData = data.hourly.temperature_2m;
  timeData = data.hourly.time;
  dateData = timeData.map(element => element.substring(5, 10))
  dateData = [...new Set(dateData)];

  maxTemp = 5 * (Math.floor(Math.max(...weatherData) / 5) + 1)
  minTemp = 5 * (Math.floor(Math.min(...weatherData) / 5))

  console.log(maxTemp)
  console.log(minTemp)

  // Fuck everything about this fix
  for (let i = 0; i < dateData.length; i++) {
    let month = dateData[i].substring(0,2)
    let date = dateData[i].substring(3,5)
    dateData[i] = date + "/" + month
  }

  date = timeData[0].substring(0, 10);

  timeData = timeData.map(element => element.substring(11, 16))
  createWeatherGraph()
}

function processIPData(data) {
  longitude = data.longitude
  latitude = data.latitude
  
  document.getElementById("city-text").innerHTML = data.city
  document.getElementById("region-text").innerHTML = `${data.region}, ${data.country}`

  loadJSON(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&forecast_days=${forecastDays}&current=weather_code`, processWeatherData);
}

function setup() {
  mySelect = createSelect();
  mySelect.parent("content")

  for (let i = 1; i <= 7; i++) {
    mySelect.option(i);
  }

  loadJSON("https://ipgeolocation.abstractapi.com/v1?api_key=3ed637e3f8c24a1eb43b916fbc212d78", processIPData);
}

let buffer = 0;

function draw() {
  forecastDays = mySelect.value();
  if (forecastDays != buffer) {
    loadJSON(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&forecast_days=${forecastDays}`, processWeatherData);
  }
  buffer = forecastDays;
}