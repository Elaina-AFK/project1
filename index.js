const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
// database
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/test");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connection Successful!");
});

const memberSchema = mongoose.Schema({
  username: String,
  password: String,
  firstName: {
    type: String,
    default: "Default_first_name",
  },
  lastName: {
    type: String,
    default: "Default_last_name",
  },
  id: String,
  role: {
    type: String,
    default: "member",
  },
  created: Date,
});

const Member = mongoose.model("member", memberSchema, "members");

const CarSchema = mongoose.Schema({
  name: String,
  price: Number,
  id: String,
  year: {
    type: Number,
    default: 2023,
  },
  added: Date,
  modified: Date,
});
const Car = mongoose.model("Car", CarSchema, "carStock");

// session and cookies
app.use(
  session({
    secret: "tempSecret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);
app.use(express.static("web"));

// middleware

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.send(JSON.stringify({ state: 0 }));
};

// method handlers
app.get("/", function (req, res) {
  res.send("<a href='http://localhost:8081/html/index.html'>car project</a>");
});

app.get("/api/state", isAuthenticated, function (req, res) {
  res.send(JSON.stringify({ state: 1 }));
});

app.get("/api/carData", isAuthenticated, function (req, res) {
  Car.find({}, (err, allCar) => {
    res.send(JSON.stringify(allCar));
  });
});

app.post("/api/signInData", function (req, res) {
  console.log("signIn (post) get called");
  const userData = req.body;
  console.log("Got login data:", userData);
  Member.findOne({ username: userData.username }, (err, member) => {
    if (err) console.log(err);
    if (member) {
      return res.send(
        JSON.stringify({
          message: "This username is already taken!",
        })
      );
    }
    const created = +new Date();
    const id = created.toString(32);
    const data = new Member({
      ...userData,
      id,
      role: "member",
      created,
    });
    data.save(function (err, member) {
      if (err) console.log(err);
      res.send(
        JSON.stringify({
          message: `${member.username} has been succesfully sign in!`,
        })
      );
      console.log(
        member.username,
        "added to member collections [POST successful!]"
      );
    });
  });
});

app.post("/api/loginData", function (req, res) {
  console.log("login (post) get called");
  const userData = req.body;
  console.log("Got login data:", userData);
  Member.findOne({
    username: userData.username,
    password: userData.password,
  })
    .then((memberData) => {
      const verifyStatus = memberData ? "pass" : "fail";
      if (memberData) {
        req.session.user = {};
        req.session.user.username = memberData.username;
        req.session.user.role = memberData.role;
      }
      res.send(
        JSON.stringify({
          status: verifyStatus,
        })
      );
    })
    .catch((err) => console.log(err));
});

app.post("/api/carData", function (req, res) {
  console.log("car (post) get called");
  console.log("Got body:", req.body);
  const addDate = +new Date();
  let id = addDate.toString(32);
  // console.log({ ...req.body, id });
  let tempCar = new Car({
    ...req.body,
    id,
    added: new Date(addDate),
    modified: new Date(addDate),
  }); // object

  tempCar.save(function (err, car) {
    if (err) return console.log(err);
    console.log(car.name, "saved to store collection [POST successful!]");
    res.send(
      JSON.stringify({
        message: "post successful!",
        id: id,
        added: new Date(addDate),
        modified: new Date(addDate),
      })
    );
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
  const modifiedDate = +new Date();
  Car.findOneAndUpdate(
    { id: req.body.id },
    {
      name: req.body.name,
      price: req.body.price,
      year: req.body.year,
      modified: new Date(modifiedDate),
    },
    (err, oldData) => {
      Car.findOne({ id: req.body.id }, (err, newData) => {
        console.log(
          `update ${oldData.name} with ${oldData.price} with Year: ${oldData.year} to ${newData.name} with ${newData.price} with Year: ${newData.year}[PUT successful!]`
        );
        res.send(
          JSON.stringify({
            message: "put successful!",
            modified: new Date(modifiedDate),
          })
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
