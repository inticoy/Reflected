import { getAPI, postAPI } from "/src/scripts/utils/fetch.js";
import { showToast } from "/src/scripts/utils/toast.js";

const chatroomList = document.getElementById("chatrooms-list");
const chatroom = document.getElementById("chatroom");
const chatroomBottom = document.getElementById("chatroom-bottom");
const chatList = document.getElementById("chats-list");
const chatInput = document.getElementById("chatting-input");
const chatSendBtn = document.getElementById("btn-sendchat");
const myNickname = localStorage.getItem("nickname");

export function setChatrooms() {
  const chatroomBtn = document.getElementById("nav-chat-btn");
  chatroomBtn.addEventListener("click", updateChatrooms);
}

export async function updateChatrooms() {
  chatroomList.show();
  chatroom.hide();
  chatroomBottom.hide();

  let response = await getAPI("v1/chatrooms/");
  if (!response.ok) {
    return;
  }
  let data = await response.json();
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
      .addEventListener("click", () => {
        updateChatroom(item.id);
      });
  }
}

async function updateChatroom(chatroomId) {
  chatroomList.hide();
  chatroom.show();
  chatroomBottom.show();

  chatSendBtn.addEventListener("click", async () => {
    var message = chatInput.value;
    if (!message) message = "";
    sendChat(chatroomId, message);
  });

  chatList.innerHTML = "";

  let response = await getAPI(`v1/chatrooms/${chatroomId}/chats`);
  if (!response.ok) {
    return;
  }

  let data = await response.json();
  if (data) {
    data.forEach((item) => {
      if (item.from_user.nickname == myNickname) {
        chatList.innerHTML += `
        <div class="chat-message-me d-flex px-3 py-2">
          <div class="d-inline-flex flex-column gap-2">
            <div class="chat-message-box px-3 py-3">
              <span class="medium">${item.message}</span>
            </div>
            <span class="small chat-timestamp">00:00</span>
          </div>
        </div>
      `;
      } else {
        chatList.innerHTML += `
        <div class="chat-message-other d-flex px-3 py-2">
          <div class="d-inline-flex flex-column gap-2">
            <div class="chat-message-box px-3 py-3">
              <span class="medium">${item.message}</span>
            </div>
            <span class="small chat-timestamp">00:00</span>
          </div>
        </div>
      `;
      }
    });
  }
}

async function sendChat(chatroomId, message) {
  let response = await postAPI("v1/chats/", {
    chatroom: chatroomId,
    message: message,
  });
  if (!response.ok) {
    showToast("close", "red", "메세지 전송실패");
    return;
  }
  let data = await response.json();
  {
  }
}
