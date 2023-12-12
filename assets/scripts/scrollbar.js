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
      L: <span class="oklch-l">100%</span><br>
      C: <span class="oklch-c">0</span><br>
      H: <span class="oklch-h">0</span>
    `;
  }
}

class ToggleButton extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<button class="button--toggle ">Activer</button>`;
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
  const oklchElement = document.querySelectorAll(".element-oklch");

  function changeOklchVal() {
    if (!wrapper.classList.contains("inactive")) {
      let backgroundColor =
        window.getComputedStyle(scrollbarVisualizer).backgroundColor;
      let color = new Color(backgroundColor);
      let colorOklch = color.to("oklch");
      oklchL.textContent = `${Math.floor(colorOklch.oklch[0] * 100)}%`;
      oklchC.textContent = `${colorOklch.oklch[1].toFixed(2)}`;
      oklchH.textContent = `${colorOklch.oklch[2].toFixed(2)}`;
      oklchElement.forEach((element) => {
        element.style.color = colorOklch;
      });
      toggleButton.style.backgroundColor = colorOklch;
      toggleButton.style.border = colorOklch;
    } else {
      oklchElement.forEach((element) => {
        element.style.color = "";
      });
      toggleButton.style.background = "";
      toggleButton.style.border = "";
      oklchL.textContent = `100%`;
      oklchC.textContent = `0`;
      oklchH.textContent = `0`;
    }
  }

  content.addEventListener("scroll", changeOklchVal);

  toggleButton.addEventListener("click", () => {
    content.classList.toggle("hide-scroll");
    wrapper.classList.toggle("inactive");
    changeOklchVal();
    toggleButton.textContent =
      toggleButton.textContent === "Activer" ? "Désactiver" : "Activer";
  });
});
