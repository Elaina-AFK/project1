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
  year: {
    type: Number,
    default: 2023,
  },
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
  console.log("(post) get called");
  console.log("Got body:", req.body);
  let id = (+new Date()).toString(32);
  // console.log({ ...req.body, id });
  let tempCar = new Car({ ...req.body, id }); // object

  tempCar.save(function (err, car) {
    if (err) return console.log(err);
    console.log(car.name, "saved to store collection [POST successful!]");
    res.send(JSON.stringify({ message: "post successful!", id: id }));
  });
});

app.delete("/api/carData", function (req, res) {
  console.log("(delete) get called");
  console.log("request message: ", req.body);
  Car.deleteOne({ ...req.body }, (err) => {
    if (err) console.log(err);
    else {
      console.log("Car deleted [DELETE successful!]");
      res.send(JSON.stringify({ message: "delete successful!" })); // send should be use after success or failed
    }
  });
});

app.put("/api/carData", function (req, res) {
  console.log("(put) get called");
  console.log("request message: ", req.body);
  Car.findOneAndUpdate(
    { id: req.body.id },
    {
      name: req.body.name,
      price: req.body.price,
      year: req.body.year,
    },
    (err, oldData) => {
      Car.findOne({ id: req.body.id }, (err, newData) => {
        console.log(
          `update ${oldData.name} with ${oldData.price} with Year: ${oldData.year} to ${newData.name} with ${newData.price} with Year: ${newData.year}[PUT successful!]`
        );
        res.send(JSON.stringify({ message: "put successful!" }));
      });
    }
  );
});

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
