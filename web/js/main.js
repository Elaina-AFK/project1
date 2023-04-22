import { htmlMethod } from "./utils/api.js";
import {
  formatDate,
  sortObjectByPropHighToLow,
  sortObjectByPropLowToHigh,
} from "./utils/utilities.js";

let newCars = [];
let searchedCars = [];
let stateOfWeb = 0;
let searchedState = 0;
let filterCounter = 0;
let filterDict = {};
// add onclick property
addOnclickById("searchButton", searchByName);
addOnclickById("submitButton", verifyInput);
// fetch
fetch("/api/carData")
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
  document.getElementById("demo").innerHTML = "";
  let text = tableHeadString();
  let table_buffer = "</td><td>";
  text += "<tbody>";
  for (let i = 0; i < showedCars.length; i++) {
    text += "<tr><td id='tableNameRow" + String(i) + "'>";
    text += showedCars[i]["name"];
    text += "</td><td id='tablePriceRow" + String(i) + "'>";
    text += showedCars[i]["price"];
    text += "</td><td id='tableYearRow" + String(i) + "'>";
    text += showedCars[i]["year"];
    text += table_buffer;
    text += formatDate(showedCars[i]["added"]);
    text += table_buffer;
    text += formatDate(showedCars[i]["modified"]);
    text += table_buffer;
    text += `<button id='deleteRowButton${i}' type='button'>delete</button>`;
    text += table_buffer;
    text +=
      "<button type='button'id='editButton" +
      String(i) +
      "'>edit</button><span id='cancelButton" +
      String(i) +
      "'></span>";
    text += "</td></tr>";
  }
  text += "</tbody>";
  document.getElementById("demo").innerHTML = text;
  for (let i = 0; i < showedCars.length; i++) {
    addOnclickById("deleteRowButton" + i, () => deleteRow(i));
    addOnclickById("editButton" + i, () => editRow(i));
  }
  initiateOnClickArrange();
}

function initiateOnClickArrange() {
  addOnclickById("nameHead", () => hightoLow("name", "nameHead"));
  addOnclickById("priceHead", () => hightoLow("price", "priceHead"));
  addOnclickById("yearHead", () => hightoLow("year", "yearHead"));
  addOnclickById("addHead", () => hightoLow("added", "addHead"));
  addOnclickById("modifyHead", () => hightoLow("modified", "modifyHead"));
}

function headString(headName, headId) {
  return `<th scope='col' id='${headId}'>${headName}</th>`;
}
function tableHeadString() {
  const headingName = headString("Name", "nameHead", "name");
  const headingPrice = headString("Price", "priceHead", "price");
  const headingYear = headString("Year", "yearHead", "year");
  const headingAdd = headString("Added Date", "addHead", "added");
  const headingModified = headString("Modified Date", "modifyHead", "modified");
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
    let tempYear = document.getElementById("year").value;
    if (allName.includes(tempName)) {
      changeRedVerifiedText("This name is duplicated!");
    } else if (tempName === "" || tempPrice === "") {
      changeRedVerifiedText("This name or price is empty!");
    } else if (tempName.indexOf(" ") >= 0 || tempPrice.indexOf(" ") >= 0) {
      changeRedVerifiedText("This name or price have spaces!");
    } else if (Number.isNaN(tempPrice) === true) {
      changeRedVerifiedText("This price is Invalid!");
    } else if (tempYear === "") {
      changeRedVerifiedText("Please select the year!");
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
      temp = { ...temp, id: res.id, added: res.added, modified: res.modified };
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

function theToForm(idName, variableName) {
  return `<form><input type='text' id='${idName}' value='${variableName}'></form>`;
}

function changeRowToForm(showedCars, i) {
  let tempName = showedCars[i]["name"];
  let tempPrice = showedCars[i]["price"];
  let tempYear = showedCars[i]["year"];
  document.getElementById("tableNameRow" + String(i)).innerHTML = theToForm(
    "nameEdit",
    tempName
  );
  document.getElementById("tablePriceRow" + String(i)).innerHTML = theToForm(
    "priceEdit",
    tempPrice
  );
  document.getElementById("tableYearRow" + String(i)).innerHTML = theToForm(
    "yearEdit",
    tempYear
  );
  document.getElementById("editButton" + i).innerHTML = "update";
  addOnclickById("editButton" + i, () => updateData(i));

  let tempButton = document.createElement("button");
  tempButton.innerHTML = "cancel";
  tempButton.id = "tempCancelButton";
  tempButton.addEventListener("click", () => cancelUpdate(i));
  let tempId = document.getElementById("cancelButton" + i);
  tempId.parentNode.replaceChild(tempButton, tempId);
}

function updateData(i) {
  let name = document.getElementById("nameEdit").value;
  let price = document.getElementById("priceEdit").value;
  let year = document.getElementById("yearEdit").value;
  let temp = { name: name, price: price, year: year };
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
        newCars[i].modified = res.modified;
        updateTable(newCars);
      } else {
        searchedCars[i].modified = res.modified;
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

function hightoLow(propName, buttonID) {
  sortObjectByPropHighToLow(newCars, propName);

  //updateTable
  updateTable(newCars);

  //change button
  addOnclickById(buttonID, () => lowtoHigh(propName, buttonID));
}

function lowtoHigh(propName, buttonID) {
  sortObjectByPropLowToHigh(newCars, propName);
  //updateTable
  updateTable(newCars);

  //change button
  addOnclickById(buttonID, () => hightoLow(propName, buttonID));
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
  const filterTemplate = `<div id='filterWord${filterCounter}' style='display:inline'>${filterWord}<button id="cancel${filterCounter}" type="button">❌</button></div>`;
  filterDict[`filterWord${filterCounter}`] = filterWord;
  document.getElementById("filter").innerHTML += filterTemplate;
  addOnclickById(`cancel${filterCounter}`, () => {
    deleteElementById(`filterWord${filterCounter}`);
  });
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

function addOnclickById(id, func) {
  document.getElementById(id).addEventListener("click", func);
}

// แก้ search field เป็น show filter with cancel button (DONE!)
// เพิ่ม ปีผลิต(string) วันเวลาที่เพิ่มเข้าไปในดาต้าเบส(datetime) กับ วันเวลาที่แก้ไข(datetime)
// แก้ HTML method ให้เป็นฟังก์ชั่น เพราะใช้ซ้ำ (DONE!)
// ทำให้ปีแก้ไขได้ (DONE!)
// เพิ่ม Added Date/ Modified Date ทุกครั้งที่กด submit เข้าไปในดาต้าเบสด้วย
// แยกฟังก์ชั่นเป็นโมดูลต่างๆไว้ file อื่นๆ
