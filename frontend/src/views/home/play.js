import Api from "/src/utils/api.js";
import ModalManager from "/src/components/modal/modal.js";

import { navigateTo } from "../../utils/display.js";
import { HTTPCODE, API_CONFIG } from "/src/utils/variables.js";
import { showToast } from "../../components/toast/toast.js";
import { setGameroom, updateGameroom } from "./game/gameroom.js";

const gameCreateBtn = document.getElementById("gameroom-list-game-create-btn");
const gameCreateModalBtn = document.getElementById("modal-game-create-btn");
var gameNameInput = document.getElementById("modal-game-create-name-input");

const gameCodeBtn = document.getElementById("gameroom-list-game-code-btn");
const gameCodeModalBtn = document.getElementById("modal-game-code-btn");
var gameCodeInput = document.getElementById("modal-game-code-input");

export async function setPlay() {
  setGameroom();
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
      ModalManager.hide("modal-game-code");
      showToast("close", "red", "방 들어가기를 실패했습니다.");
      return;
    }

    const data = await response.json();
    ModalManager.hide("modal-game-code");
    updateGameroom(data.id);
    navigateTo("app-gameroom");
    gameCodeInput = "";
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
        const response = await Api.post(`${API_CONFIG.ENDPOINT.GAMES}enter/`, {
          code: game.code,
        });
        if (!response.ok) {
          return;
        }
        navigateTo("app-gameroom");
        updateGameroom(game.id);
      });
  }
}
