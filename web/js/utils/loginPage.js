function loginPageNode() {
  console.log("get called!");
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

export default { loginPageNode };
