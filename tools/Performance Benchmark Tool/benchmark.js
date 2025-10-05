document.addEventListener('DOMContentLoaded', () => {
    const code1Input = document.getElementById('code1');
    const code2Input = document.getElementById('code2');
    const runBtn = document.getElementById('runBtn');
    const result = document.getElementById('result');

    function benchmark(fn, iterations = 100000) {
        const start = performance.now();
        for (let i = 0; i < iterations; i++) {
            fn();
        }
        const end = performance.now();
        return end - start;
    }

    function runBenchmark() {
        try {
            result.innerHTML = 'Running benchmark...';

            // Create functions from input
            const fn1 = new Function(code1Input.value);
            const fn2 = new Function(code2Input.value);

            // Run benchmarks
            const time1 = benchmark(fn1);
            const time2 = benchmark(fn2);

            // Calculate operations per second
            const ops1 = Math.floor(100000 / (time1 / 1000));
            const ops2 = Math.floor(100000 / (time2 / 1000));

            // Format results
            result.innerHTML = `
                <h3>Results:</h3>
                <p><strong>Snippet 1:</strong> ${ops1.toLocaleString()} ops/sec (${time1.toFixed(2)}ms)</p>
                <p><strong>Snippet 2:</strong> ${ops2.toLocaleString()} ops/sec (${time2.toFixed(2)}ms)</p>
                <p><strong>Difference:</strong> ${Math.abs(ops1 - ops2).toLocaleString()} ops/sec</p>
                <p><strong>Winner:</strong> ${ops1 > ops2 ? 'Snippet 1' : 'Snippet 2'} is ${Math.abs((ops1 / ops2 * 100) - 100).toFixed(2)}% faster</p>
            `;
        } catch (error) {
            result.innerHTML = `Error: ${error.message}`;
        }
    }

    // Event listeners
    runBtn.addEventListener('click', runBenchmark);
});