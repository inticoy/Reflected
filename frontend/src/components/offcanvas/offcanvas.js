import ModalManager from "../modal/modal.js";

class OffcanvasManager {
  static offcanvases = {};

  static initOffcanvas(id) {
    const element = document.getElementById(id);
    if (element) {
      return (
        bootstrap.Offcanvas.getInstance(element) ||
        new bootstrap.Offcanvas(element)
      );
    } else {
      return null;
    }
  }

  static show(id) {
    this.hideAll();
    ModalManager.hideAll();

    const offcanvas = this.getOffcanvasInstance(id);
    if (offcanvas) {
      offcanvas.show();
    }
  }

  static hide(id) {
    const offcanvas = this.getOffcanvasInstance(id);
    if (offcanvas) {
      offcanvas.hide();
    }
  }

  static hideAll() {
    Object.keys(this.offcanvases).forEach((id) => {
      this.hide(id);
    });
  }

  static getOffcanvasInstance(id) {
    if (!this.offcanvases[id]) {
      this.offcanvases[id] = this.initOffcanvas(id);
    }
    return this.offcanvases[id];
  }
}

export default OffcanvasManager;
