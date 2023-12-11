class ScrollbarWrapper extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="scrollbar">
        <div class="scrollbar__visualizer"></div>
      </div>
    `;
  }
}

class InfoOklch extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      L: <span class="oklch-l"></span><br>
      C: <span class="oklch-c"></span><br>
      H: <span class="oklch-h"></span>
    `;
  }
}

class ToggleButton extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<button class="button--toggle">Activer</button>`;
  }
}

customElements.define("scrollbar-wrapper", ScrollbarWrapper);
customElements.define("info-oklch", InfoOklch);
customElements.define("toggle-button", ToggleButton);

document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector(".content");
  const wrapper = document.querySelector(".scrollbar-wrapper");
  const scrollbarVisualizer = document.querySelector(".scrollbar__visualizer");
  const oklchInfo = document.querySelector(".info-oklch");
  const oklchL = document.querySelector(".oklch-l");
  const oklchC = document.querySelector(".oklch-c");
  const oklchH = document.querySelector(".oklch-h");
  const toggleButton = document.querySelector(".button--toggle");

  function changeOklchVal() {
    if (!wrapper.classList.contains("inactive")) {
      let backgroundColor =
        window.getComputedStyle(scrollbarVisualizer).backgroundColor;
      let color = new Color(backgroundColor);
      let colorOklch = color.to("oklch");
      oklchL.textContent = `${Math.floor(colorOklch.oklch[0] * 100)}%`;
      oklchC.textContent = `${colorOklch.oklch[1].toFixed(2)}`;
      oklchH.textContent = `${colorOklch.oklch[2].toFixed(2)}`;

      oklchInfo.style.color = colorOklch;
      toggleButton.style.backgroundColor = colorOklch;
      toggleButton.style.border = colorOklch;
    } else {
      oklchInfo.style.color = "white";
      toggleButton.style.background = "none";
      toggleButton.style.border = "white 1px solid";
      oklchL.textContent = ``;
      oklchC.textContent = ``;
      oklchH.textContent = ``;
    }
  }

  content.addEventListener("scroll", changeOklchVal);

  toggleButton.addEventListener("click", () => {
    wrapper.classList.toggle("inactive");
    changeOklchVal();
    toggleButton.textContent =
      toggleButton.textContent === "Activer" ? "Désactiver" : "Activer";
  });
});
