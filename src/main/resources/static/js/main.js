import { previewImages } from "/js/module/helper/redmensioning.js";
import { nextStep, previousStep } from "/js/module/helper/step.js";
import { updateProgress, startLoading } from "/js/module/helper/progress.js";
import { openMenu, closeMenu } from "/js/module/helper/menu.js";

window.previewImages = previewImages;
window.startLoading = startLoading;
window.updateProgress = updateProgress;
window.previousStep = previousStep;
window.nextStep = nextStep;
window.closeMenu = closeMenu;
window.openMenu = openMenu;