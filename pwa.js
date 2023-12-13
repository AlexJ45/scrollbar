let installPrompt;
const pwaInstallButton = document.getElementById("pwaInstall");
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  pwaInstallButton.removeAttribute("hidden");
});

pwaInstallButton.addEventListener("click", async () => {
  if (!installPrompt) return;

  const result = await installPrompt.prompt();
  console.log("Install prompt result", result);

  Notification.requestPermission().then((result) => {
    if (result === "granted") {
      console.log("Notifications granted");
    } else {
      console.log("Notifications refusées");
    }
  });

  installPrompt = null;
  pwaInstallButton.setAttribute("hidden", "");
});
async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.register(
      "/service-worker.js"
    );
    console.log(registration);
  }
}
registerServiceWorker();
