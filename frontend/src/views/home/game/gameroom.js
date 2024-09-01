import Api from "/src/utils/api.js";
import { HTTPCODE, API_CONFIG } from "/src/utils/variables.js";
import { navigateTo } from "../../../utils/display.js";

const gameName = document.getElementById("gameroom-name");
const gameMemberList = document.getElementById("gameroom-member-list");

const gameCodeCopyBtn = document.getElementById("gameroom-code-copy-btn");
const codeText = document.getElementById("gameroom-code");

const gameStartBtn = document.getElementById("game-start");
const gameStartIcon = document.getElementById("game-start-icon");
const gameStartText = document.getElementById("game-start-text");

const ball = document.getElementById("ball");
const opponentSlider = document.getElementById("opponent-slider");
const mySlider = document.getElementById("my-slider");
const opponentScore = document.getElementById("game-opponent-score");
const myScore = document.getElementById("game-my-score");

export function setGameroom() {
  gameCodeCopyBtn.addEventListener("click", () => {
    navigator.clipboard
      .writeText(codeText.textContent)
      .then(() => {
        alert("copy success " + codeText.textContent);
      })
      .catch((err) => {
        console.error("fail");
      });
  });
}

export async function updateGameroom(gameId) {
  const socket = initGameSocket(gameId);
  updateGameMember(gameId);
  updateStartBtn(gameId, socket);
}

function initGameSocket(gameId) {
  const accessToken = localStorage.getItem("accessToken");
  const wsScheme = window.location.protocol === "https:" ? "wss" : "ws";
  const wsUrl = `${wsScheme}://localhost:2344/ws/games/multi/${gameId}/?token=${accessToken}`;
  const socket = new WebSocket(wsUrl);

  socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    console.log(data);
    if (data.type === "member_update") {
      updateGameMember(gameId);
    } else if (data.type === "ready_update") {
      updateGameMember(gameId, data.detail);
    } else if (data.type === "game_start") {
      addSliderController();
      navigateTo("app-game");
      requestAnimationFrame(moveBall);
    }
  };

  socket.onclose = function (event) {
    console.error("WebSocket closed unexpectedly:", event);
  };

  socket.onopen = function (event) {
    console.log("WebSocket connection opened:", event);
    socket.send(JSON.stringify({ type: "join" }));
  };

  socket.onerror = function (event) {
    console.error("WebSocket error observed:", event);
  };

  return socket;
}

async function updateStartBtn(gameId, socket) {
  const response = await Api.get(`${API_CONFIG.ENDPOINT.GAMES}${gameId}`);
  if (!response.ok) {
  }
  const data = await response.json();

  if (data.host.nickname === localStorage.getItem("nickname")) {
    gameStartBtn.addEventListener("click", () => {
      socket.send(JSON.stringify({ type: "start" }));
    });
  } else {
    gameStartBtn.addEventListener("click", () => {
      socket.send(JSON.stringify({ type: "ready" }));
    });
  }

  if (data.host.nickname === localStorage.getItem("nickname")) {
    gameStartIcon.innerText = "videogame_asset";
    gameStartText.innerText = "시작하기";
  } else {
    gameStartIcon.innerText = "check";
    gameStartText.innerText = "준비하기";
  }
}

async function updateGameMember(gameId, readyState = "unready") {
  const response = await Api.get(`${API_CONFIG.ENDPOINT.GAMES}${gameId}`);
  if (!response.ok) {
  }
  const data = await response.json();
  gameName.textContent = data.name;
  codeText.textContent = data.code;

  gameMemberList.innerHTML = "";

  gameMemberList.innerHTML += `
    <div class="list d-flex flex-row justify-content-between px-3 py-2">
      <div
        class="d-flex flex-row gap-3 align-middle align-items-center"
      >
        <span class="yellow material-symbols-rounded"> kid_star </span>
        <div
          class="d-flex flex-column gap-2 justify-content-between align-items-start"
        >
          <span class="medium"> ${data.host.nickname} </span>
          <span class="small"> GOLD </span>
        </div>
      </div>
      <div class="d-none flex-column gap-1 align-items-end">
        <div
          type="button"
          class="btn-navbar rounded-circle p-0 d-flex flex-row align-items-center justify-content-center"
        >
          <span class="material-symbols-rounded"> close </span>
        </div>
      </div>
    </div>
  `;

  if (data.guest) {
    gameMemberList.innerHTML += `
      <div class="list d-flex flex-row justify-content-between px-3 py-2">
        <div
          class="d-flex flex-row gap-3 align-middle align-items-center"
        >
          <span class="${
            readyState === "ready" ? "green" : "red"
          } material-symbols-rounded"> ${
      readyState === "ready" ? "check" : "close"
    } </span>
          <div
            class="d-flex flex-column gap-2 justify-content-between align-items-start"
          >
            <span class="medium"> ${data.guest.nickname} </span>
            <span class="small"> GOLD </span>
          </div>
        </div>
        <div class="d-none flex-column gap-1 align-items-end">
          <div
            type="button"
            class="btn-navbar rounded-circle p-0 d-flex flex-row align-items-center justify-content-center"
          >
            <span class="material-symbols-rounded"> close </span>
          </div>
        </div>
      </div>
    `;
  }
}

