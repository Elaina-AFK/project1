// Do Not Touch
// var mongoose = require("mongoose");
// var fs = require("fs");
// mongoose.connect("mongodb://127.0.0.1:27017/test");

// var db = mongoose.connection;

// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", function () {
//   console.log("Connection Successful!");
//   let CarSchema = mongoose.Schema({
//     name: String,
//     price: Number,
//     id: String,
//   });
//   const Car = mongoose.model("Car", CarSchema, "carStock");

//   fs.readFile("data/carData.json", "utf8", function (err, data) {
//     if (err) console.log(err);
//     let importedData = JSON.parse(data);
//     importedData = importedData.map((data) => {
//       data.price = Number(data.price);
//       return data;
//     });
//     console.log(importedData);
//     Car.collection
//       .insertMany(importedData)
//       .then(console.log("Many Data inserted!"))
//       .catch((err) => console.log(err));
//   });
// });
