const canvasX = 1000;
const canvasY = 1600;

let longitude;
let latitude;

let weatherData;
let timeData;

let date;

let forecastDays = 1;

// Describes the graphs y-position. Origin is top. This is helpful for when Marc's indecisive ass has to move my shit. Fuckass groupmember.
const graphY = 500;

const graphHeight = 500;

function createWeatherGraph() {
  createCanvas(canvasX, canvasY);
  background("lightgray");
  textAlign(CENTER);

  fill("black")


  //Setting up the graph
  strokeWeight(5);

  // x-axis
  line(20, graphY + graphHeight, canvasX - 20, graphY + graphHeight);

  // y-axis
  line(40, graphY + graphHeight, 40, graphY)

  let originX = 40;
  let originY = graphY + graphHeight/2;

  strokeWeight(1);

  for (let i = -25; i < 30; i += 5) {
    line(40, originY - graphHeight/60 * i, canvasX - 20, originY - graphHeight/60 * i);
    // translate(width, 0)
    
    text(i, -30, originY - graphHeight/60 * i - 5, 100, 100);
  } 


  let currX = null;
  let currY = null;

  let prevX = null;
  let prevY = null;


  // console.log(forecastDays)
  for (let i = 0; i < 24 * forecastDays; i++) {
    strokeWeight(2);
    if (i % forecastDays != 0) {
      continue;
    }
    currX = originX + i * (canvasX-40)/(24 * forecastDays);
    currY = originY - graphHeight/60 * weatherData[i];
    circle(currX, currY, 10);
    if (prevX != null) {
      line(currX, currY, prevX, prevY);
    }
    prevX = currX;
    prevY = currY;

    line(currX, graphHeight + graphY - 10, currX, graphHeight + graphY + 10)
    text(i % 24, currX - 50, graphHeight + graphY + 20, 100, 100);
  }

  // fill her for at ændre farven
  for (let i = 1; i <= forecastDays; i++) {
    let x = (1000-40) / (forecastDays) * i
    line(x, graphY, x, graphHeight + graphY);  
  }
}

function processWeatherData(data) {
  console.log(data)
  weatherData = data.hourly.temperature_2m;
  timeData = data.hourly.time;
  date = timeData[0].substring(0, 10);

  timeData = timeData.map(element => element.substring(11, 16))
  createWeatherGraph()
}

function processIPData(data) {
  longitude = data.longitude
  latitude = data.latitude

  loadJSON(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&forecast_days=${forecastDays}`, processWeatherData);
}

function setup() {
  mySelect = createSelect();
  mySelect.position(920/2, graphY - 20);

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