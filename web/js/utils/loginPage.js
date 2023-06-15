function loginPageNode() {
  // console.log("get called!");
  const form = createElementWithId("form", "loginForm");
  const username = createLabelFor("username", "Username: ");
  const userField = createElementWithId("input", "username");
  const password = createLabelFor("password", "Password: ");
  const passField = createElementWithId("input", "password");
  const submit = document.createElement("button");
  submit.type = "submit";
  submit.className = "button";
  submit.innerHTML = "LOGIN";
  form.appendChild(username);
  form.appendChild(userField);
  form.appendChild(password);
  form.appendChild(passField);
  form.appendChild(submit);

  return form;
}

function createLabelFor(forName, value) {
  const label = document.createElement("label");
  label.htmlFor = forName;
  const text = document.createTextNode(value);
  label.appendChild(text);
  return label;
}

function createElementWithId(nodetype, id) {
  const node = document.createElement(nodetype);
  node.id = id;
  return node;
}

// for myCss.css
/*
function themeTogglerNode() {
  const node = createElementWithId("div", "themeToggler");
  node.addEventListener("click", () => {
    const mainDiv = document.getElementById("mainDiv");
    if (mainDiv.style.getPropertyValue("--base-color") === "#222831") {
      changeThemeColor(mainDiv, "#404258", "#474E68", "#50577A", "#6B728E");
    } else {
      changeThemeColor(mainDiv, "#222831", "#393e46", "#00adb5", "#eeeeee");
    }
  });
  return node;
}

function changeThemeColor(element, main, sec, ter, qua) {
  mainDiv.style.setProperty("--base-color", main);
  mainDiv.style.setProperty("--secondary-color", sec);
  mainDiv.style.setProperty("--tertiary-color", ter);
  mainDiv.style.setProperty("--quaternary-color", qua);
}
*/

export default { loginPageNode };
