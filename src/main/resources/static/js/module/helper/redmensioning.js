import { restoreStep } from "/js/module/helper/step.js";
import { createImagePreview } from "/js/module/helper/preview.js";
import { restoreFiles, restoreFormData } from "/js/module/helper/localstorage.js";

// globals
const preview = document.getElementById('preview');
const previewDiv = document.querySelector('.preview');
const keepDataCheckbox = document.getElementById('keepData');

document.addEventListener('DOMContentLoaded', () => {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('formFile');

  restoreStep();
  restoreFiles();
  restoreFormData();

  keepDataCheckbox.addEventListener('change', () => {
    if (!keepDataCheckbox.checked) {
      localStorage.removeItem('uploadedFiles');
    }
  });

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
