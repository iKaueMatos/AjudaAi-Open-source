export function previewImages() {
    var preview = document.getElementById('preview');
    var files = document.getElementById('formFile').files;
    preview.innerHTML = '';

    if (files) {
        for (var i = 0; i < files.length; i++) {
            var reader = new FileReader();

            reader.onload = function (e) {
                var img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('w-full', 'h-auto', 'object-cover', 'rounded-lg');
                preview.appendChild(img);
            };

            reader.readAsDataURL(files[i]);
        }
    }
}