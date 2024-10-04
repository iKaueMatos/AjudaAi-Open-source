const preview = document.getElementById('preview');
const previewDiv = document.querySelector('.preview');

export async function createImagePreview(file, index) {
  const reader = new FileReader();

  const imgContainer = document.createElement("div");
  imgContainer.classList.add(
    "mb-4",
    "border",
    "border-gray-300",
    "p-4",
    "rounded-lg",
    "bg-white"
  );

  const imgTitle = document.createElement("h3");
  imgTitle.classList.add("font-semibold", "text-lg", "mb-2");
  imgTitle.textContent = `Imagem ${index + 1}: ${file.name} (${file.type
    .split("/")[1]
    .toUpperCase()})`;

  imgContainer.appendChild(imgTitle);

  const img = await new Promise((resolve, reject) => {
    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;
      img.classList.add("w-100", "h-100", "object-cover", "rounded-lg", "mb-4");

      img.onload = () => resolve(img);
      img.onerror = reject;
    };
    reader.readAsDataURL(file);
  });

  const imgDimensions = document.createElement("p");
  imgDimensions.classList.add("text-sm", "text-gray-600", "mb-2");
  imgDimensions.textContent = `Dimensões: ${img.width} x ${img.height} pixels`;

  imgContainer.appendChild(imgDimensions);
  imgContainer.appendChild(img);

  return imgContainer;
}

export function clearPreview() {
    preview.innerHTML = '';
    previewDiv.innerHTML = '';
}