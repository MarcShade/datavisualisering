const canvasX = 1000;
const canvasY = 1600;

let longitude;
let latitude;

let weatherData;
let timeData;

let date;

// Describes the graphs y-position. Origin is top. This is helpful for when Marc's indecisive ass has to move my shit. Fuckass groupmember.
const graphY = 500;

const graphHeight = 500;

function processWeatherData(data) {
  // console.log(data)
  weatherData = data.hourly.temperature_2m;
  timeData = data.hourly.time;
  date = timeData[0].substring(0, 10);

  timeData = timeData.map(element => element.substring(11, 16))
}

function processData(data) {
  longitude = data.longitude
  latitude = data.latitude

  loadJSON(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&forecast_days=1`, processWeatherData);
}

function setup() {
  loadJSON("https://ipgeolocation.abstractapi.com/v1?api_key=3ed637e3f8c24a1eb43b916fbc212d78", processData);
  createCanvas(canvasX, canvasY);
  background("lightgray");

  //Setting up the graph
  strokeWeight(5);

  // x-axis
  line(20, graphY + graphHeight, canvasX - 20, graphY + graphHeight);

  // y-axis
  line(40, graphY + graphHeight + 20, 40, graphY)

  let origin = (40, graphY + graphHeight);

  strokeWeight(2);
  fill("red")

  for (let i = 0; i < 24; i++) {
    rect(20 + i * 32.5, 20, 10, 10);
  }
}

function draw() {

}