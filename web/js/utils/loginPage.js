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

function themeTogglerNode() {
  const node = createElementWithId("div", "themeToggler");
  themeHover(node);
  node.addEventListener("click", () => {
    switchCss();
    themeHover(node);
  });
  return node;
}

function switchCss() {
  const css1 = document.getElementById("css1");
  const css2 = document.getElementById("css2");

  if (css1.disabled) {
    css1.disabled = false;
    css2.disabled = true;
  } else {
    css1.disabled = true;
    css2.disabled = false;
  }
}

function themeHover(themeNode) {
  const base = getComputedStyle(document.body).getPropertyValue(
    "--tertiary-color"
  );
  const css1 = "#D291BC";
  const css2 = "#00adb5";

  if (base === css1) {
    themeNode.addEventListener("mouseover", () => {
      themeNode.style.backgroundColor = css2;
    });
    themeNode.addEventListener("mouseout", () => {
      themeNode.style.backgroundColor = css1;
    });
  } else if (base === css2) {
    themeNode.addEventListener("mouseover", () => {
      themeNode.style.backgroundColor = css1;
    });
    themeNode.addEventListener("mouseout", () => {
      themeNode.style.backgroundColor = css2;
    });
  }
}
export default { loginPageNode, themeTogglerNode };
