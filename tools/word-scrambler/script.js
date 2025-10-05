function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function scrambleWord(word) {
    if (word.length <= 3) return word;
    const first = word[0];
    const last = word[word.length - 1];
    const middle = word.slice(1, -1).split('');
    shuffleArray(middle);
    return first + middle.join('') + last;
}

function scrambleText(text) {
    return text.replace(/\w+/g, scrambleWord);
}

document.getElementById('scrambleBtn').addEventListener('click', function() {
    const input = document.getElementById('inputText').value;
    const result = scrambleText(input);
    document.getElementById('output').textContent = result;
});