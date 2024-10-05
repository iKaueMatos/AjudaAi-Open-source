const keepDataCheckbox = document.getElementById('keepData');

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
    if (keepDataCheckbox.checked) {
      localStorage.setItem(field.name, field.value);
    }
  });
}

export function restoreFormData() {
  const formFields = document.querySelectorAll('.step input, .step textarea');
  formFields.forEach(field => {
    field.value = localStorage.getItem(field.name) || '';
  });
}

export function saveFiles(files) {
  const fileArray = Array.from(files).map(file => ({
    name: file.name,
    type: file.type,
    size: file.size,
  }));
  
  if (keepDataCheckbox.checked) {
    const existingFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
    const updatedFiles = existingFiles.concat(fileArray);
    localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
  }
}