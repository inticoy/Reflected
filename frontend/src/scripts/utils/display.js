const apps = document.querySelectorAll(".container-app");

export function hideApps() {
  apps.forEach((app) => {
    app.classList.replace("d-block", "d-none");
  });
}

export function showApp(targetApp) {
  const target = document.getElementById(targetApp);
  if (target) {
    target.classList.replace("d-none", "d-block");
  }
}

export function navigateTo(targetApp, addToHistory = true) {
  hideApps();
  showApp(targetApp);

  if (addToHistory) {
    history.pushState({ page: targetApp }, "", "/" + targetApp);
  }
}

export function switchApp() {
  document.getElementById("playBtn").addEventListener("click", function () {
    navigateTo("play");
  });

  document
    .getElementById("collectionsBtn")
    .addEventListener("click", function () {
      navigateTo("collections");
    });

  document.getElementById("storeBtn").addEventListener("click", function () {
    navigateTo("store");
  });

  document.getElementById("mypageBtn").addEventListener("click", function () {
    navigateTo("mypage");
  });

  window.addEventListener("popstate", function (event) {
    if (event.state && event.state.page) {
      navigateTo(event.state.page, false);
    } else {
      navigateTo("home", false);
    }
  });
}
