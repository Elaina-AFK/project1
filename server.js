var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var fs = require("fs");
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
  fs.readFile("data/carData.json", "utf8", function (err, data) {
    // console.log(data);
    res.send(data);
  });
});

app.post("/api/carData", function (req, res) {
  console.log("Got body:", req.body);
  const newData = fs.readFile(
    "data/carData.json",
    "utf8",
    function (err, data) {
      let tempData = JSON.parse(data);
      let id = (+new Date()).toString(32);
      res.send(JSON.stringify({ id: id }));
      tempData = [...tempData, { ...req.body, id }];
      tempData = JSON.stringify(tempData);
      fs.writeFile("data/carData.json", tempData, (err) => {
        if (err) console.log(err);
        console.log("added data!");
      });
    }
  );
});

app.delete("/api/carData", function (req, res) {
  console.log("(delete) get called");
  console.log("request message: ", req.body);
  res.send(JSON.stringify({ message: "got delete requested!" }));
  const newData = fs.readFile(
    "data/carData.json",
    "utf8",
    function (err, data) {
      let tempData = JSON.parse(data);
      tempData = tempData.filter((x) => x.id !== req.body.id);
      tempData = JSON.stringify(tempData);
      fs.writeFile("data/carData.json", tempData, (err) => {
        if (err) console.log(err);
        console.log("deleted data!");
      });
    }
  );
});

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
