document.addEventListener("DOMContentLoaded", function () {
  const fireworksContainer = document.querySelector(".fireworks");

  function createFirework(index) {
    const firework = document.createElement("div");
    const randomColor = getRandomColor();
    const randomDuration = getRandomDuration();
    let angle = (Math.random() * 360) / 9;

    firework.className = "firework";
    firework.style.animationDelay = getRandomDelay() + "s";
    firework.style.animationDuration = randomDuration + "s";
    firework.style.borderBottomColor = randomColor;
    firework.style.setProperty(
      "--firework-translate-x",
      `${Math.tan(angle * (Math.PI / 180)) * 100}vw`
    );
    angle = (Math.random() * 360) / 9;
    firework.style.setProperty(
      "--firework-translate-x-after",
      `${Math.tan(angle * (Math.PI / 180)) * 100}vw`
    );

    fireworksContainer.appendChild(firework);
  }

  function getRandomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }

  function getRandomDelay() {
    return Math.random() * 0.8;
  }

  function getRandomDuration() {
    return Math.max(Math.random() * 3.0 + 0.5, 0.5);
  }

  for (let i = 0; i < 9; i++) {
    createFirework(i);
  }
});
