export function startLoading() {
    document.getElementById("loadingScreen").classList.remove("hidden");
}

export function stopLoading() {
    document.getElementById("loadingScreen").classList.add("hidden");
}