const unitOptions = {
  length: ["meters", "kilometers", "miles", "feet", "inches", "centimeters"],
  weight: ["grams", "kilograms", "pounds", "ounces"],
  temperature: ["Celsius", "Fahrenheit", "Kelvin"],
  time: ["seconds", "minutes", "hours", "days"],
  storage: ["bytes", "KB", "MB", "GB", "TB"]
};

const conversionRates = {
  length: {
    meters: 1,
    kilometers: 0.001,
    miles: 0.000621371,
    feet: 3.28084,
    inches: 39.3701,
    centimeters: 100
  },
  weight: {
    grams: 1000,
    kilograms: 1,
    pounds: 2.20462,
    ounces: 35.274
  },
  time: {
    seconds: 1,
    minutes: 1 / 60,
    hours: 1 / 3600,
    days: 1 / 86400
  },
  storage: {
    bytes: 1,
    KB: 1 / 1024,
    MB: 1 / (1024 ** 2),
    GB: 1 / (1024 ** 3),
    TB: 1 / (1024 ** 4)
  }
};

const inputValue = document.getElementById("input-value");
const categorySelect = document.getElementById("unit-category");
const fromUnit = document.getElementById("from-unit");
const toUnit = document.getElementById("to-unit");
const resultDisplay = document.getElementById("result-display");
const convertBtn = document.getElementById("convert-btn");
const copyBtn = document.getElementById("copy-btn");

// Populate category dropdown
function populateCategories() {
  for (let cat in unitOptions) {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categorySelect.appendChild(opt);
  }
  categorySelect.value = "length";
  populateUnits("length");
}

// Populate units based on category
function populateUnits(category) {
  fromUnit.innerHTML = "";
  toUnit.innerHTML = "";
  unitOptions[category].forEach(unit => {
    const opt1 = document.createElement("option");
    opt1.value = unit;
    opt1.textContent = unit;
    fromUnit.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = unit;
    opt2.textContent = unit;
    toUnit.appendChild(opt2);
  });
  fromUnit.value = unitOptions[category][0];
  toUnit.value = unitOptions[category][1];
}

// Temperature conversion
function convertTemperature(value, from, to) {
  let celsius;
  if (from === "Celsius") celsius = value;
  if (from === "Fahrenheit") celsius = (value - 32) * 5 / 9;
  if (from === "Kelvin") celsius = value - 273.15;

  if (to === "Celsius") return celsius;
  if (to === "Fahrenheit") return (celsius * 9 / 5) + 32;
  if (to === "Kelvin") return celsius + 273.15;
}

// Main convert
function convert() {
  const value = parseFloat(inputValue.value);
  const category = categorySelect.value;
  const from = fromUnit.value;
  const to = toUnit.value;

  if (isNaN(value) || value < 0) {
    resultDisplay.textContent = "⚠️ Please enter a valid non-negative value.";
    copyBtn.disabled = true;
    return;
  }

  let result;

  if (category === "temperature") {
    result = convertTemperature(value, from, to);
  } else {
    const rates = conversionRates[category];
    result = value * (rates[to] / rates[from]);
  }

  const formatted = result.toLocaleString(undefined, { maximumFractionDigits: 6 });
  const descriptive = `${value} ${from} is equal to ${formatted} ${to}.`;

  resultDisplay.textContent = descriptive;
  copyBtn.disabled = false;
}

// Copy
copyBtn.addEventListener("click", function () {
  const text = resultDisplay.textContent;
  navigator.clipboard.writeText(text).then(() => {
    this.textContent = "✔ Copied!";
    this.classList.add("copied");
    setTimeout(() => {
      this.innerHTML = '<i class="fas fa-copy"></i> Copy Result';
      this.classList.remove("copied");
    }, 2000);
  });
});

// Events
categorySelect.addEventListener("change", () => {
  populateUnits(categorySelect.value);
});
convertBtn.addEventListener("click", convert);

// Init
populateCategories();