function addSliderController() {
  document.addEventListener("keydown", function (event) {
    const step = 3;

    let leftPixel = parseFloat(window.getComputedStyle(mySlider).left);
    let parentWidth = mySlider.parentElement.clientWidth;
    let leftPercent = (leftPixel / parentWidth) * 100;

    if (event.key === "ArrowLeft") {
      leftPercent = Math.max(leftPercent - step, 10);
    } else if (event.key === "ArrowRight") {
      leftPercent = Math.min(leftPercent + step, 90);
    }
    mySlider.style.left = leftPercent + "%";
  });
}

let ballSpeedX = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 1 + 0.5);
let ballSpeedY = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 1 + 0.5);

function moveBall() {
  let parentWidth = ball.parentElement.clientWidth;
  let parentHeight = ball.parentElement.clientHeight;

  let leftPixel = parseFloat(window.getComputedStyle(ball).left);
  let topPixel = parseFloat(window.getComputedStyle(ball).top);

  let leftPercent = (leftPixel / parentWidth) * 100;
  let topPercent = (topPixel / parentHeight) * 100;

  let newLeft = leftPercent + ballSpeedX;
  let newTop = topPercent + ballSpeedY;

  // 슬라이더의 위치 및 크기 가져오기
  let myLeftPixel = parseFloat(window.getComputedStyle(mySlider).left);
  let myTopPixel = parseFloat(window.getComputedStyle(mySlider).top);
  let myWidthPercent = (mySlider.offsetWidth / parentWidth) * 100;
  let myHeightPercent = (mySlider.offsetHeight / parentHeight) * 100;

  let myLeftPercent = (myLeftPixel / parentWidth) * 100;
  let myTopPercent = (myTopPixel / parentHeight) * 100;

  let opponentLeftPixel = parseFloat(
    window.getComputedStyle(opponentSlider).left
  );
  let opponentTopPixel = parseFloat(
    window.getComputedStyle(opponentSlider).top
  );
  let opponentWidthPercent = (opponentSlider.offsetWidth / parentWidth) * 100;
  let opponentHeightPercent =
    (opponentSlider.offsetHeight / parentHeight) * 100;

  let opponentLeftPercent = (opponentLeftPixel / parentWidth) * 100;
  let opponentTopPercent = (opponentTopPixel / parentHeight) * 100;

  // 공이 슬라이더에 충돌하는지 확인
  if (
    newLeft >= myLeftPercent - myWidthPercent / 2 &&
    newLeft <= myLeftPercent + myWidthPercent / 2 &&
    newTop >= myTopPercent - myHeightPercent / 2 &&
    newTop <= myTopPercent + myHeightPercent / 2
  ) {
    // 공이 슬라이더에 충돌하면 Y 방향을 반사
    ballSpeedY = -ballSpeedY;
    newTop = myTopPercent - myHeightPercent;
  }

  if (
    newLeft >= opponentLeftPercent - opponentWidthPercent / 2 &&
    newLeft <= opponentLeftPercent + opponentWidthPercent / 2 &&
    newTop >= opponentTopPercent - opponentHeightPercent / 2 &&
    newTop <= opponentTopPercent + opponentHeightPercent / 2
  ) {
    // 공이 슬라이더에 충돌하면 Y 방향을 반사
    ballSpeedY = -ballSpeedY;
    newTop = opponentTopPercent + opponentHeightPercent;
  }

  if (newLeft >= 100) {
    ballSpeedX = -ballSpeedX;
    newLeft = 100;
  }
  if (newLeft <= 0) {
    newLeft = 0;
    ballSpeedX = -ballSpeedX;
  }

  if (newTop >= 100) {
    ballSpeedY = -ballSpeedY;
    newTop = 100;
    opponentScore.textContent = Number(opponentScore.textContent) + 1;
    ball.style.left = "50%";
    ball.style.top = "50%";
  } else if (newTop <= 0) {
    newTop = 0;
    ballSpeedY = -ballSpeedY;
    myScore.textContent = Number(myScore.textContent) + 1;
    ball.style.left = "50%";
    ball.style.top = "50%";
  } else {
    ball.style.left = newLeft + "%";
    ball.style.top = newTop + "%";
  }
  requestAnimationFrame(moveBall);
}
