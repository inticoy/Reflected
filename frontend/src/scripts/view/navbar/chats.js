import { getAPI } from "/src/scripts/utils/fetch.js";

export function setChatrooms() {
  const chatroomBtn = document.getElementById("nav-chat-btn");
  chatroomBtn.addEventListener("click", updateChatrooms);
}

export async function updateChatrooms() {
  const chatroomList = document.getElementById("chatrooms-list");
  const chatroom = document.getElementById("chatroom");
  chatroomList.show();
  chatroom.hide();

  let response = await getAPI("v1/chatrooms/");
  if (!response.ok) {
    return;
  }
  let data = await response.json();
  const myNickname = localStorage.getItem("nickname");
  chatroomList.innerHTML = "";

  for (let item of data) {
    await (async (item) => {
      let friendNickname = await item.participants.find(
        (participant) => participant !== myNickname
      );
      chatroomList.innerHTML += `
      <div
        id="chatroom-${item.id}"
        class="chatroom-item card card--transparent d-flex flex-row w-100 px-3 py-2 align-items-center justify-content-between"
      >
        <div
          class="chatroom-left d-flex flex-row gap-3 align-items-center"
        >
          <div class="icon">
            <span class="material-symbols-rounded">
              sensors_off
            </span>
          </div>
          <div class="chatroom-info d-flex flex-column gap-1">
            <span class="medium">${friendNickname}</span>
            <span class="small">Recent Message?</span>
          </div>
        </div>
        <div
          class="chatroom-right d-flex flex-column gap-2 align-items-end"
        >
          <span class="small">15</span>
          <span class="small">24.01.01.</span>
        </div>
      </div>
    `;
    })(item);
  }
  for (let item of data) {
    document
      .getElementById(`chatroom-${item.id}`)
      .addEventListener("click", async () => {
        chatroomList.hide();
        chatroom.show();
      });
  }
}
