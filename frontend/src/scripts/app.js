import { switchApp } from "/src/scripts/utils/display.js";
import { login } from "/src/scripts/view/login.js";

window.addEventListener("load", login);
document.addEventListener("DOMContentLoaded", switchApp);

document.getElementById("logout").addEventListener("click", function () {
  window.localStorage.removeItem("accessToken");
  window.localStorage.removeItem("refreshToken");
  login();
});
