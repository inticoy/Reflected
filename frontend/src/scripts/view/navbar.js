import {
  updateNotifications,
  alertNotifications,
} from "/src/scripts/view/navbar/notifications.js";
import { setFriends, updateFriends } from "/src/scripts/view/navbar/friends.js";
import {
  setAddFriend,
  updateFriendRequests,
} from "/src/scripts/view/navbar/friends/friendRequests.js";
import {
  setChatrooms,
  updateChatrooms,
  alertChats,
} from "/src/scripts/view/navbar/chats.js";

export function setNavbar() {
  setLogout();
  setBack();
  setFriends();
  setChatrooms();
}

export function updateNavbar() {
  setAddFriend();
  updateNotifications();
  updateFriends();
  updateFriendRequests();
  updateChatrooms();
}

export function initWebSocket() {
  alertNotifications();
  alertChats();
}

function setLogout() {
  const navLogoutBtn = document.getElementById("nav-logout-btn");
  navLogoutBtn.addEventListener("click", function () {
    window.localStorage.clear();
    window.history.replaceState(null, document.title, window.location.origin);
    location.reload(true);
  });
}

function setBack() {
  const navBackBtn = document.getElementById("nav-back-btn");
  navBackBtn.addEventListener("click", function () {
    window.history.back();
  });
}
