import redmensioning from '/js/pages/redmensioning/redmensioning.js';
import * as pages from '/js/pages/pages.js';

window.nextStep = redmensioning.nextStep;
window.previousStep = redmensioning.previousStep;

document.addEventListener("DOMContentLoaded", () => {
  if (location === "redmensioning") {
    redmensioning.inicializeDragAndDrop();
  }
});