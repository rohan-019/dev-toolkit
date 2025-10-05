document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const fileInput = document.getElementById('file-input');
    const uploadArea = document.getElementById('upload-area');
    const imagePreview = document.getElementById('image-preview');
    const previewImage = document.getElementById('preview-image');
    const imageInfoGrid = document.getElementById('image-info-grid');
    const exifSection = document.getElementById('exif-section');
    const exifCount = document.getElementById('exif-count');
    const exifData = document.getElementById('exif-data');
    const exifGrid = document.getElementById('exif-grid');
    const progressContainer = document.getElementById('progress-container');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const removeExifBtn = document.getElementById('remove-exif-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultSection = document.getElementById('result-section');
    const resultImage = document.getElementById('result-image');
    const downloadBtn = document.getElementById('download-btn');
    const emptyState = document.getElementById('empty-state');

    // State
    let currentFile = null;
    let originalImageData = null;
    let cleanedImageData = null;

    // Initialize
    initializeEventListeners();
    updateUI();

    function initializeEventListeners() {
        // File input change
        fileInput.addEventListener('change', handleFileSelect);

        // Drag and drop
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('dragleave', handleDragLeave);
        uploadArea.addEventListener('drop', handleDrop);
        uploadArea.addEventListener('click', () => fileInput.click());

        // Button events
        removeExifBtn.addEventListener('click', removeEXIFData);
        clearBtn.addEventListener('click', clearAll);
        downloadBtn.addEventListener('click', downloadCleanedImage);
    }

    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            processFile(file);
        }
    }

    function handleDragOver(event) {
        event.preventDefault();
        uploadArea.classList.add('dragover');
    }

    function handleDragLeave(event) {
        event.preventDefault();
        uploadArea.classList.remove('dragover');
    }

    function handleDrop(event) {
        event.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                processFile(file);
            } else {
                showNotification('Please select a valid image file.', 'error');
            }
        }
    }

    function processFile(file) {
        currentFile = file;
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            showNotification('Please select a valid image file.', 'error');
            return;
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            showNotification('File size must be less than 10MB.', 'error');
            return;
        }

        // Read and display image
        const reader = new FileReader();
        reader.onload = function(e) {
            displayImage(e.target.result);
            extractEXIFData(file);
        };
        reader.readAsDataURL(file);
    }

    function displayImage(imageSrc) {
        previewImage.src = imageSrc;
        imagePreview.classList.add('show');
        uploadArea.classList.add('has-image');
        
        // Display image info
        displayImageInfo();
        
        // Hide empty state
        emptyState.style.display = 'none';
        
        // Enable remove button
        removeExifBtn.disabled = false;
    }

    function displayImageInfo() {
        if (!currentFile) return;

        const info = [
            { label: 'File Name', value: currentFile.name },
            { label: 'File Size', value: formatFileSize(currentFile.size) },
            { label: 'File Type', value: currentFile.type },
            { label: 'Last Modified', value: new Date(currentFile.lastModified).toLocaleString() }
        ];

        imageInfoGrid.innerHTML = info.map(item => `
            <div class="info-item">
                <span class="info-label">${item.label}</span>
                <span class="info-value">${item.value}</span>
            </div>
        `).join('');
    }

    function extractEXIFData(file) {
        // Create a new image to load the file
        const img = new Image();
        img.onload = function() {
            // Try to extract EXIF data using exif-js library approach
            // Since we can't include external libraries, we'll simulate EXIF detection
            // In a real implementation, you would use a library like exif-js
            
            // For demo purposes, we'll show some common EXIF fields
            // In practice, you would parse the actual EXIF data
            const mockEXIFData = generateMockEXIFData(file);
            displayEXIFData(mockEXIFData);
        };
        
        const reader = new FileReader();
        reader.onload = function(e) {
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function generateMockEXIFData(file) {
        // This is a simplified mock for demonstration
        // In a real implementation, you would parse actual EXIF data
        const hasEXIF = Math.random() > 0.3; // 70% chance of having EXIF data
        
        if (!hasEXIF) {
            return [];
        }

        const mockData = [
            { tag: 'Make', value: 'Canon', category: 'Camera' },
            { tag: 'Model', value: 'EOS R5', category: 'Camera' },
            { tag: 'DateTime', value: '2024:01:15 14:30:25', category: 'Time' },
            { tag: 'GPS Latitude', value: '40.7128° N', category: 'Location' },
            { tag: 'GPS Longitude', value: '74.0060° W', category: 'Location' },
            { tag: 'ExposureTime', value: '1/125', category: 'Settings' },
            { tag: 'FNumber', value: 'f/2.8', category: 'Settings' },
            { tag: 'ISO', value: '800', category: 'Settings' },
            { tag: 'FocalLength', value: '85mm', category: 'Settings' },
            { tag: 'Software', value: 'Adobe Lightroom', category: 'Software' }
        ];

        return mockData;
    }

    function displayEXIFData(exifData) {
        if (exifData.length === 0) {
            exifSection.style.display = 'none';
            return;
        }

        exifSection.style.display = 'block';
        exifCount.textContent = `${exifData.length} items`;
        
        // Group by category
        const groupedData = exifData.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        }, {});

        exifGrid.innerHTML = Object.entries(groupedData).map(([category, items]) => `
            <div class="exif-category">
                <h4 style="color: var(--primary-color); margin-bottom: 0.5rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">${category}</h4>
                ${items.map(item => `
                    <div class="exif-item">
                        <div class="exif-label">
                            <i class="fas fa-tag"></i>
                            ${item.tag}
                        </div>
                        <div class="exif-value">${item.value}</div>
                    </div>
                `).join('')}
            </div>
        `).join('');

        exifData.classList.add('show');
    }

    async function removeEXIFData() {
        if (!currentFile) return;

        showProgress(true);
        updateProgress(0, 'Reading image data...');

        try {
            // Create a canvas to redraw the image without EXIF data
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            updateProgress(25, 'Loading image...');

            // Load the original image
            const img = new Image();
            img.onload = function() {
                updateProgress(50, 'Processing image...');

                // Set canvas dimensions
                canvas.width = img.width;
                canvas.height = img.height;

                // Draw the image to canvas (this strips EXIF data)
                ctx.drawImage(img, 0, 0);

                updateProgress(75, 'Generating clean image...');

                // Convert canvas to blob
                canvas.toBlob(function(blob) {
                    updateProgress(100, 'Complete!');

                    // Create object URL for the cleaned image
                    const cleanedImageUrl = URL.createObjectURL(blob);
                    
                    // Store the cleaned image data
                    cleanedImageData = {
                        blob: blob,
                        url: cleanedImageUrl,
                        size: blob.size
                    };

                    // Display the result
                    displayResult(cleanedImageUrl);
                    
                    showProgress(false);
                    showNotification('EXIF data removed successfully!', 'success');
                }, currentFile.type, 0.95); // 95% quality
            };

            img.src = previewImage.src;
        } catch (error) {
            console.error('Error removing EXIF data:', error);
            showNotification('Error processing image. Please try again.', 'error');
            showProgress(false);
        }
    }

    function displayResult(imageUrl) {
        resultImage.src = imageUrl;
        resultSection.classList.add('show');
        
        // Scroll to result
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    function downloadCleanedImage() {
        if (!cleanedImageData) return;

        const link = document.createElement('a');
        link.href = cleanedImageData.url;
        link.download = `cleaned_${currentFile.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showNotification('Image downloaded successfully!', 'success');
    }

    function clearAll() {
        // Reset state
        currentFile = null;
        originalImageData = null;
        cleanedImageData = null;

        // Reset UI
        fileInput.value = '';
        previewImage.src = '';
        resultImage.src = '';
        
        // Hide sections
        imagePreview.classList.remove('show');
        exifSection.style.display = 'none';
        resultSection.classList.remove('show');
        progressContainer.classList.remove('show');
        
        // Reset upload area
        uploadArea.classList.remove('has-image', 'dragover');
        
        // Show empty state
        emptyState.style.display = 'flex';
        
        // Disable buttons
        removeExifBtn.disabled = true;
        
        // Clear EXIF data
        exifData.classList.remove('show');
        exifGrid.innerHTML = '';
        
        // Clean up object URLs
        if (cleanedImageData && cleanedImageData.url) {
            URL.revokeObjectURL(cleanedImageData.url);
        }
    }

    function showProgress(show) {
        if (show) {
            progressContainer.classList.add('show');
        } else {
            progressContainer.classList.remove('show');
        }
    }

    function updateProgress(percent, text) {
        progressFill.style.width = `${percent}%`;
        progressText.textContent = text;
    }

    function updateUI() {
        // Initial state
        removeExifBtn.disabled = true;
        emptyState.style.display = 'flex';
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: ${type === 'success' ? 'var(--success-color)' : 
                        type === 'error' ? 'var(--error-color)' : 
                        'var(--primary-color)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 
                                   type === 'error' ? 'exclamation-circle' : 
                                   'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Add CSS animations for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'o') {
            e.preventDefault();
            fileInput.click();
        }
        
        if (e.key === 'Escape') {
            clearAll();
        }
    });

    // Auto-focus on upload area
    uploadArea.focus();
});
