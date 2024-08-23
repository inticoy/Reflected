import OffcanvasManager from "../offcanvas/offcanvas.js";

class ModalManager {
  static modals = {};

  static initModal(id) {
    const element = document.getElementById(id);
    if (element) {
      return (
        bootstrap.Modal.getInstance(element) ||
        new bootstrap.Modal(element, { backdrop: false })
      );
    } else {
      return null;
    }
  }

  static show(id) {
    this.hideAll();
    OffcanvasManager.hideAll();

    const modal = this.getModalInstance(id);
    if (modal) {
      modal.show();
    }
  }

  static hide(id) {
    const modal = this.getModalInstance(id);
    if (modal) {
      modal.hide();
    }
  }

  static hideAll() {
    Object.keys(this.modals).forEach((id) => {
      this.hide(id);
    });
  }

  static getModalInstance(id) {
    if (!this.modals[id]) {
      this.modals[id] = this.initModal(id);
    }
    return this.modals[id];
  }
}

export default ModalManager;
