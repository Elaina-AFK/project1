var fs = require("fs");
//generate ID for data
fs.readFile("data/carData.json", "utf-8", function (err, data) {
  if (err) console.log(err);
  const temp = JSON.parse(data);
  for (let i = 0; i < temp.length; i++) {
    id = (+new Date() + i).toString(32);
    temp[i] = { ...temp[i], id };
  }
  out = JSON.stringify(temp);
  fs.writeFile("data/carData.json", out, (err) => {
    if (err) console.log(err);
  });
});
