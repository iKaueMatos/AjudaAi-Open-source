import redmensioning from '/js/pages/redmensioning/redmensioning.js';
import * as pages from '/js/pages/pages.js';

window.nextStep = redmensioning.nextStep;
window.previousStep = redmensioning.previousStep;
window.closeMenu = pages.closeMenu;
window.openMenu = pages.openMenu;
window.startLoding = redmensioning.startLoding;

document.addEventListener("DOMContentLoaded", () => {
  if (location === "redmensioning") {
    redmensioning.inicializeDragAndDrop();
  }
});