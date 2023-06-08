import api from "./utils/api.js";
import dom from "./utils/dom.js";
import loginPage from "./utils/loginPage.js";

let newCars = [];
let searchedCars = [];
let stateOfWeb = 0;
let editState = 0;
let searchedState = 0;
let filterCounter = 0;
let filterDict = {};
// fetch
renderBaseOnState(stateOfWeb);

fetch("/api/carData")
  .then((res) => res.json())
  .then((res) => {
    const cars = res;
    newCars = cars.slice();
    renderBaseOnState(stateOfWeb);
  });

function renderBaseOnState(state) {
  if (state === 0) {
    document.getElementById("mainDiv").innerHTML = "";
    document.getElementById("mainDiv").appendChild(loginPage.loginPageNode());
    document.getElementById("loginForm").onsubmit = onLogin;
  } else if (state === 1) {
    document.getElementById("mainDiv").innerHTML = dom.mainString();

    // console.log("data: ", newCars);
    updateTable(newCars);
    dom.addYearOption();
    // add onclick property
    dom.addOnclickById("searchButton", searchByName);
    dom.addOnclickById("submitButton", () => {
      const fieldValue = {
        name: document.getElementById("name"),
        price: document.getElementById("price"),
        year: document.getElementById("year"),
      };
      dom.verifySubmit(fieldValue, editState, newCars, (newData) => {
        newCars.push(newData);
        updateTable(newCars);
      });
    });
  }
}

function onLogin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  // send request (to do)
  stateOfWeb = 1;
  renderBaseOnState(stateOfWeb);
}

function updateTable(showedCars) {
  return dom.updateTable(showedCars, editRow, deleteRow);
}

function removeAllCarById(id) {
  newCars = newCars.filter((car) => car.id !== id);
  searchedCars = searchedCars.filter((car) => car.id !== id);
}

function deleteRow(i) {
  if (editState == 0) {
    if (searchedState == 0) {
      const id = dom.deleteCarById(newCars, i);
      removeAllCarById(id);
      updateTable(newCars);
    } else {
      const id = dom.deleteCarById(searchedCars, i);
      removeAllCarById(id);
      updateTable(searchedCars);
    }
  } else {
    dom.changeRedVerifiedText("You are in edit mode!");
  }
}

function changeRowToFormMain(showedCars, i) {
  return dom.changeRowToForm(showedCars, i, updateData, cancelUpdate);
}

function editRow(i) {
  if (editState === 0) {
    editState = 1;
    if (searchedState === 0) {
      changeRowToFormMain(newCars, i);
    } else {
      changeRowToFormMain(searchedCars, i);
    }
  }
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
  const response = api
    .htmlMethod("PUT", tempData)
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

function cancelUpdate() {
  updateTable(newCars);
  editState = 0;
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
  filterDict[`filterWord${filterCounter}`] = filterWord;
  const filterNode = dom.createFilterNode(filterWord, filterCounter);
  document.getElementById("filter").appendChild(filterNode);
  dom.addOnclickById(`cancel${filterCounter}`, function () {
    const num = this.id.substring(6);
    deleteFilter(num);
  });
}

function deleteFilter(num) {
  const id = `filterWord${num}`;
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

// แก้ search field เป็น show filter with cancel button (DONE!)
// เพิ่ม ปีผลิต(string) วันเวลาที่เพิ่มเข้าไปในดาต้าเบส(datetime) กับ วันเวลาที่แก้ไข(datetime)
// แก้ HTML method ให้เป็นฟังก์ชั่น เพราะใช้ซ้ำ (DONE!)
// ทำให้ปีแก้ไขได้ (DONE!)
// เพิ่ม Added Date/ Modified Date ทุกครั้งที่กด submit เข้าไปในดาต้าเบสด้วย(DONE!)
// แยกฟังก์ชั่นเป็นโมดูลต่างๆไว้ file อื่นๆ (on progress)
// แก้ code ให้เวิร์คจจร้าาา (filter) (Done!)
