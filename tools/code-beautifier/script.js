// script.js
document.addEventListener("DOMContentLoaded", () => {
  const inputEl = document.getElementById("code-input");
  const outputEl = document.getElementById("code-output");
  const beautifyBtn = document.getElementById("beautify-btn");
  const copyBtn = document.getElementById("copy-btn");

  // Beautify function
  function beautifyCode() {
    const messyCode = inputEl.value.trim();

    if (!messyCode) {
      outputEl.value = "⚠️ Please paste some HTML code first.";
      return;
    }

    try {
      const prettyCode = html_beautify(messyCode, {
        indent_size: 2,
        space_in_empty_paren: true,
        wrap_line_length: 120,
        preserve_newlines: true,
      });

      outputEl.value = prettyCode;
    } catch (error) {
      outputEl.value = "❌ Error formatting code:\n" + error.message;
    }
  }

  // Copy function
  function copyOutput() {
    if (!outputEl.value.trim()) return;

    navigator.clipboard
      .writeText(outputEl.value)
      .then(() => {
        copyBtn.innerHTML = "✅ Copied!";
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Output';
        }, 1500);
      })
      .catch((err) => {
        console.error("Clipboard copy failed:", err);
      });
  }

  // Event listeners
  beautifyBtn.addEventListener("click", beautifyCode);
  copyBtn.addEventListener("click", copyOutput);
});
