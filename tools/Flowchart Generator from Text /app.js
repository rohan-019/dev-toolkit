document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text');
    const renderBtn = document.getElementById('renderBtn');
    const output = document.getElementById('output');
    const diagram = document.getElementById('diagram');

    // Initialize mermaid with dark theme
    mermaid.initialize({
        startOnLoad: true,
        theme: 'dark',
        flowchart: {
            curve: 'basis',
            defaultRenderer: 'elk'
        },
        themeVariables: {
            primaryColor: '#ff6b35',
            primaryTextColor: '#fff',
            primaryBorderColor: 'rgba(255, 255, 255, 0.1)',
            lineColor: '#ff6b35',
            textColor: '#fff'
        }
    });

    function generateFlowchart() {
        try {
            // Clean and parse input
            const input = textInput.value.trim();
            const connections = input.split(';')
                .map(conn => conn.trim())
                .filter(conn => conn.length > 0);

            // Generate mermaid syntax
            const mermaidCode = [
                'graph LR',
                ...connections
            ].join('\n');

            // Update output
            output.textContent = mermaidCode;

            // Clear and render diagram
            diagram.innerHTML = '';
            diagram.innerHTML = `<div class="mermaid">${mermaidCode}</div>`;
            mermaid.init(undefined, '.mermaid');
        } catch (error) {
            output.textContent = `Error: ${error.message}`;
            diagram.innerHTML = '<p class="error">Failed to generate flowchart</p>';
        }
    }

    // Event listeners
    renderBtn.addEventListener('click', generateFlowchart);
    textInput.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            generateFlowchart();
        }
    });

    // Generate initial flowchart
    generateFlowchart();
});