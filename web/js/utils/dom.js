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
export { addOnclickById, changeTextProperty, changeRedVerifiedText };
