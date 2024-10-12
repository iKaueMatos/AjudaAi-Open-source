import { restoreStep, nextStep } from "/js/module/helper/step.js";
import { createImagePreview } from "/js/module/helper/preview.js";
import { restoreFiles, restoreFormData } from "/js/module/helper/localstorage.js";
import { clearPreview } from "/js/module/helper/preview.js";

// globals
const preview = document.getElementById('preview');
const previewDiv = document.querySelector('.preview');
const keepDataCheckbox = document.getElementById('keepData');
const form = document.getElementById('multiStepForm');
const downloadButton = document.getElementById('downloadButton');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

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

  dropZone.addEventListener('drop', async (e) => {
    const files = e.dataTransfer.files;
    fileInput.files = files;
    await previewImages();
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

  previewDiv.classList.remove('hidden');
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  
  progressBar.style.width = '0%';
  progressText.textContent = '0%';
  
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/upload');

  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      const percentComplete = (e.loaded / e.total) * 100;
      progressBar.style.width = `${percentComplete}%`;
      progressText.textContent = `${Math.round(percentComplete)}%`;
    }
  });

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      const blob = new Blob([xhr.response], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      downloadButton.href = url;
      downloadButton.download = formData.get('title') + '.zip';
      downloadButton.classList.remove('hidden');
      nextStep(5);
      clearPreview();
      showDownloadNotification('Imagens processadas com sucesso!', 'success');
    } else {
      const errorMessage = JSON.parse(xhr.response).message || 'Erro ao processar a solicitação';
      console.error('Erro ao enviar dados:', errorMessage);
      showDownloadNotification(`Erro: ${errorMessage}`, 'error');
    }
  };

  xhr.send(formData);
});

function startLoading() {
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  progressBar.style.width = '0%';
  progressText.innerText = '0%';

  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    progressBar.style.width = `${progress}%`;
    progressText.innerText = `${progress}%`;

    if (progress >= 100) {
      clearInterval(interval);
      showDownloadNotification();
    }
  }, 1000);
}

function showDownloadNotification(message = "Seu download está pronto!", duration = 3000, backgroundColor = "#4CAF50") {
  Toastify({
    text: message,
    duration: duration,
    close: true,
    gravity: "top",
    position: 'right',
    backgroundColor: backgroundColor,
    stopOnFocus: true,
    onClick: () => {
      console.log("clicado...")
    },
    className: "toastify-custom",
  }).showToast();
}