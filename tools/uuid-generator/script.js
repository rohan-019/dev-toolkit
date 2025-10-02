document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate-btn');
    const uuidDisplay = document.getElementById('uuid-display');
    const copyBtn = document.getElementById('copy-btn');

    // UUID v4 Generator using crypto API (modern browsers)
    function generateUUID() {
        if (crypto.randomUUID) {
            return crypto.randomUUID();
        } else {
            // Fallback for older browsers
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
    }

    // Generate UUID on button click
    generateBtn.addEventListener('click', function() {
        const uuid = generateUUID();
        uuidDisplay.textContent = uuid;
        uuidDisplay.classList.remove('uuid-placeholder');
        uuidDisplay.classList.add('generated');
        copyBtn.disabled = false;
        copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy to Clipboard';

        // Button feedback with animation
        generateBtn.classList.add('clicked');
        generateBtn.innerHTML = '<i class="fas fa-check"></i> Generated!';
        generateBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        setTimeout(() => {
            generateBtn.classList.remove('clicked');
            generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate New UUID';
            generateBtn.style.background = '';
        }, 1500);
    });

    // Copy to clipboard functionality
    copyBtn.addEventListener('click', async function() {
        const uuid = uuidDisplay.textContent;
        try {
            await navigator.clipboard.writeText(uuid);
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyBtn.classList.add('copied');
            copyBtn.style.background = 'var(--success-color)';
            copyBtn.style.borderColor = 'var(--success-color)';

            // Reset button after 2 seconds
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy to Clipboard';
                copyBtn.classList.remove('copied');
                copyBtn.style.background = '';
                copyBtn.style.borderColor = '';
            }, 2000);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = uuid;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);

            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyBtn.classList.add('copied');
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy to Clipboard';
                copyBtn.classList.remove('copied');
            }, 2000);
        }
    });

    // Keyboard shortcut: Generate on Enter key press when focused on button
    generateBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            generateBtn.click();
        }
    });

    // No auto-generation on load - user must click to generate

    // Add enhanced styles for better UX
    const enhancedStyle = document.createElement('style');
    enhancedStyle.textContent = `
        .generate-btn:focus,
        .copy-btn:focus {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }

        .uuid-display:focus {
            outline: 2px solid var(--primary-color);
            background: rgba(255, 107, 53, 0.05);
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .uuid-section {
            animation: fadeIn 0.5s ease-out;
        }

        .success-color {
            background: linear-gradient(135deg, #28a745, #20c997) !important;
        }
    `;
    document.head.appendChild(enhancedStyle);
});
