document.addEventListener("DOMContentLoaded", () => {
  const textInput = document.getElementById("text-input");
  const wordsInput = document.getElementById("words-input");
  const replacementType = document.getElementById("replacement-type");
  const replacementChar = document.getElementById("replacement-char");
  const fixedText = document.getElementById("fixed-text");
  const caseInsensitive = document.getElementById("case-insensitive");
  const wholeWord = document.getElementById("whole-word");
  const preserveCase = document.getElementById("preserve-case");
  const censorBtn = document.getElementById("censor-btn");
  const clearBtn = document.getElementById("clear-btn");
  const copyBtn = document.getElementById("copy-btn");
  const resultBox = document.getElementById("result");

  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function buildRegex(words, opts) {
    if (!words.length) return null;
    const pattern = words.map((w) => escapeRegex(w)).join("|");
    const wordBound = opts.wholeWord
      ? "\\b(?:" + pattern + ")\\b"
      : "(?:" + pattern + ")";
    const flags = opts.caseInsensitive ? "gi" : "g";
    return new RegExp(wordBound, flags);
  }

  function preserveCaseTransform(original, masked) {
    // simple approach: preserve uppercase/lowercase pattern: for each char, if original char is uppercase then uppercase masked char
    const res = [];
    for (let i = 0; i < masked.length; i++) {
      const o = original[i] || "";
      const m = masked[i] || masked[masked.length - 1] || "";
      res.push(o && o === o.toUpperCase() ? m.toUpperCase() : m.toLowerCase());
    }
    return res.join("");
  }

  function censorText(text, words, opts) {
    const regex = buildRegex(words, opts);
    if (!regex) return text;

    return text.replace(regex, (match) => {
      // determine replacement
      let replacement = "";
      if (opts.type === "asterisks") {
        replacement = "*".repeat(match.length);
      } else if (opts.type === "char") {
        const ch = opts.char && opts.char.length ? opts.char[0] : "*";
        replacement = ch.repeat(match.length);
      } else if (opts.type === "fixed") {
        replacement = opts.fixed || "[censored]";
      } else {
        replacement = "*".repeat(match.length);
      }

      if (opts.preserveCase && opts.type !== "fixed") {
        return preserveCaseTransform(match, replacement);
      }
      return replacement;
    });
  }

  censorBtn.addEventListener("click", () => {
    const text = textInput.value;
    if (!text) {
      resultBox.textContent = "Input text is empty.";
      return;
    }

    // parse word list: split by comma/newline/space; filter out empties
    const raw = wordsInput.value || "";
    const words = raw
      .split(/[\s,]+/)
      .map((w) => w.trim())
      .filter(Boolean);
    if (words.length === 0) {
      resultBox.textContent = "No words provided to censor.";
      return;
    }

    const opts = {
      caseInsensitive: caseInsensitive.checked,
      wholeWord: wholeWord.checked,
      type: replacementType.value,
      char: replacementChar.value || "*",
      fixed: fixedText.value || "[censored]",
      preserveCase: preserveCase.checked,
    };

    try {
      const out = censorText(text, words, opts);
      resultBox.textContent = out;
    } catch (e) {
      console.error(e);
      resultBox.textContent = "❌ Error while censoring text.";
    }
  });

  clearBtn.addEventListener("click", () => {
    textInput.value = "";
    wordsInput.value = "";
    replacementChar.value = "";
    fixedText.value = "";
    resultBox.textContent = "Result will appear here after censoring.";
  });

  copyBtn.addEventListener("click", async () => {
    const text = resultBox.textContent;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = "Copied ✓";
      setTimeout(() => (copyBtn.textContent = "Copy Result"), 1300);
    } catch (e) {
      alert("Copy failed, select and copy manually.");
    }
  });

  // small UI niceties
  replacementType.addEventListener("change", () => {
    const t = replacementType.value;
    replacementChar.style.display = t === "char" ? "block" : "none";
    fixedText.style.display = t === "fixed" ? "block" : "none";
  });
  // initialize visibility
  replacementType.dispatchEvent(new Event("change"));
});
