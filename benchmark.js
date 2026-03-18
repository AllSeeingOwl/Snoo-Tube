const fs = require('fs');

// Create mock document functions
const createMockElement = (tag) => ({
    appendChild: () => {},
    classList: { add: () => {}, remove: () => {} },
    dataset: {},
    setAttribute: () => {},
    style: {},
});

global.document = {
    getElementById: () => createMockElement(),
    querySelectorAll: () => [],
    querySelector: () => createMockElement(),
    createDocumentFragment: () => createMockElement(),
    createElement: createMockElement,
};
global.window = { addEventListener: () => {} };
global.navigator = { serviceWorker: { register: () => Promise.resolve() } };

global.fetch = () => Promise.resolve({
    ok: true,
    text: () => Promise.resolve(fs.readFileSync('./data/Snooker Tubey Database.csv', 'utf8'))
});

// Mock init to prevent running DOM initialization early
const originalAppCode = fs.readFileSync('./public/js/app.js', 'utf8');
const codeWithoutInit = originalAppCode.replace('if (typeof window !== \'undefined\' && typeof document !== \'undefined\') {\n    // document.addEventListener(\'DOMContentLoaded\', init); // Assuming wait is not needed since the script is at the bottom, but just in case:\n    init();\n}', '');
eval(codeWithoutInit);

async function runBenchmark() {
    await fetchStations();

    // Create actual mock elements needed for renderTable
    const mockStationsBody = {
        innerHTML: '',
        appendChild: () => {}
    };
    global.stationsBody = mockStationsBody;

    // Warmup
    for (let i = 0; i < 100; i++) {
        renderTable();
    }

    // Benchmark
    const start = performance.now();
    const ITERATIONS = 1000;

    for (let i = 0; i < ITERATIONS; i++) {
        renderTable();
    }

    const end = performance.now();
    const duration = end - start;
    const avg = duration / ITERATIONS;

    console.log(`Render Table Benchmark:`);
    console.log(`Total time for ${ITERATIONS} iterations: ${duration.toFixed(2)}ms`);
    console.log(`Average time per render: ${avg.toFixed(2)}ms`);
}

runBenchmark().catch(console.error);
