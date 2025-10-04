// Image to PDF Converter
document.addEventListener('DOMContentLoaded', function() {
    const { jsPDF } = window.jspdf;
    
    const fileInput = document.getElementById('file-input');
    const uploadSection = document.getElementById('upload-section');
    const previewSection = document.getElementById('preview-section');
    const previewGrid = document.getElementById('preview-grid');
    const convertBtn = document.getElementById('convert-btn');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const pdfPreviewSection = document.getElementById('pdf-preview-section');
    const pdfPreviewContainer = document.getElementById('pdf-preview-container');
    const downloadBtn = document.getElementById('download-btn');
    const newConversionBtn = document.getElementById('new-conversion-btn');
    const loadingOverlay = document.getElementById('loading-overlay');
    const statsBar = document.getElementById('stats-bar');
    const imageCountEl = document.getElementById('image-count');
    const totalSizeEl = document.getElementById('total-size');

    // State
    let uploadedImages = [];
    let generatedPDF = null;
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

    // File input change handler
    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop handlers
    uploadSection.addEventListener('dragover', handleDragOver);
    uploadSection.addEventListener('dragleave', handleDragLeave);
    uploadSection.addEventListener('drop', handleDrop);
    // uploadSection.addEventListener('click', () => fileInput.click());

    // Button handlers
    convertBtn.addEventListener('click', convertToPDF);
    clearAllBtn.addEventListener('click', clearAllImages);
    downloadBtn.addEventListener('click', downloadPDF);
    newConversionBtn.addEventListener('click', startNewConversion);

    function handleFileSelect(e) {
        const files = Array.from(e.target.files);
        processFiles(files);
        fileInput.value = ''; // Reset input
    }

    function handleDragOver(e) {
        e.preventDefault();
        uploadSection.classList.add('drag-over');
    }

    function handleDragLeave(e) {
        e.preventDefault();
        uploadSection.classList.remove('drag-over');
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadSection.classList.remove('drag-over');
        
        const files = Array.from(e.dataTransfer.files).filter(file => 
            file.type.startsWith('image/')
        );
        processFiles(files);
    }

    function processFiles(files) {
        files.forEach(file => {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showNotification('Invalid file type. Please upload images only.', 'error');
                return;
            }

            // Validate file size
            if (file.size > MAX_FILE_SIZE) {
                showNotification(`${file.name} exceeds 5MB limit`, 'error');
                return;
            }

            // Read and preview image
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = {
                    id: Date.now() + Math.random(),
                    name: file.name,
                    size: file.size,
                    dataUrl: e.target.result,
                    file: file
                };

                uploadedImages.push(imageData);
                addImagePreview(imageData);
                updateStats();
                showPreviewSection();
            };
            reader.readAsDataURL(file);
        });
    }

    function addImagePreview(imageData) {
        const card = document.createElement('div');
        card.className = 'preview-card';
        card.dataset.id = imageData.id;

        const img = document.createElement('img');
        img.className = 'preview-image';
        img.src = imageData.dataUrl;
        img.alt = imageData.name;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.onclick = (e) => {
            e.stopPropagation();
            removeImage(imageData.id);
        };

        const info = document.createElement('div');
        info.className = 'preview-info';
        info.innerHTML = `
            <div class="preview-name" title="${imageData.name}">${imageData.name}</div>
            <div class="preview-size">${formatFileSize(imageData.size)}</div>
        `;

        card.appendChild(removeBtn);
        card.appendChild(img);
        card.appendChild(info);
        previewGrid.appendChild(card);

        // Animate card entry
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.3s ease';
            
            requestAnimationFrame(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }, 10);
    }

    function removeImage(id) {
        uploadedImages = uploadedImages.filter(img => img.id !== id);
        const card = previewGrid.querySelector(`[data-id="${id}"]`);
        
        if (card) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                card.remove();
                updateStats();
                
                if (uploadedImages.length === 0) {
                    hidePreviewSection();
                }
            }, 300);
        }
    }

    function clearAllImages() {
        if (confirm('Are you sure you want to remove all images?')) {
            uploadedImages = [];
            previewGrid.innerHTML = '';
            hidePreviewSection();
            updateStats();
        }
    }

    function updateStats() {
        const totalSize = uploadedImages.reduce((sum, img) => sum + img.size, 0);
        imageCountEl.textContent = uploadedImages.length;
        totalSizeEl.textContent = formatFileSize(totalSize);
        
        if (uploadedImages.length > 0) {
            statsBar.style.display = 'flex';
        } else {
            statsBar.style.display = 'none';
        }
    }

    function showPreviewSection() {
        previewSection.classList.add('active');
    }

    function hidePreviewSection() {
        previewSection.classList.remove('active');
    }

    async function convertToPDF() {
        if (uploadedImages.length === 0) {
            showNotification('Please upload at least one image', 'error');
            return;
        }

        loadingOverlay.classList.add('active');

        try {
            // Create PDF with A4 size
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 10;
            const maxWidth = pageWidth - (margin * 2);
            const maxHeight = pageHeight - (margin * 2);

            for (let i = 0; i < uploadedImages.length; i++) {
                const imageData = uploadedImages[i];
                
                // Add new page for each image except the first
                if (i > 0) {
                    pdf.addPage();
                }

                // Load image to get dimensions
                const img = await loadImage(imageData.dataUrl);
                const imgWidth = img.width;
                const imgHeight = img.height;

                // Calculate dimensions to fit within page while maintaining aspect ratio
                let finalWidth = maxWidth;
                let finalHeight = (imgHeight * maxWidth) / imgWidth;

                if (finalHeight > maxHeight) {
                    finalHeight = maxHeight;
                    finalWidth = (imgWidth * maxHeight) / imgHeight;
                }

                // Center the image on the page
                const x = (pageWidth - finalWidth) / 2;
                const y = (pageHeight - finalHeight) / 2;

                // Add image to PDF
                pdf.addImage(imageData.dataUrl, 'JPEG', x, y, finalWidth, finalHeight);
            }

            generatedPDF = pdf;
            
            // Generate preview
            await generatePDFPreview(pdf);
            
            loadingOverlay.classList.remove('active');
            showNotification('PDF generated successfully!', 'success');
            
            // Show PDF preview section
            pdfPreviewSection.classList.add('active');
            
            // Scroll to preview
            pdfPreviewSection.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Error generating PDF:', error);
            loadingOverlay.classList.remove('active');
            showNotification('Error generating PDF. Please try again.', 'error');
        }
    }

    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    async function generatePDFPreview(pdf) {
        pdfPreviewContainer.innerHTML = '';
        
        const pageCount = pdf.internal.pages.length - 1; // Subtract 1 because first element is metadata
        
        // Create preview for each page
        for (let i = 1; i <= pageCount; i++) {
            const canvas = document.createElement('canvas');
            canvas.className = 'pdf-page-preview';
            canvas.width = 595;
            canvas.height = 842;
            
            const ctx = canvas.getContext('2d');
            
            // Get the image for this page
            const imageData = uploadedImages[i - 1];
            const img = await loadImage(imageData.dataUrl);
            
            // Fill white background
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Calculate dimensions to fit
            const padding = 20;
            const maxWidth = canvas.width - (padding * 2);
            const maxHeight = canvas.height - (padding * 2);
            
            let width = maxWidth;
            let height = (img.height * maxWidth) / img.width;
            
            if (height > maxHeight) {
                height = maxHeight;
                width = (img.width * maxHeight) / img.height;
            }
            
            const x = (canvas.width - width) / 2;
            const y = (canvas.height - height) / 2;
            
            // Draw image centered
            ctx.drawImage(img, x, y, width, height);
            
            pdfPreviewContainer.appendChild(canvas);
        }
    }

    function downloadPDF() {
        if (!generatedPDF) {
            showNotification('Please generate PDF first', 'error');
            return;
        }

        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        generatedPDF.save(`converted-images-${timestamp}.pdf`);
        showNotification('PDF downloaded successfully!', 'success');
    }

    function startNewConversion() {
        if (confirm('Start a new conversion? Current images will be cleared.')) {
            uploadedImages = [];
            generatedPDF = null;
            previewGrid.innerHTML = '';
            pdfPreviewContainer.innerHTML = '';
            pdfPreviewSection.classList.remove('active');
            hidePreviewSection();
            updateStats();
            
            // Scroll back to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            showNotification('Ready for new conversion', 'success');
        }
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                     type === 'error' ? 'exclamation-circle' : 
                     'info-circle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Add notification styles dynamically
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem 1.5rem;
            background: var(--bg-secondary);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: var(--radius-md);
            color: var(--text-primary);
            box-shadow: var(--shadow-lg);
            transform: translateX(400px);
            opacity: 0;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            min-width: 250px;
        }

        .notification.show {
            transform: translateX(0);
            opacity: 1;
        }

        .notification i {
            font-size: 1.25rem;
        }

        .notification-success {
            border-left: 4px solid var(--success-color);
        }

        .notification-success i {
            color: var(--success-color);
        }

        .notification-error {
            border-left: 4px solid var(--error-color);
        }

        .notification-error i {
            color: var(--error-color);
        }

        .notification-info {
            border-left: 4px solid var(--primary-color);
        }

        .notification-info i {
            color: var(--primary-color);
        }

        @media (max-width: 768px) {
            .notification {
                right: 10px;
                left: 10px;
                min-width: auto;
            }
        }
    `;
    document.head.appendChild(notificationStyles);

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+V to paste images (if clipboard API is supported)
        if (e.ctrlKey && e.key === 'v') {
            navigator.clipboard.read().then(clipboardItems => {
                for (const item of clipboardItems) {
                    for (const type of item.types) {
                        if (type.startsWith('image/')) {
                            item.getType(type).then(blob => {
                                const file = new File([blob], `pasted-image-${Date.now()}.png`, { type });
                                processFiles([file]);
                            });
                        }
                    }
                }
            }).catch(err => {
                console.log('Clipboard access denied or no image found');
            });
        }

        // Ctrl+Enter to convert
        if (e.ctrlKey && e.key === 'Enter' && uploadedImages.length > 0) {
            convertToPDF();
        }

        // Escape to clear
        if (e.key === 'Escape' && uploadedImages.length > 0) {
            if (confirm('Clear all images?')) {
                clearAllImages();
            }
        }
    });

    // Add floating shapes animation styles
    const shapesStyle = document.createElement('style');
    shapesStyle.textContent = `
        .floating-shapes {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
        }

        .shape {
            position: absolute;
            opacity: 0.05;
            animation: float 20s infinite ease-in-out;
        }

        .shape-1 {
            width: 300px;
            height: 300px;
            background: var(--gradient-primary);
            border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
            top: 10%;
            left: 10%;
            animation-delay: 0s;
        }

        .shape-2 {
            width: 200px;
            height: 200px;
            background: var(--gradient-secondary);
            border-radius: 50%;
            top: 60%;
            right: 20%;
            animation-delay: 2s;
        }

        .shape-3 {
            width: 250px;
            height: 250px;
            background: var(--primary-color);
            border-radius: 63% 37% 54% 46% / 55% 48% 52% 45%;
            bottom: 20%;
            left: 30%;
            animation-delay: 4s;
        }

        .shape-4 {
            width: 180px;
            height: 180px;
            background: var(--accent-color);
            border-radius: 40% 60% 60% 40% / 60% 30% 70% 40%;
            top: 40%;
            right: 10%;
            animation-delay: 6s;
        }

        .shape-5 {
            width: 220px;
            height: 220px;
            background: var(--secondary-color);
            border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
            bottom: 10%;
            right: 40%;
            animation-delay: 8s;
        }

        @keyframes float {
            0%, 100% {
                transform: translate(0, 0) rotate(0deg);
            }
            25% {
                transform: translate(30px, -30px) rotate(90deg);
            }
            50% {
                transform: translate(-20px, 20px) rotate(180deg);
            }
            75% {
                transform: translate(20px, 30px) rotate(270deg);
            }
        }
    `;
    document.head.appendChild(shapesStyle);

    // Show welcome message
    setTimeout(() => {
        showNotification('Ready to convert images to PDF! 🎨', 'info');
    }, 500);
});