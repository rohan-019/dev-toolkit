// Temperature Converter
document.addEventListener('DOMContentLoaded', function() {
    const celsiusInput = document.getElementById('celsius');
    const fahrenheitInput = document.getElementById('fahrenheit');
    const kelvinInput = document.getElementById('kelvin');
    
    let isConverting = false; // Prevent infinite loops
    
    // Auto-focus on Celsius input
    celsiusInput.focus();
    
    // Add event listeners for real-time conversion
    celsiusInput.addEventListener('input', () => convertFromCelsius());
    fahrenheitInput.addEventListener('input', () => convertFromFahrenheit());
    kelvinInput.addEventListener('input', () => convertFromKelvin());
    
    // Conversion functions
    function convertFromCelsius() {
        if (isConverting) return;
        isConverting = true;
        
        const celsius = parseFloat(celsiusInput.value);
        
        if (isNaN(celsius)) {
            fahrenheitInput.value = '';
            kelvinInput.value = '';
        } else {
            // Convert to Fahrenheit: °F = (°C × 9/5) + 32
            const fahrenheit = (celsius * 9/5) + 32;
            fahrenheitInput.value = roundToDecimals(fahrenheit, 2);
            
            // Convert to Kelvin: K = °C + 273.15
            const kelvin = celsius + 273.15;
            kelvinInput.value = roundToDecimals(kelvin, 2);
        }
        
        isConverting = false;
    }
    
    function convertFromFahrenheit() {
        if (isConverting) return;
        isConverting = true;
        
        const fahrenheit = parseFloat(fahrenheitInput.value);
        
        if (isNaN(fahrenheit)) {
            celsiusInput.value = '';
            kelvinInput.value = '';
        } else {
            // Convert to Celsius: °C = (°F - 32) × 5/9
            const celsius = (fahrenheit - 32) * 5/9;
            celsiusInput.value = roundToDecimals(celsius, 2);
            
            // Convert to Kelvin: K = °C + 273.15
            const kelvin = celsius + 273.15;
            kelvinInput.value = roundToDecimals(kelvin, 2);
        }
        
        isConverting = false;
    }
    
    function convertFromKelvin() {
        if (isConverting) return;
        isConverting = true;
        
        const kelvin = parseFloat(kelvinInput.value);
        
        if (isNaN(kelvin)) {
            celsiusInput.value = '';
            fahrenheitInput.value = '';
        } else {
            // Convert to Celsius: °C = K - 273.15
            const celsius = kelvin - 273.15;
            celsiusInput.value = roundToDecimals(celsius, 2);
            
            // Convert to Fahrenheit: °F = (°C × 9/5) + 32
            const fahrenheit = (celsius * 9/5) + 32;
            fahrenheitInput.value = roundToDecimals(fahrenheit, 2);
        }
        
        isConverting = false;
    }
    
    // Utility function to round to specified decimal places
    function roundToDecimals(value, decimals) {
        return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
    }
    
    // Clear all inputs
    window.clearAll = function() {
        celsiusInput.value = '';
        fahrenheitInput.value = '';
        kelvinInput.value = '';
        celsiusInput.focus();
    };
    
    // Set common temperature values
    window.setCommonTemp = function(type) {
        isConverting = true;
        
        switch(type) {
            case 'freezing':
                // Water freezing point
                celsiusInput.value = '0';
                fahrenheitInput.value = '32';
                kelvinInput.value = '273.15';
                break;
            case 'boiling':
                // Water boiling point
                celsiusInput.value = '100';
                fahrenheitInput.value = '212';
                kelvinInput.value = '373.15';
                break;
            case 'body':
                // Normal body temperature
                celsiusInput.value = '37';
                fahrenheitInput.value = '98.6';
                kelvinInput.value = '310.15';
                break;
        }
        
        isConverting = false;
    };
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+A or Cmd+A to clear all
        if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
            e.preventDefault();
            clearAll();
        }
        
        // Escape to clear all
        if (e.key === 'Escape') {
            clearAll();
        }
        
        // Tab navigation between inputs
        if (e.key === 'Tab') {
            const inputs = [celsiusInput, fahrenheitInput, kelvinInput];
            const currentIndex = inputs.findIndex(input => input === document.activeElement);
            
            if (currentIndex !== -1) {
                e.preventDefault();
                const nextIndex = e.shiftKey 
                    ? (currentIndex - 1 + inputs.length) % inputs.length
                    : (currentIndex + 1) % inputs.length;
                inputs[nextIndex].focus();
            }
        }
    });
    
    // Add input validation
    [celsiusInput, fahrenheitInput, kelvinInput].forEach(input => {
        input.addEventListener('keypress', function(e) {
            // Allow: backspace, delete, tab, escape, enter, decimal point, minus sign
            if ([8, 9, 27, 13, 46, 45].indexOf(e.keyCode) !== -1 ||
                // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
                (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
                (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
                (e.keyCode === 88 && (e.ctrlKey || e.metaKey))) {
                return;
            }
            
            // Ensure it's a number or decimal point
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && 
                (e.keyCode < 96 || e.keyCode > 105) && 
                e.keyCode !== 190 && e.keyCode !== 110) {
                e.preventDefault();
            }
        });
    });
});