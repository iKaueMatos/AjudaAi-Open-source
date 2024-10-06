import { validateStep } from "/js/module/validation/validation.js";
import { clearPreview } from "/js/module/helper/preview.js";
import { saveFormData } from "/js/module/helper/localstorage.js";

let currentStepIndex = parseInt(localStorage.getItem('currentStepIndex')) || 0;

export function nextStep() {
  saveFormData();
  if (validateStep(currentStepIndex + 1)) {
    currentStepIndex++;
    const totalSteps = document.querySelectorAll(".step").length;

    if (currentStepIndex < totalSteps) {
      showStep(currentStepIndex + 1);
      localStorage.setItem("currentStepIndex", currentStepIndex);
    }
  }
}

export function previousStep() {
  saveFormData();
  if (currentStepIndex > 0) {
    currentStepIndex--;
    showStep(currentStepIndex + 1);
    localStorage.setItem("currentStepIndex", currentStepIndex);
  }

  if (preview.innerHTML) {
    clearPreview();
  }
}

export function showStep(step) {
  document.querySelectorAll('.step').forEach(el => el.classList.add('hidden'));
  const currentStep = document.getElementById(`step-${step}`);
  if (currentStep) {
    currentStep.classList.remove('hidden');
    updateProgress(step);
  }
}

export function restoreStep() {
  if (currentStepIndex > 0) {
    showStep(currentStepIndex + 1);
  }
}