function loginPageString() {
  return `<form>
    <label for="username">Username: </label><input type="text" id="username"/><br>
    <label for="password">Password: </label><input type="text" id="password"/><br>
    <button id="loginButton" value="Login" type="submit">LOGIN</button>
</form>`;
}

export { loginPageString };
