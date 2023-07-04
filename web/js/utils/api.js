function htmlMethod(method, data, path = "/api/carData") {
  return fetch(path, {
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

function getState(callbackFn) {
  fetch("/api/state")
    .then((res) => res.json())
    .then((res) => {
      callbackFn(res.state);
    });
}

export default { htmlMethod, getState };
