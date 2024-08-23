import { setAppSwitch, navigateTo } from "/src/utils/display.js";
import { login, setLogin } from "/src/utils/login.js";
import { setHome, updateHome } from "/src/views/home.js";
import { setPlay } from "/src/views/home/play.js";
import { setNavbar, updateNavbar, initWebSocket } from "/src/views/navbar.js";

function setApp() {
  setAppSwitch();

  setLogin();
  setNavbar();
  setHome();
  setPlay();
}

document.addEventListener("DOMContentLoaded", async function () {
  setApp();
  const loginSuccess = await login();
  if (loginSuccess) {
    navigateTo("app-home", false);
    updateHome();
    updateNavbar();
    initWebSocket();
  } else {
    navigateTo("app-login", false);
  }
});
