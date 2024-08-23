import OffcanvasManager from "../components/offcanvas/offcanvas.js";

import {
  updateNotifications,
  alertNotifications,
} from "./navbar/notifications.js";
import { setFriends, updateFriends } from "./navbar/friends.js";
import {
  setAddFriend,
  updateFriendRequests,
} from "./navbar/friends/friendRequests.js";
import { setChats, updateChats, alertChats } from "./navbar/chats.js";

const notificationsBtn = document.getElementById("nav-notifications-btn");
const friendsBtn = document.getElementById("nav-friends-btn");
const chatsBtn = document.getElementById("nav-chats-btn");

export function setNavbar() {
  notificationsBtn.addEventListener("click", () => {
    OffcanvasManager.show("offcanvas-notifications");
  });
  friendsBtn.addEventListener("click", () => {
    OffcanvasManager.show("offcanvas-friends");
  });
  chatsBtn.addEventListener("click", () => {
    OffcanvasManager.show("offcanvas-chats");
  });

  setLogout();
  setBack();
  setFriends();
  setChats();
}

export function updateNavbar() {
  setAddFriend();
  updateNotifications();
  updateFriends();
  updateFriendRequests();
  updateChats();
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
