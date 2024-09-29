// globals
const preview = document.getElementById('preview');
const previewDiv = document.querySelector('.preview');
let currentStepIndex = parseInt(localStorage.getItem('currentStepIndex')) || 0;

document.addEventListener('DOMContentLoaded', () => {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('formFile');

  restoreStep();
  restoreFiles();
  restoreFormData();

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => dropZone.classList.add('bg-gray-200', 'border-violet-500'), false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => dropZone.classList.remove('bg-gray-200', 'border-violet-500'), false);
  });

  dropZone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    fileInput.files = files;
    previewImages();
    saveFiles(files);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }
});

export function showStep(step) {
  document.querySelectorAll('.step').forEach(el => el.classList.add('hidden'));
  const currentStep = document.getElementById(`step-${step}`);
  if (currentStep) {
    currentStep.classList.remove('hidden');
    updateProgress(step);
  }
}

export function nextStep() {
  saveFormData(); // Save form data before moving to next step
  currentStepIndex++;
  const totalSteps = document.querySelectorAll('.step').length;

  if (currentStepIndex < totalSteps) {
    showStep(currentStepIndex + 1);
    localStorage.setItem('currentStepIndex', currentStepIndex); // Save current step
  }
}

document.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    nextStep();
  }
});

export function previousStep() {
  saveFormData(); // Save form data before moving to previous step
  if (currentStepIndex > 0) {
    currentStepIndex--;
    showStep(currentStepIndex + 1);
    localStorage.setItem('currentStepIndex', currentStepIndex); // Save current step
  }

  if (preview.innerHTML) {
    clearPreview();
  }
}

export function updateProgress(step) {
  const progress = Math.min((step - 1) * 33.33, 100);
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');

  if (progressBar && progressText) {
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${progress.toFixed(0)}%`;
  }
}

export function startLoading() {
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');

  if (progressBar && progressText) {
    progressBar.style.width = '100%';
    progressText.textContent = '100%';
  }
}

export async function previewImages() {
  const files = document.getElementById('formFile').files;
  if (!files || !preview) return;

  preview.innerHTML = '';

  const fileArray = Array.from(files);
  for (const [index, file] of fileArray.entries()) {
    const imgContainer = await createImagePreview(file, index);
    preview.appendChild(imgContainer);
  }

  previewDiv.classList.remove('hidden'); // Ensure previewDiv is visible
}

async function createImagePreview(file, index) {
  const reader = new FileReader();

  const imgContainer = document.createElement('div');
  imgContainer.classList.add('mb-4', 'border', 'border-gray-300', 'p-4', 'rounded-lg', 'bg-white');

  const imgTitle = document.createElement('h3');
  imgTitle.classList.add('font-semibold', 'text-lg', 'mb-2');
  imgTitle.textContent = `Imagem ${index + 1}: ${file.name} (${file.type.split('/')[1].toUpperCase()})`;

  imgContainer.appendChild(imgTitle);

  const img = await new Promise((resolve, reject) => {
    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;
      img.classList.add('w-100', 'h-100', 'object-cover', 'rounded-lg', 'mb-4');

      img.onload = () => resolve(img);
      img.onerror = reject;
    };
    reader.readAsDataURL(file);
  });

  const imgDimensions = document.createElement('p');
  imgDimensions.classList.add('text-sm', 'text-gray-600', 'mb-2');
  imgDimensions.textContent = `Dimensões: ${img.width} x ${img.height} pixels`;

  imgContainer.appendChild(imgDimensions);
  imgContainer.appendChild(img);

  return imgContainer;
}

function clearPreview() {
  preview.innerHTML = '';
}

function saveFiles(files) {
  const fileArray = Array.from(files).map(file => ({
    name: file.name,
    type: file.type,
    size: file.size,
  }));
  localStorage.setItem('uploadedFiles', JSON.stringify(fileArray));
}

function restoreFiles() {
  const files = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
  if (files.length > 0) {
    const dataTransfer = new DataTransfer();
    files.forEach(file => {
      const blob = new Blob([new Uint8Array(file.size)], { type: file.type });
      dataTransfer.items.add(new File([blob], file.name, { type: file.type }));
    });
    document.getElementById('formFile').files = dataTransfer.files;
    previewImages();
  }
}

function restoreStep() {
  if (currentStepIndex > 0) {
    showStep(currentStepIndex + 1);
  }
}

function saveFormData() {
  const formFields = document.querySelectorAll('.step input, .step textarea');
  formFields.forEach(field => {
    localStorage.setItem(field.name, field.value);
  });
}

function restoreFormData() {
  const formFields = document.querySelectorAll('.step input, .step textarea');
  formFields.forEach(field => {
    field.value = localStorage.getItem(field.name) || '';
  });
}
