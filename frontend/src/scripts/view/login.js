import { getHostname, getDjangoPort } from "../utils/var.js";

const main = document.getElementById("main-content");
const apps = document.querySelectorAll(".container-app");

export function showLogin() {
  apps.forEach((app) => {
    app.classList.replace("d-block", "d-none");
  });

  // 요청받은 섹션만 보여줍니다.
  const targetSection = document.getElementById("login");
  if (targetSection) {
    targetSection.classList.replace("d-none", "d-block");
  }

  const ftLoginButton = document.getElementById("btn-oauth-ft");
  const googleLoginButton = document.getElementById("btn-oauth-google");
  const naverLoginButton = document.getElementById("btn-oauth-naver");

  ftLoginButton.href =
    "http://" + getHostname() + ":" + getDjangoPort() + "/v1/auth/oauth/ft";
  googleLoginButton.href =
    "http://" + getHostname() + ":" + getDjangoPort() + "/v1/auth/oauth/google";
  naverLoginButton.href =
    "http://" + getHostname() + ":" + getDjangoPort() + "/v1/auth/oauth/naver";
}
