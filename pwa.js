async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.register("/sw.js");
    console.log(registration, "service worker registration");
  }
}
registerServiceWorker();

let installPrompt = null;
const pwaInstallButton = document.getElementById("pwa-install");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  installPrompt = e;
  pwaInstallButton.removeAttribute("hidden");
});

pwaInstallButton.addEventListener("click", async () => {
  if (!installPrompt) {
    return;
  }
  const result = await installPrompt.prompt();
  console.log("Install prompt result", result);

  installPrompt = null;
  pwaInstallButton.setAttribute("hidden", "");
});
