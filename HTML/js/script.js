let newCars = [];
let searchedCars = [];
let stateOfWeb = 0;
let searchedState = 0;
let filterCounter = 0;
let filterDict = {};
// fetch
fetch("api/carData")
  .then((res) => res.json())
  .then((res) => {
    const cars = res;
    newCars = cars.slice();

    // console.log("data: ", newCars);
    updateTable(newCars);
    addYearOption();
  });

function updateTable(showedCars) {
  // console.log("Calling updateTable");
  let text = tableHeadString();
  let table_buffer = "</td><td>";
  for (let i = 0; i < showedCars.length; i++) {
    text += "<tr><td id='tableNameRow" + String(i) + "'>";
    text += showedCars[i]["name"];
    text += "</td><td id='tablePriceRow" + String(i) + "'>";
    text += showedCars[i]["price"];
    text += table_buffer;
    text += showedCars[i]["year"];
    text += table_buffer;
    text += showedCars[i]["addDate"];
    text += table_buffer;
    text += showedCars[i]["modifiedDate"];
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

function tableHeadString() {
  const headingName = "<th scope='col'>Name</th>";
  const headingPrice =
    "<th scope='col'>Price<button type='button' id='arrButton' onclick='hightoLow()' class='btn btn-sm btn-outline-light pull-right'>.</button></th>";
  const headingYear = "<th scope='col'>Year</th>";
  const headingAdd = "<th scope='col'>Added Date</th>";
  const headingModified = "<th scope='col'>Modified Date</th>";
  const editHead = "<th scope='col'></th><th scope='col'></th>";
  return (
    "<thead><tr>" +
    headingName +
    headingPrice +
    headingYear +
    headingAdd +
    headingModified +
    editHead +
    "</tr></thead>"
  );
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
  let year = document.getElementById("year").value;
  let temp = { name: name, price: price, year: year };
  const response = htmlMethod("POST", temp)
    .then((res) => res.json())
    .then((res) => {
      console.log(res.message);
      temp = { ...temp, id: res.id };
      newCars.push(temp);
      updateTable(newCars);
      document.getElementById("name").value = "";
      document.getElementById("price").value = "";
      document.getElementById("year").value = "";
    });
}

function deleteCarById(showedCars, i) {
  const tempData = { id: showedCars[i]["id"] };
  const response = htmlMethod("DELETE", tempData)
    .then((res) => res.json())
    .then((message) => {
      console.log(message.message);
    });
  newCars = newCars.filter((car) => car.id !== tempData["id"]);
  searchedCars = searchedCars.filter((car) => car.id !== tempData["id"]);
}

function deleteRow(i) {
  if (stateOfWeb == 0) {
    if (searchedState == 0) {
      deleteCarById(newCars, i);
      updateTable(newCars);
    } else {
      deleteCarById(searchedCars, i);
      updateTable(searchedCars);
    }
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
  if (stateOfWeb === 0) {
    stateOfWeb = 1;
    if (searchedState === 0) {
      changeRowToForm(newCars, i);
    } else {
      changeRowToForm(searchedCars, i);
    }
  }
}

function changeRowToForm(showedCars, i) {
  let tempName = showedCars[i]["name"];
  let tempPrice = showedCars[i]["price"];
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
  let tempData = [];
  if (searchedState === 0) {
    newCars[i] = { ...newCars[i], ...temp };
    tempData = newCars[i];
  } else {
    searchedCars[i] = { ...searchedCars[i], ...temp };
    const ind = newCars.findIndex((car) => car.id === searchedCars[i].id);
    newCars[ind] = { ...newCars[ind], ...temp };
    tempData = searchedCars[i];
  }
  const response = htmlMethod("PUT", tempData)
    .then((res) => res.json())
    .then((res) => {
      console.log(res.message);
      if (searchedState === 0) {
        updateTable(newCars);
      } else {
        updateTable(searchedCars);
      }
      stateOfWeb = 0;
    });

  //console.log("back to state 0");
}

function cancelUpdate(i) {
  updateTable(newCars);
  stateOfWeb = 0;
  //console.log("back to state 0");
}

function hightoLow() {
  //arrange function
  let tempCars = arranging(newCars);

  //change database
  newCars = tempCars;

  //updateTable
  updateTable(newCars);

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
  updateTable(newCars);

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

function searchByName() {
  const searchValue = document.getElementById("searchBar").value.trim();
  if (searchValue === "") {
    return;
  }

  createFilter(searchValue);
  if (searchedState === 0) {
    searchedState = 1;
  }

  filterSearch();
  updateTable(searchedCars);
  document.getElementById("searchBar").value = "";
}

function filterSearch() {
  const filterValues = Object.values(filterDict);
  const regex = new RegExp(filterValues[0]);
  searchedCars = newCars.filter((car) => regex.test(car.name));
  for (let i = 1; i < filterValues.length; i++) {
    const regex = new RegExp(filterValues[i]);
    searchedCars = searchedCars.filter((car) => regex.test(car.name));
  }
}

function createFilter(filterWord) {
  filterCounter += 1;
  const filterTemplate = `<div id='filterWord${filterCounter}' style='display:inline'>${filterWord}<input type="button" value="cancel" onclick="deleteElementById('filterWord${filterCounter}')"></div>`;
  filterDict[`filterWord${filterCounter}`] = filterWord;
  document.getElementById("filter").innerHTML += filterTemplate;
}

function deleteElementById(id) {
  delete filterDict[id];
  document.getElementById(id).outerHTML = "";
  if (document.getElementById("filter").innerHTML.trim() === "") {
    updateTable(newCars);
    searchedState = 0;
    searchedCars = [];
    return;
  }
  filterSearch();
  updateTable(searchedCars);
}

function htmlMethod(method, data) {
  return fetch("api/carData", {
    method: method, // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });
}

function addYearOption() {
  const d = new Date();
  let startYear = d.getFullYear();
  let allOptionValue = "";
  while (startYear >= 1900) {
    allOptionValue += `<option value="${startYear}">${startYear}</option>`;
    startYear -= 1;
  }
  document.getElementById("year").innerHTML = allOptionValue;
}

// แก้ search field เป็น show filter with cancel button (DONE!)
// เพิ่ม ปีผลิต(string) วันเวลาที่เพิ่มเข้าไปในดาต้าเบส(datetime) กับ วันเวลาที่แก้ไข(datetime)
// แก้ HTML method ให้เป็นฟังก์ชั่น เพราะใช้ซ้ำ (DONE!)
