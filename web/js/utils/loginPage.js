import api from "./api.js";
import utilities from "./utilities.js";

function loginPageNode(renderCallBack) {
  const div = createElementWithId("div", "loginPage");
  const divVerify = createElementWithId("div", "verifyingText");
  // add main content
  div.appendChild(loginNode(renderCallBack));
  div.appendChild(signInNode(renderCallBack));
  div.appendChild(divVerify);
  return div;
}

function loginNode(callbackFn) {
  const form = createElementWithId("form", "loginForm");
  const username = createLabelFor("username", "Username: ");
  const userField = createElementWithId("input", "username");
  const password = createLabelFor("password", "Password: ");
  const passField = createElementWithId("input", "password");
  const submit = createElementWithId("button", "loginSubmit");
  submit.type = "submit";
  submit.className = "button";
  submit.innerHTML = "LOGIN";
  form.appendChild(username);
  form.appendChild(userField);
  form.appendChild(password);
  form.appendChild(passField);
  form.appendChild(submit);
  form.appendChild(signInToggler());
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    verifying(callbackFn);
    userField.value = "";
    passField.value = "";
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
      if (res.status === "pass") {
        changeVerifyText("success", `login as ${username} successful!`);
        callbackFn();
      } else if (res.status === "fail") {
        changeVerifyText("warning", "wrong username or password!");
      }
    });
}

function signInNode(callBackFn) {
  const div = createElementWithId("div", "signInDiv");
  const form = createElementWithId("form", "signInForm");
  const userLabel = createLabelFor("usernameS", "Username: ");
  const username = createElementWithId("input", "usernameS");
  const passLabel = createLabelFor("passwordS", "Password: ");
  const password = createElementWithId("input", "passwordS");
  const fnameLabel = createLabelFor("firstName", "First Name: ");
  const firstName = createElementWithId("input", "firstName");
  const lnameLabel = createLabelFor("lastName", "Last Name: ");
  const lastName = createElementWithId("input", "lastName");
  const submit = document.createElement("button");
  submit.type = "submit";
  submit.className = "button";
  submit.innerHTML = "SIGN IN";
  form.append(
    userLabel,
    username,
    passLabel,
    password,
    fnameLabel,
    firstName,
    lnameLabel,
    lastName,
    submit
  );

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    getSignIn(callBackFn);
  });

  div.appendChild(form);
  div.hidden = true;

  return div;
}

function getSignIn(callBackFn) {
  const username = document.getElementById("usernameS");
  const password = document.getElementById("passwordS");
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  username.setAttribute("required", "");
  password.setAttribute("required", "");
  firstName.setAttribute("required", "");
  lastName.setAttribute("required", "");

  let verifiedText = "";
  verifiedText = utilities.verifiedText(username.value, "username");
  if (verifiedText) return changeVerifyText("warning", verifiedText);
  verifiedText = utilities.verifiedText(password.value, "password");
  if (verifiedText) return changeVerifyText("warning", verifiedText);

  const signInData = {
    username: username.value,
    password: password.value,
    firstName: firstName.value,
    lastName: lastName.value,
  };
  api
    .htmlMethod("POST", signInData, "/api/signInData")
    .then((res) => res.json())
    .then((res) => {
      callBackFn();
      changeVerifyText("warning", res.message);
      username.value = "";
      password.value = "";
      firstName.value = "";
      lastName.value = "";
    });
}

function signInToggler() {
  const label = document.createElement("label");
  const small = document.createElement("small");
  const ins = document.createElement("ins");
  const text = document.createTextNode("no account? Sign in here!");
  ins.appendChild(text);
  small.appendChild(ins);
  label.appendChild(small);

  label.addEventListener("click", function () {
    const signInDiv = document.getElementById("signInDiv");
    const loginSubmit = document.getElementById("loginSubmit");
    if (signInDiv.hidden) {
      signInDiv.hidden = false;
      loginSubmit.disabled = true;
    } else {
      signInDiv.hidden = true;
      loginSubmit.disabled = false;
    }
  });

  return label;
}

function logoutNode(callBackFn) {
  const button = document.createElement("button");
  button.innerHTML = "Logout";
  button.className = "button";
  button.onclick = () => {
    fetch("/api/logout").then(() => callBackFn());
  };
  return button;
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

function verifyTextNode(textType, text) {
  const label = document.createElement("label");
  const strong = document.createElement("strong");
  const textNode = document.createTextNode(text);
  label.className = textType;

  label.appendChild(strong);
  label.appendChild(textNode);

  return label;
}

function changeVerifyText(textType, text) {
  const verifiedDiv = document.getElementById("verifyingText");
  verifiedDiv.innerHTML = "";
  verifiedDiv.appendChild(verifyTextNode(textType, text));
}

export default { loginPageNode, themeTogglerNode, logoutNode };
