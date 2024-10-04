export function updateProgress(step) {
  const progress = Math.min((step - 1) * 33.33, 100);
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");

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