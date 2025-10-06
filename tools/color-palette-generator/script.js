document.addEventListener("DOMContentLoaded", () => {
  const baseColorInput = document.getElementById("base-color");
  const harmonySelect = document.getElementById("harmony-rule");
  const generateBtn = document.getElementById("generate-btn");
  const paletteDiv = document.getElementById("palette");

  generateBtn.addEventListener("click", () => {
    const baseColor = baseColorInput.value;
    const rule = harmonySelect.value;

    const palette = generatePalette(baseColor, rule);
    displayPalette(palette);
  });

  function generatePalette(base, rule) {
    const baseHSL = hexToHSL(base);
    let colors = [];

    switch (rule) {
      case "monochromatic":
        for (let i = 0; i < 5; i++) {
          let l = clamp(baseHSL.l + (i - 2) * 10, 0, 100);
          colors.push(HSLToHex(baseHSL.h, baseHSL.s, l));
        }
        break;

      case "analogous":
        for (let i = -2; i <= 2; i++) {
          let h = (baseHSL.h + i * 30 + 360) % 360;
          colors.push(HSLToHex(h, baseHSL.s, baseHSL.l));
        }
        break;

      case "complementary":
        colors.push(base);
        colors.push(HSLToHex((baseHSL.h + 180) % 360, baseHSL.s, baseHSL.l));
        colors.push(HSLToHex((baseHSL.h + 150) % 360, baseHSL.s, baseHSL.l));
        colors.push(HSLToHex((baseHSL.h + 210) % 360, baseHSL.s, baseHSL.l));
        colors.push(
          HSLToHex(baseHSL.h, baseHSL.s, clamp(baseHSL.l + 20, 0, 100))
        );
        break;

      case "triadic":
        colors.push(base);
        colors.push(HSLToHex((baseHSL.h + 120) % 360, baseHSL.s, baseHSL.l));
        colors.push(HSLToHex((baseHSL.h + 240) % 360, baseHSL.s, baseHSL.l));
        colors.push(HSLToHex((baseHSL.h + 60) % 360, baseHSL.s, baseHSL.l));
        colors.push(HSLToHex((baseHSL.h + 180) % 360, baseHSL.s, baseHSL.l));
        break;

      case "tetradic":
        colors.push(base);
        colors.push(HSLToHex((baseHSL.h + 90) % 360, baseHSL.s, baseHSL.l));
        colors.push(HSLToHex((baseHSL.h + 180) % 360, baseHSL.s, baseHSL.l));
        colors.push(HSLToHex((baseHSL.h + 270) % 360, baseHSL.s, baseHSL.l));
        colors.push(
          HSLToHex(baseHSL.h, baseHSL.s, clamp(baseHSL.l + 20, 0, 100))
        );
        break;
    }

    return colors;
  }

  function displayPalette(colors) {
    paletteDiv.innerHTML = "";
    colors.forEach((color) => {
      const div = document.createElement("div");
      div.className = "color-box";
      div.style.background = color;
      div.textContent = color;
      div.title = "Click to copy";
      div.addEventListener("click", () => {
        navigator.clipboard.writeText(color);
        div.textContent = "Copied!";
        setTimeout(() => (div.textContent = color), 1000);
      });
      paletteDiv.appendChild(div);
    });
  }

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function hexToHSL(H) {
    let r = 0,
      g = 0,
      b = 0;
    if (H.length == 4) {
      r = parseInt(H[1] + H[1], 16);
      g = parseInt(H[2] + H[2], 16);
      b = parseInt(H[3] + H[3], 16);
    } else if (H.length == 7) {
      r = parseInt(H[1] + H[2], 16);
      g = parseInt(H[3] + H[4], 16);
      b = parseInt(H[5] + H[6], 16);
    } else {
      r = parseInt(H.substr(1, 2), 16);
      g = parseInt(H.substr(3, 2), 16);
      b = parseInt(H.substr(5, 2), 16);
    }
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = (cmax + cmin) / 2;
    if (delta != 0) {
      h =
        cmax == r
          ? ((g - b) / delta) % 6
          : cmax == g
          ? (b - r) / delta + 2
          : (r - g) / delta + 4;
      h = Math.round(h * 60);
      if (h < 0) h += 360;
      s = delta / (1 - Math.abs(2 * l - 1));
    }
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    return { h, s, l };
  }

  function HSLToHex(h, s, l) {
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
      m = l - c / 2,
      r = 0,
      g = 0,
      b = 0;
    if (h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h < 300) {
      r = x;
      g = 0;
      b = c;
    } else {
      r = c;
      g = 0;
      b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
});
