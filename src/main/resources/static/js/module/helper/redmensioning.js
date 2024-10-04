import { createImagePreview } from "./preview";
import { showStep } from "./step";

// globals
const preview = document.getElementById('preview');
const previewDiv = document.querySelector('.preview');

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

export function saveFiles(files) {
  const fileArray = Array.from(files).map(file => ({
    name: file.name,
    type: file.type,
    size: file.size,
  }));
  
  if (!localStorage.getItem('uploadedFiles')) {
    localStorage.setItem('uploadedFiles', JSON.stringify(fileArray));
  }
}

export function restoreFiles() {
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

export function saveFormData() {
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
