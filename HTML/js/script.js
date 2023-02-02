let newCars = [];
let stateOfWeb = 0;
fetch("api/carData")
  .then((res) => res.json())
  .then((res) => {
    const cars = res;
    newCars = cars.slice();

    // console.log("data: ", newCars);
    updateTable();
  });

function updateTable() {
  // console.log("Calling updateTable");
  let text =
    "<thead><tr><th scope='col'>Name</th><th scope='col'>Price<button type='button' id='arrButton' onclick='hightoLow()' class='btn btn-sm btn-outline-light pull-right'>.</button></th><th scope='col'></th><th scope='col'></th></tr></thead>";
  let table_buffer = "</td><td>";
  for (let i = 0; i < newCars.length; i++) {
    text += "<tr><td id='tableNameRow" + String(i) + "'>";
    text += newCars[i]["name"];
    text += "</td><td id='tablePriceRow" + String(i) + "'>";
    text += newCars[i]["price"];
    text += table_buffer;
    text +=
      "<button type='button' onclick='deleteRow(" +
      String(i) +
      ")'>delete</button>";
    text += table_buffer;
    text +=
      "<button type='button' onclick='editRow(" +
      String(i) +
      ")' id='editButton" +
      String(i) +
      "'>edit</button><span id='cancelButton" +
      String(i) +
      "'></span>";
    text += "</td></tr>";
  }
  document.getElementById("demo").innerHTML = text;
}

function verifyInput() {
  if (stateOfWeb == 0) {
    let allName = getNameData();
    let tempName = document.getElementById("name").value;
    let tempPrice = document.getElementById("price").value;
    if (allName.includes(tempName)) {
      changeRedVerifiedText("This name is duplicated!");
    } else if (tempName == "" || tempPrice == "") {
      changeRedVerifiedText("This name or price is empty!");
    } else if (tempName.indexOf(" ") >= 0 || tempPrice.indexOf(" ") >= 0) {
      changeRedVerifiedText("This name or price have spaces!");
    } else if (Number.isNaN(tempPrice) === true) {
      changeRedVerifiedText("This price is Invalid!");
    } else {
      changeTextProperty("verifiedText", "Green", "Success!");
      getInputfunc();
    }
  } else {
    changeRedVerifiedText("You are in edit mode!");
  }
}

function getInputfunc() {
  let name = document.getElementById("name").value;
  let price = document.getElementById("price").value;
  let id = (+new Date()).toString(32);
  let temp = { name: name, price: price, id: id };
  //console.log(temp);
  let tempData = temp;
  const response = fetch("api/carData", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer",
    body: JSON.stringify(tempData),
  });
  newCars.push(temp);
  updateTable();
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
}

function deleteRow(i) {
  if (stateOfWeb == 0) {
    let tempData = { id: newCars[i].id };
    const response = fetch("api/carData", {
      method: "DELETE", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer",
      body: JSON.stringify(tempData),
    })
      .then((res) => res.json())
      .then((message) => console.log(message.message));
    newCars.splice(Number(i), 1);
    updateTable();
  } else {
    changeRedVerifiedText("You are in edit mode!");
  }
}

function getNameData() {
  //return Name array
  let allName = [];
  for (let i = 0; i < newCars.length; i++) {
    allName.push(newCars[i]["name"]);
  }
  return allName;
}

function changeTextProperty(id, colorText, text) {
  document.getElementById(id).style = "color: " + colorText;
  document.getElementById(id).innerHTML = text;
}

function changeRedVerifiedText(text) {
  changeTextProperty("verifiedText", "Red", text);
}

function editRow(i) {
  //change state
  //change text row to form and change edit button to update only that row (func)
  //verify Input
  //if success change state
  //make change data
  //updatescreen
  if (stateOfWeb == 0) {
    stateOfWeb = 1;
    //console.log("edit mode activated!");
    changeRowToForm(i);
  }
}

function changeRowToForm(i) {
  let tempName = newCars[i]["name"];
  let tempPrice = newCars[i]["price"];
  document.getElementById("tableNameRow" + String(i)).innerHTML =
    "<form><input type='text' id='nameEdit' value='" + tempName + "'></form>";
  document.getElementById("tablePriceRow" + String(i)).innerHTML =
    "<form><input type='text' id='priceEdit' value='" + tempPrice + "'></form>";
  document.getElementById("editButton" + i).innerHTML = "update";
  document
    .getElementById("editButton" + i)
    .setAttribute("onclick", "updateData(" + i + ")");

  let tempButton = document.createElement("button");
  tempButton.innerHTML = "cancel";
  tempButton.id = "tempCancelButton";
  tempButton.setAttribute("onclick", "cancelUpdate(" + i + ")");
  let tempId = document.getElementById("cancelButton" + i);
  tempId.parentNode.replaceChild(tempButton, tempId);
}

function updateData(i) {
  let name = document.getElementById("nameEdit").value;
  let price = document.getElementById("priceEdit").value;
  let temp = { name: name, price: price };
  newCars.splice(i, 1, temp);
  updateTable();
  stateOfWeb = 0;
  //console.log("back to state 0");
}

function cancelUpdate(i) {
  updateTable();
  stateOfWeb = 0;
  //console.log("back to state 0");
}

function hightoLow() {
  //arrange function
  let tempCars = arranging(newCars);

  //change database
  newCars = tempCars;

  //updateTable
  updateTable();

  //change button
  let tempButton = document.getElementById("arrButton");
  tempButton.innerHTML = "^";
  tempButton.setAttribute("onclick", "lowtoHigh()");
}

function lowtoHigh() {
  //arrange function
  let tempCars = arranging(newCars, false);

  //change database
  newCars = tempCars;

  //updateTable
  updateTable();

  //change button
  let tempButton = document.getElementById("arrButton");
  tempButton.innerHTML = "v";
  tempButton.setAttribute("onclick", "hightoLow()");
}

function getMin(listOfData) {
  let min = listOfData[0];
  for (let i = 1; i < listOfData.length; i++) {
    if (Number(min["price"]) > Number(listOfData[i]["price"])) {
      min = listOfData[i];
    }
  }
  return min;
}

function arranging(listOfData, reverse = true) {
  let sortedList = [];
  let length = listOfData.length;
  for (let i = 0; i < length; i++) {
    let min = getMin(listOfData);
    sortedList.push(min);
    removeItemFromList(listOfData, min);
  }
  if (reverse === false) {
    sortedList.reverse();
  }
  return sortedList;
}

function removeItemFromList(listOfData, item) {
  let index = listOfData.indexOf(item);
  if (index !== -1) {
    listOfData.splice(index, 1);
  }
}
