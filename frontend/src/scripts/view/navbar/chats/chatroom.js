import { getAPI, postAPI } from "/src/scripts/utils/fetch.js";
import { showToast } from "/src/scripts/utils/toast.js";

const chatroomList = document.getElementById("chatrooms-list");
const chatroom = document.getElementById("chatroom");
const chatroomBottom = document.getElementById("chatroom-bottom");
const chatList = document.getElementById("chats-list");
const chatInput = document.getElementById("chatting-input");
const chatSendBtn = document.getElementById("btn-sendchat");
const myNickname = localStorage.getItem("nickname");

export async function updateChatroom(chatroomId) {
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
  const accessToken = localStorage.getItem("accessToken");

  const wsScheme = window.location.protocol === "https:" ? "wss" : "ws";
  const wsUrl = `${wsScheme}://localhost:2344/ws/chats/?token=${accessToken}`;
  const socket = new WebSocket(wsUrl);

  socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    console.log("new message");
    console.log(data);
  };

  socket.onclose = function (event) {
    console.error("WebSocket closed unexpectedly:", event);
  };

  socket.onopen = function (event) {
    console.log("WebSocket connection opened:", event);
  };

  socket.onerror = function (event) {
    console.error("WebSocket error observed:", event);
  };
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
