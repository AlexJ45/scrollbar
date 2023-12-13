async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        "/service-worker.js"
      );
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        const publicKey =
          "BPN3oSZtfX1v0BdAaPn8r5gkDf1TtgkyFe8Q9-5XGAdCPgTZwA1K48i_H0qpE9mNt9yiCQRsOXsTwDia4L6M4jY";
        try {
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey),
          });

          sendSubscriptionToServer(subscription);
        } catch (error) {
          console.error("Erreur lors de l'abonnement push:", error);
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription du service worker:", error);
    }
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = atob(base64);
  const buffer = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    buffer[i] = rawData.charCodeAt(i);
  }

  return buffer;
}

function sendSubscriptionToServer(subscription) {
  fetch("/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Erreur lors de l'envoi de la clé d'abonnement au serveur."
        );
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

if (Notification.permission === "granted") {
  registerServiceWorker();
} else if (Notification.permission !== "denied") {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      registerServiceWorker();
    } else {
      console.log(
        "L'utilisateur a refusé l'autorisation pour les notifications push."
      );
    }
  });
}

let installPrompt;
const pwaInstallButton = document.querySelector(".button--install");

if (pwaInstallButton) {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
    pwaInstallButton.classList.remove("hidden");
  });
}

if (pwaInstallButton) {
  pwaInstallButton.addEventListener("click", async () => {
    if (!installPrompt) return;

    const result = await installPrompt.prompt();

    Notification.requestPermission().then((result) => {
      if (result === "granted") {
        console.log("Notifications acceptées");
      } else {
        console.log("Notifications refusées");
      }
    });

    installPrompt = null;
    pwaInstallButton.classList.add("hidden");
  });
}
