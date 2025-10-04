document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('input-text');
    const repeatCount = document.getElementById('repeat-count');
    const outputText = document.getElementById('output-text');
    const repeatBtn = document.getElementById('repeat-btn');
    const copyBtn = document.getElementById('copy-btn');

    // Auto-focus
    inputText.focus();

    repeatBtn.addEventListener('click', function() {
        const text = inputText.value;
        const count = parseInt(repeatCount.value, 10);

        if (!text) {
            outputText.value = "⚠️ Please enter some text.";
            return;
        }
        if (isNaN(count) || count < 0) {
            outputText.value = "⚠️ Count must be a non-negative number.";
            return;
        }

        outputText.value = text.repeat(count);
    });

    copyBtn.addEventListener('click', function() {
        outputText.select();
        document.execCommand('copy');
        copyBtn.textContent = "✅ Copied!";
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Result';
        }, 1500);
    });
});

