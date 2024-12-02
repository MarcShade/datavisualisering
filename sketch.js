function setup() {
  loadJSON("https://ipgeolocation.abstractapi.com/v1?api_key=3ed637e3f8c24a1eb43b916fbc212d78", t => console.log(t));
}

function draw() {
  background(220);
}