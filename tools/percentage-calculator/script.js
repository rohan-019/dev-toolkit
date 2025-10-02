function calculatePercentage() {
    const percentage = document.getElementById('percentage').value;
    const number = document.getElementById('number').value;
    const resultDiv = document.getElementById('result');
    
    if (percentage === '' || number === '') {
        resultDiv.innerHTML = 'Please enter both values';
        resultDiv.classList.remove('show');
        return;
    }

    const result = (percentage * number) / 100;
    resultDiv.innerHTML = `Result: ${result}`;
    resultDiv.classList.add('show');
}