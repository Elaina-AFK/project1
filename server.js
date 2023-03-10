var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var fs = require("fs");
// database
var mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/test");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connection Successful!");
});
const CarSchema = mongoose.Schema({
  name: String,
  price: Number,
  id: String,
});
const Car = mongoose.model("Car", CarSchema, "carStock");
//
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);
app.use(express.static("HTML"));

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.get("/api/carData", function (req, res) {
  Car.find({}, (err, allCar) => {
    res.send(JSON.stringify(allCar));
  });
});

app.post("/api/carData", function (req, res) {
  console.log("Got body:", req.body);
  console.log("Connection Successful!");
  let id = (+new Date()).toString(32);
  res.send(JSON.stringify({ id: id }));
  console.log({ ...req.body, id });
  let tempCar = new Car({ ...req.body, id }); // object

  tempCar.save(function (err, car) {
    if (err) return console.log(err);
    console.log(car.name, " saved to store collection");
  });
});

app.delete("/api/carData", function (req, res) {
  console.log("(delete) get called");
  console.log("request message: ", req.body);
  res.send(JSON.stringify({ message: "got delete requested!" }));
  Car.deleteOne({ ...req.body }, (err) => {
    if (err) console.log(err);
    else console.log("Car deleted");
  });
});

app.put("/api/carData", function (req, res) {
  console.log("(put) get called");
  console.log("request message: ", req.body);
  res.send(JSON.stringify({ message: "got put requested!" }));
  Car.findOneAndUpdate(
    { id: req.body.id },
    {
      name: req.body.name,
      price: req.body.price,
    },
    (err, oldData) => {
      Car.findOne({ id: req.body.id }, (err, newData) => {
        console.log(
          `update ${oldData.name} with ${oldData.price} to ${newData.name} with ${newData.price}`
        );
      });
    }
  );
});

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
