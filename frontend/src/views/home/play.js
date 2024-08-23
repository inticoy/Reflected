import Api from "/src/utils/api.js";
import ModalManager from "/src/components/modal/modal.js";

import { navigateTo } from "../../utils/display.js";
import { HTTPCODE, API_CONFIG } from "/src/utils/variables.js";

const ball = document.getElementById("ball");
const opponentSlider = document.getElementById("opponent-slider");
const mySlider = document.getElementById("my-slider");
const opponentScore = document.getElementById("game-opponent-score");
const myScore = document.getElementById("game-my-score");

const gameCreateBtn = document.getElementById("gameroom-list-game-create-btn");
const gameCreateModalBtn = document.getElementById("modal-game-create-btn");
var gameNameInput = document.getElementById("modal-game-create-name-input");

const gameCodeBtn = document.getElementById("gameroom-list-game-code-btn");
const gameCodeModalBtn = document.getElementById("modal-game-code-btn");
var gameCodeInput = document.getElementById("modal-game-code-input");

const gameCodeCopyBtn = document.getElementById("gameroom-code-copy-btn");
const codeText = document.getElementById("gameroom-code");

export async function setPlay() {
  gameCreateBtn.addEventListener("click", () => {
    const nickname = localStorage.getItem("nickname");
    ModalManager.show("modal-game-create");
    gameNameInput.value = nickname ? `${nickname}의 방` : "바로 시작";
  });

  gameCreateModalBtn.addEventListener("click", async () => {
    const gameName = gameNameInput.value;

    if (!gameName) {
      alert("방 제목을 입력하십시오.");
      return;
    }

    const response = await Api.post(`${API_CONFIG.ENDPOINT.GAMES}`, {
      name: gameName,
    });

    switch (response.status) {
      case HTTPCODE.OK:
      case HTTPCODE.CREATED:
        const data = await response.json();
        updateGameroom(data.id);
        navigateTo("app-gameroom");
        break;

      default:
        break;
    }
    gameNameInput.value = "";
  });

  gameCodeBtn.addEventListener("click", () => {
    ModalManager.show("modal-game-code");
  });

  gameCodeModalBtn.addEventListener("click", async () => {
    const gameCode = gameCodeInput.value;

    if (!gameCode) {
      alert("게임 코드를 입력하십시오");
      return;
    } else if (gameCode.length != 6) {
      alert("게임 코드는 6자리입니다.");
      return;
    }

    const response = await Api.post(`${API_CONFIG.ENDPOINT.GAMES}enter/`, {
      code: gameCode,
    });

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    updateGameroom(data.id);
    navigateTo("app-gameroom");
    gameCodeInput = "";
  });

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

export async function updatePlay() {
  const gameList = document.getElementById("gameroom-list");

  const response = await Api.get(`${API_CONFIG.ENDPOINT.GAMES}`);
  if (!response.ok) {
  }
  gameList.innerHTML = "";
  const data = await response.json();
  for (const game of data) {
    gameList.innerHTML += `
      <div 
        id="gameroom-list-${game.id}"
        class="list d-flex flex-row justify-content-between px-3 py-2"
      >
        <div
          class="d-flex flex-row gap-3 align-middle align-items-center"
        >
          <span class="material-symbols-rounded"> ${
            game.status == 0 ? "videogame_asset" : "hourglass_top"
          } </span>
          <span class="medium"> ${game.name} </span>
        </div>
        <div class="d-flex flex-column gap-1 align-items-end">
          <span class="small"> ${game.status == 0 ? "1" : "2"}/2 </span>
          <span class="small"> 일반 방 </span>
        </div>
      </div>`;
  }

  for (const game of data) {
    document
      .getElementById(`gameroom-list-${game.id}`)
      .addEventListener("click", async () => {
        navigateTo("app-gameroom");
        updateGameroom(game.id);
      });
  }
}

export function setPlayButtons() {
  document.getElementById("game-start").addEventListener("click", () => {
    navigateTo("app-game");
    requestAnimationFrame(moveBall);
  });

  addSliderController();
}

export async function updateGameroom(gameId) {
  const gameMemberList = document.getElementById("gameroom-member-list");
  const gameName = document.getElementById("gameroom-name");

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
        <span class="material-symbols-rounded"> videogame_asset </span>
        <div
          class="d-flex flex-column gap-2 justify-content-between align-items-start"
        >
          <span class="medium"> ${data.host.nickname} </span>
          <span class="small"> GOLD </span>
        </div>
      </div>
      <div class="d-flex flex-column gap-1 align-items-end">
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
          <span class="material-symbols-rounded"> videogame_asset </span>
          <div
            class="d-flex flex-column gap-2 justify-content-between align-items-start"
          >
            <span class="medium"> ${data.guest.nickname} </span>
            <span class="small"> GOLD </span>
          </div>
        </div>
        <div class="d-flex flex-column gap-1 align-items-end">
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
