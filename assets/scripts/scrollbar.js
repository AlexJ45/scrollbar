document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector(".content");
  const scrollbarVisualizer = document.querySelector(".scrollbar__visualizer");
  const oklchInfo = document.querySelector(".info-oklch");

  function rgbToOklch(rgb) {
    const div = document.createElement("div");
    div.style.backgroundColor = rgb;
    document.body.appendChild(div);

    const computedStyle = window.getComputedStyle(div);
    const bgColor = computedStyle.backgroundColor;

    // Extract RGB values
    const match = bgColor.match(/\((\d+), (\d+), (\d+)\)/);
    const r = parseInt(match[1]) / 255;
    const g = parseInt(match[2]) / 255;
    const b = parseInt(match[3]) / 255;

    // Convert RGB to OKLCH
    const lch = rgbToOklchHelper(r, g, b);

    // Clean up
    document.body.removeChild(div);

    return lch;
  }

  function rgbToOklchHelper(r, g, b) {
    const oklab = rgbToOklab(r, g, b);
    const lch = oklabToOklch(oklab);
    return `oklch(${lch[0] * 100}% ${lch[1]} ${lch[2]})`;
  }

  function rgbToOklab(r, g, b) {
    const m = matrixMultiply(
      [
        [0.4124564, 0.3575761, 0.1804375],
        [0.2126729, 0.7151522, 0.072175],
        [0.0193339, 0.119192, 0.9503041],
      ],
      [r, g, b]
    );

    const X = pivotRgbToOklab(m[0] / 0.95047);
    const Y = pivotRgbToOklab(m[1]);
    const Z = pivotRgbToOklab(m[2] / 1.08883);

    return [X, Y, Z];
  }

  function oklabToOklch(oklab) {
    const L = oklab[0];
    const a = oklab[1];
    const b = oklab[2];

    const C = Math.sqrt(a * a + b * b);
    let H = (Math.atan2(b, a) * 180) / Math.PI;

    // Convert angle to positive degrees
    H = H < 0 ? H + 360 : H;

    return [L, C, H];
  }

  function pivotRgbToOklab(value) {
    if (value > 0.008856) {
      return Math.pow(value, 1 / 3);
    }
    return (value * 903.3 + 16) / 116;
  }

  function matrixMultiply(matrix, vector) {
    return matrix.map((row) =>
      row.reduce((sum, value, i) => sum + value * vector[i], 0)
    );
  }
  function changeOklchVal() {
    let backgroundColor =
      window.getComputedStyle(scrollbarVisualizer).backgroundColor;
    let oklchValue = rgbToOklch(backgroundColor);
    oklchInfo.textContent = `OKLCH Value: ${oklchValue}`;
    oklchInfo.style.color = `${oklchValue}`;
  }

  content.addEventListener("scroll", changeOklchVal());
});
