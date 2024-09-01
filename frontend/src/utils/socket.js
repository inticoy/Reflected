class SocketManager {
  static persistentSockets = {};
  static sessionSockets = {};

  static initSocket(name, path, isPersistent = false) {
    const accessToken = localStorage.getItem("accessToken");
    const wsScheme = window.location.protocol === "https:" ? "wss" : "ws";
    const wsUrl = `${wsScheme}://localhost:2344/ws/${path}?token=${accessToken}`;

    const socket = new WebSocket(wsUrl);
    this.add(name, socket, isPersistent);
  }

  static setOpenHandler(name, handler, isPersistent = false) {
    const socket = isPersistent
      ? this.persistentSockets[name]
      : this.sessionSockets[name];
    if (socket) {
      socket.onopen = handler;
    } else {
      console.error(`Socket '${name}' not found`);
    }
  }

  static setCloseHandler(name, handler, isPersistent = false) {
    const socket = isPersistent
      ? this.persistentSockets[name]
      : this.sessionSockets[name];
    if (socket) {
      socket.onclose = handler;
    } else {
      console.error(`Socket '${name}' not found`);
    }
  }

  static setErrorHandler(name, handler, isPersistent = false) {
    const socket = isPersistent
      ? this.persistentSockets[name]
      : this.sessionSockets[name];
    if (socket) {
      socket.onerror = handler;
    } else {
      console.error(`Socket '${name}' not found`);
    }
  }

  static setMessageHandler(name, handler, isPersistent = false) {
    const socket = isPersistent
      ? this.persistentSockets[name]
      : this.sessionSockets[name];
    if (socket) {
      socket.onmessage = handler;
    } else {
      console.error(`Socket '${name}' not found`);
    }
  }

  static add(name, socket, isPersistent = false) {
    if (isPersistent) this.persistentSockets[name] = socket;
    else this.sessionSockets[name] = socket;
  }

  static close(name, isPersistent = false) {
    if (isPersistent) {
      this.persistentSockets[name].close();
      delete this.persistentSockets[name];
    } else {
      this.sessionSockets[name].close();
      delete this.sessionSockets[name];
    }
  }

  static send(name, data, isPersistent = false) {
    const socket = isPersistent
      ? this.persistentSockets[name]
      : this.sessionSockets[name];
    if (socket) {
      socket.send(data);
    } else {
      console.error(`Socket '${name}' not found`);
    }
  }

  static endSession() {
    Object.keys(this.sessionSockets).forEach((name) => {
      this.close(name);
    });
  }
}

export default SocketManager;
