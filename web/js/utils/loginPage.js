function loginPageString() {
  return `<form>
    <label for="username">Username: </label><input type="text" id="username"/><br>
    <label for="password">Password: </label><input type="text" id="password"/><br>
    <button id="loginButton" value="Login" type="submit" class="button">LOGIN</button>
</form>`;
}

export default { loginPageString };
