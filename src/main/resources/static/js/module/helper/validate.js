function validateStep(step) {
  switch (step) {
    case 1:
      const title = document.getElementById("title").value;
      if (!title) {
        alert("Por favor, preencha o título do arquivo.");
        return false;
      }
      break;
    case 2:
      const width = document.getElementById("width").value;
      const height = document.getElementById("height").value;
      if (!width || !height) {
        alert("Por favor, preencha ambos os campos de largura e altura.");
        return false;
      }
      if (width <= 0 || height <= 0) {
        alert("A largura e a altura devem ser maiores que zero.");
        return false;
      }
      break;
    case 3:
      const format = document.getElementById("format").value;
      const compression = document.getElementById("compression").value;
      if (!format || !compression) {
        alert(
          "Por favor, selecione um formato de conversão e um nível de compressão."
        );
        return false;
      }
      break;
    case 4:
      const files = document.getElementById("formFile").files;
      if (files.length === 0) {
        alert("Por favor, selecione pelo menos uma imagem para upload.");
        return false;
      }
      break;
  }
  return true;
}

export { validateStep };
