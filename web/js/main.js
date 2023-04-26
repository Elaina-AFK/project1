import { htmlMethod } from "./utils/api.js";
import {
  addOnclickById,
  changeTextProperty,
  changeRedVerifiedText,
  mainString,
  updateTable as updateTableModule,
} from "./utils/dom.js";
import { loginPageString } from "./utils/loginPage.js";

let newCars = [];
let searchedCars = [];
let stateOfWeb = 0;
let editState = 0;
let searchedState = 0;
let filterCounter = 0;
let filterDict = {};
// fetch
renderBaseOnState();

fetch("/api/carData")
  .then((res) => res.json())
  .then((res) => {
    const cars = res;
    newCars = cars.slice();
    renderBaseOnState();
  });

function renderBaseOnState() {
  if (stateOfWeb === 0) {
    document.getElementById("mainDiv").innerHTML = loginPageString();
    addOnclickById("loginButton", onLogin);
  } else if (stateOfWeb === 1) {
    document.getElementById("mainDiv").innerHTML = mainString();

    // console.log("data: ", newCars);
    updateTable(newCars);
    addYearOption();
    // add onclick property
    addOnclickById("searchButton", searchByName);
    addOnclickById("submitButton", verifyInput);
  }
}

function onLogin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  // send request (to do)
  stateOfWeb = 1;
  renderBaseOnState();
}

function verifyInput() {
  if (editState == 0) {
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

function updateTable(showedCars) {
  return updateTableModule(showedCars, editRow, deleteRow);
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
  if (editState == 0) {
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

function editRow(i) {
  if (editState === 0) {
    editState = 1;
    if (searchedState === 0) {
      changeRowToForm(newCars, i);
    } else {
      changeRowToForm(searchedCars, i);
    }
  }
}

function toFormString(idName, variableName) {
  return `<form><input type='text' id='${idName}' value='${variableName}'></form>`;
}

function changeRowToForm(showedCars, i) {
  let tempName = showedCars[i]["name"];
  let tempPrice = showedCars[i]["price"];
  let tempYear = showedCars[i]["year"];
  document.getElementById("tableNameRow" + String(i)).innerHTML = toFormString(
    "nameEdit",
    tempName
  );
  document.getElementById("tablePriceRow" + String(i)).innerHTML = toFormString(
    "priceEdit",
    tempPrice
  );
  document.getElementById("tableYearRow" + String(i)).innerHTML = toFormString(
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
      editState = 0;
    });

  //console.log("back to state 0");
}

function cancelUpdate(i) {
  updateTable(newCars);
  editState = 0;
  //console.log("back to state 0");
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
    deleteFilterById(`filterWord${filterCounter}`);
  });
}

function deleteFilterById(id) {
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

// แก้ search field เป็น show filter with cancel button (DONE!)
// เพิ่ม ปีผลิต(string) วันเวลาที่เพิ่มเข้าไปในดาต้าเบส(datetime) กับ วันเวลาที่แก้ไข(datetime)
// แก้ HTML method ให้เป็นฟังก์ชั่น เพราะใช้ซ้ำ (DONE!)
// ทำให้ปีแก้ไขได้ (DONE!)
// เพิ่ม Added Date/ Modified Date ทุกครั้งที่กด submit เข้าไปในดาต้าเบสด้วย
// แยกฟังก์ชั่นเป็นโมดูลต่างๆไว้ file อื่นๆ
