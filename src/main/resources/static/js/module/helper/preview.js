const preview = document.getElementById('preview');
const previewDiv = document.querySelector('.preview');

export async function createImagePreview(file, index) {
  const reader = new FileReader();

  const imgContainer = document.createElement("div");
  imgContainer.classList.add(
    "mb-4",
    "border-gray-300",
    "p-4",
    "rounded-lg",
    "mx-auto",
    "w-full",
    "sm:w-[200px]",
    "md:w-[250px]",
    "lg:w-[300px]",
    "h-auto",
  );

  const imgTitle = document.createElement("h3");
  imgTitle.classList.add("font-semibold", "text-lg", "mb-2", "text-center");
  imgTitle.textContent = `Imagem ${index + 1}: ${file.name} (${file.type.split("/")[1].toUpperCase()})`;

  imgContainer.appendChild(imgTitle);

  const img = await new Promise((resolve, reject) => {
    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;
      img.classList.add(
        "max-w-full",
        "max-h-[200px]",
        "object-contain",
        "rounded-lg",
        "mb-4"
      );

      img.onload = () => resolve(img);
      img.onerror = reject;
    };
    reader.readAsDataURL(file);
  });

  const imgDimensions = document.createElement("p");
  imgDimensions.classList.add("text-sm", "text-gray-600", "mb-2", "text-center");
  imgDimensions.textContent = `Dimensões: ${img.width} x ${img.height} pixels`;

  imgContainer.appendChild(imgDimensions);
  imgContainer.appendChild(img);

  return imgContainer;
}

export function clearPreview() {
    preview.innerHTML = '';
    previewDiv.innerHTML = '';
}
