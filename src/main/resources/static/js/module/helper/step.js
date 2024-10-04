import { clearPreview } from "./preview";
import { saveFormData } from "./redmensioning";

let currentStepIndex = parseInt(localStorage.getItem('currentStepIndex')) || 0;

export function nextStep() {
  saveFormData(); // Save form data before moving to next step
  currentStepIndex++;
  const totalSteps = document.querySelectorAll(".step").length;

  if (currentStepIndex < totalSteps) {
    showStep(currentStepIndex + 1);
    localStorage.setItem("currentStepIndex", currentStepIndex); // Save current step
  }
}

export function previousStep() {
  saveFormData(); // Save form data before moving to previous step
  if (currentStepIndex > 0) {
    currentStepIndex--;
    showStep(currentStepIndex + 1);
    localStorage.setItem("currentStepIndex", currentStepIndex); // Save current step
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