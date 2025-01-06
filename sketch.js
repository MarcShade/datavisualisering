function setup() {
  loadJSON("https://ipgeolocation.abstractapi.com/v1?api_key=3ed637e3f8c24a1eb43b916fbc212d78", t => console.log(t));
  loadJSON("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m&forecast_days=1", b => console.log(b));
  
}

function draw() {
  background(145, 191, 166);
}