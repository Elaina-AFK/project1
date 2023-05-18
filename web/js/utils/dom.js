import utilities from "./utilities.js";
import api from "./api.js";

function addOnclickById(id, func) {
  document.getElementById(id).addEventListener("click", func);
}
function changeTextProperty(id, colorText, text) {
  document.getElementById(id).style = "color: " + colorText;
  document.getElementById(id).innerHTML = text;
}
function changeRedVerifiedText(text) {
  changeTextProperty("verifiedText", "Red", text);
}

function mainString() {
  return `<h2 class="middle">Cars Table 🚘</h2>
  <form class="center">
      <input type="text" id="searchBar" placeholder="Search by Name">
      <input id="searchButton" type="button" value="search" class="button">
      <div id="filter"></div>
  </form>
  <table id="demo" class="table table-striped table-bordered table-hover table-dark"></table>
  <p id="verifiedText" style="color: Red;"></p>
  <form class="center">
      <label for="name">Name: </label><input type="text" id="name">
      <label for="price">Price: </label><input type="text" id="price">
      <label for="year">Year: </label><select id="year" name="year"></select>
      <input id="submitButton" type="button" value="Submit" class="button">
  </form>`;
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
  const editHead =
    "<th scope='col' class='no-hover'></th><th scope='col' class='no-hover'></th>";
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

function updateTable(showedCars, editRow, deleteRow) {
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
    text += utilities.formatDate(showedCars[i]["added"]);
    text += table_buffer;
    text += utilities.formatDate(showedCars[i]["modified"]);
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
  initiateOnClickArrange(showedCars);
}

function initiateOnClickArrange(showedCars) {
  addOnclickById("nameHead", () => hightoLow(showedCars, "name", "nameHead"));
  addOnclickById("priceHead", () =>
    hightoLow(showedCars, "price", "priceHead")
  );
  addOnclickById("yearHead", () => hightoLow(showedCars, "year", "yearHead"));
  addOnclickById("addHead", () => hightoLow(showedCars, "added", "addHead"));
  addOnclickById("modifyHead", () =>
    hightoLow(showedCars, "modified", "modifyHead")
  );
}

function hightoLow(showedCars, propName, buttonID) {
  utilities.sortObjectByPropHighToLow(showedCars, propName);

  //updateTable
  updateTable(showedCars);

  //change button
  addOnclickById(buttonID, () => lowtoHigh(showedCars, propName, buttonID));
}

function lowtoHigh(showedCars, propName, buttonID) {
  utilities.sortObjectByPropLowToHigh(showedCars, propName);
  //updateTable
  updateTable(showedCars);

  //change button
  addOnclickById(buttonID, () => hightoLow(showedCars, propName, buttonID));
}

function verifyCarName(allName, value) {
  if (allName.includes(value)) {
    return "This name is duplicated!";
  }
  return utilities.verifiedText(value, "name");
}

function verifyPrice(value) {
  if (isNaN(value)) {
    return "This price is not a number!";
  }
  return utilities.verifiedText(value, "price");
}

function verifyYear(value) {
  return utilities.verifiedText(value, "year");
}

function clearInputForm(nameId, priceId, yearId) {
  nameId.value = "";
  priceId.value = "";
  yearId.value = "2023";
}

function getInputfunc(nameId, priceId, yearId, callBackFn) {
  const temp = {
    name: nameId.value,
    price: priceId.value,
    year: yearId.value,
  };
  const response = api
    .htmlMethod("POST", temp)
    .then((res) => res.json())
    .then((res) => {
      console.log(res.message);
      const newData = {
        ...temp,
        id: res.id,
        added: res.added,
        modified: res.modified,
      };
      callBackFn(newData);
    });
}

function getNameData(carData) {
  return carData.map((car) => car["name"]);
}

export default {
  addOnclickById,
  changeTextProperty,
  changeRedVerifiedText,
  mainString,
  updateTable,
  verifyCarName,
  verifyPrice,
  verifyYear,
  clearInputForm,
  getInputfunc,
  getNameData,
};
