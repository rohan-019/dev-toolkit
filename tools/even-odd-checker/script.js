const numberInput = document.getElementById('numberInput');
const result = document.getElementById('result');

numberInput.addEventListener('input', () => {
    const value = numberInput.value;
    if (value === "" || isNaN(value)) {
        result.textContent = "";
        return;
    }
    const num = Number(value);
    if (!Number.isInteger(num)) {
        result.textContent = "Please enter an integer.";
        return;
    }
    result.textContent = num % 2 === 0 ? `${num} is Even` : `${num} is Odd`;
});
