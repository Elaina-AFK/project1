import api from "./utils/api.js";
import dom from "./utils/dom.js";
import loginPage from "./utils/loginPage.js";

let newCars = [];
let searchedCars = [];
let editState = 0;
let searchedState = 0;
let filterCounter = 0;
let filterDict = {};

renderBaseOnState();

function renderBaseOnState() {
  api.getState((state) => {
    const mainDivNode = document.getElementById("mainDiv");
    if (state === 0) {
      mainDivNode.innerHTML = "";
      //themeToggler
      mainDivNode.appendChild(loginPage.themeTogglerNode());
      mainDivNode.appendChild(loginPage.loginPageNode(renderBaseOnState));
    } else if (state === 1) {
      fetch("/api/carData")
        .then((res) => res.json())
        .then((res) => {
          const cars = res;
          newCars = cars.slice();
          mainDivNode.innerHTML = dom.mainString();
          // themeToggler
          const parent = mainDivNode;
          parent.insertBefore(
            loginPage.themeTogglerNode(),
            mainDivNode.firstChild
          );
          parent.insertBefore(
            loginPage.logoutNode(renderBaseOnState),
            mainDivNode.firstChild
          );

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
        });
    }
  });
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

// ทำระบบ Logout and password
