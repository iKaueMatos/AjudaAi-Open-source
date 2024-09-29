export function nextStep(step) {
    document.querySelectorAll('.step').forEach(function (element) {
      element.classList.add('hidden');
    });
    document.getElementById('step-' + step).classList.remove('hidden');
    updateProgress(step);
  }

export function previousStep(step) {
    nextStep(step);
}

export function updateProgress(step) {
    const progress = (step - 1) * 33.33;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('progressText').textContent = progress + '%';
}


export function startLoading() {
    document.getElementById('progressBar').style.width = '100%';
    document.getElementById('progressText').textContent = '100%';
}

export function previewImages() {
    const files = document.getElementById('formFile').files;
    const preview = document.getElementById('preview');
    preview.innerHTML = ''; // Limpar previews anteriores
  
    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      
      reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;
        img.classList.add('w-full', 'h-48', 'object-cover', 'rounded-lg', 'mb-4');
  
        img.onload = function() {
          const imgContainer = document.createElement('div');
          imgContainer.classList.add('mb-4', 'border', 'border-gray-300', 'p-4', 'rounded-lg', 'bg-white');
          
          const imgTitle = document.createElement('h3');
          imgTitle.classList.add('font-semibold', 'text-lg', 'mb-2');
          imgTitle.textContent = `Imagem ${index + 1}: ${file.name} (${file.type.split('/')[1].toUpperCase()})`;
  
          const imgDimensions = document.createElement('p');
          imgDimensions.classList.add('text-sm', 'text-gray-600', 'mb-2');
          imgDimensions.textContent = `Dimensões: ${img.width} x ${img.height} pixels`;
  
          imgContainer.appendChild(imgTitle);
          imgContainer.appendChild(imgDimensions);
          imgContainer.appendChild(img);
          preview.appendChild(imgContainer);
  
          URL.revokeObjectURL(img.src);
        };
      };
  
      reader.readAsDataURL(file);
    });
  }
  