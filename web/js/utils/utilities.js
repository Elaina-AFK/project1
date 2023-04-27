function formatDate(date) {
  const d = new Date(date);
  return `${timeFormat(d.getDate())}-${timeFormat(
    d.getMonth() + 1
  )}-${d.getFullYear()}\n${timeFormat(d.getHours())}:${timeFormat(
    d.getMinutes()
  )}:${timeFormat(d.getSeconds())}`;
}

function timeFormat(str) {
  const tStr = String(str);
  if (tStr.length === 2) return tStr;
  if (tStr.length === 1) return "0" + tStr;
}

function removeItemFromList(listOfData, item) {
  let index = listOfData.indexOf(item);
  if (index !== -1) {
    listOfData.splice(index, 1);
  }
}

function sortObjectByPropHighToLow(object, propName) {
  if (typeof object[0][propName] === "string") {
    object.sort((a, b) => {
      if (a[propName] > b[propName]) {
        return 1;
      }
      if (a[propName] < b[propName]) {
        return -1;
      }
      return 0;
    });
  } else if (typeof object[0][propName] === "number") {
    object.sort((a, b) => b[propName] - a[propName]);
  }
}

function sortObjectByPropLowToHigh(object, propName) {
  if (typeof object[0][propName] === "string") {
    object.sort((a, b) => {
      if (a[propName] < b[propName]) {
        return 1;
      }
      if (a[propName] > b[propName]) {
        return -1;
      }
      return 0;
    });
  } else if (typeof object[0][propName] === "number") {
    object.sort((a, b) => a[propName] - b[propName]);
  }
}

function verifiedText(value, elementStr) {
  if (value === "") {
    return `This ${elementStr} is empty!`;
  } else if (value.indexOf(" ") >= 0) {
    return `This ${elementStr} have spaces!`;
  }
}

export {
  formatDate,
  removeItemFromList,
  sortObjectByPropHighToLow,
  sortObjectByPropLowToHigh,
  verifiedText,
};
