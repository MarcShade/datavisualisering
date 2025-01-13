let longitude;
let latitude;

function processData(data) {
  longitude = data.longitude
  latitude = data.latitude
  console.log("Longitude: " + longitude)
  console.log("Latitude: " + latitude)

  loadJSON(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&forecast_days=1`, data => console.log(data));
}

function setup() {
  loadJSON("https://ipgeolocation.abstractapi.com/v1?api_key=3ed637e3f8c24a1eb43b916fbc212d78", processData);
  createCanvas(900, 1600);
  background(color(50, 59, 74));
}

function draw() {

}