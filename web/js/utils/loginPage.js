import api from "./api.js";

function loginPageNode(callbackFn) {
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

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    verifying(callbackFn);
  });

  return form;
}

function verifying(callbackFn) {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const loginData = {
    username,
    password,
  };
  api
    .htmlMethod("POST", loginData, "/api/loginData")
    .then((res) => res.json())
    .then((res) => {
      console.log(res.message);
      callbackFn();
    });
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

function themeTogglerNode() {
  const node = document.createElement("div");
  node.className = "navbar";
  node.appendChild(themeList());
  return node;
}

function themeList() {
  const ul = document.createElement("ul");
  ul.className = "navbar-nav";
  ul.appendChild(addTheme("#D291BC", "css1"));
  ul.appendChild(addTheme("#00adb5", "css2"));
  ul.appendChild(addTheme("#FFAFCC", "css3"));
  return ul;
}

function addTheme(terColor, styleId) {
  const li = document.createElement("li");
  li.className = "nav-item";
  const div = document.createElement("div");
  div.className = "themeToggler";
  div.style.backgroundColor = terColor;
  div.addEventListener("click", () => {
    disableAllCss();
    document.getElementById(styleId).disabled = false;
  });
  li.appendChild(div);
  return li;
}

function disableAllCss() {
  const css1 = document.getElementById("css1");
  const css2 = document.getElementById("css2");
  const css3 = document.getElementById("css3");
  css1.disabled = true;
  css2.disabled = true;
  css3.disabled = true;
}

export default { loginPageNode, themeTogglerNode };
