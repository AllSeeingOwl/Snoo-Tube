const { performance } = require('perf_hooks');

// Mock CSS.escape since we don't have JSDOM and it's a simple function
const CSS = {
    escape: (str) => str.replace(/[!"#$%&'()*+,.\/:;<=>?@\[\\\]^`{|}~]/g, "\\$&")
};

const stationNames = [];
for (let i = 0; i < 430; i++) {
    stationNames.push(`Station ${i}`);
}

// Mock querySelector lookup time
// In a real browser, querySelector with an attribute selector is roughly O(N) or at least requires some DOM traversal.
// We'll simulate this by doing a manual search in an array to represent the "cost" of querySelector.
const mockDOMRows = stationNames.map(name => ({
    dataset: { stationName: name },
    querySelector: (selector) => ({ textContent: '' }) // Mock nested querySelector
}));

function updateStationRowDOM_Baseline(stationName) {
    const tr = mockDOMRows.find(row => row.dataset.stationName === stationName);
    if (!tr) return;

    const nameDiv = tr.querySelector('.station-name');
    const usesTd = tr.querySelector('.use-count');
    if (nameDiv && usesTd) {
        usesTd.textContent = '1';
    }
}

// Map approach
const stationRowCache = new Map();
mockDOMRows.forEach(row => {
    stationRowCache.set(row.dataset.stationName, row);
});

function updateStationRowDOM_Optimized(stationName) {
    const tr = stationRowCache.get(stationName);
    if (!tr) return;

    const nameDiv = tr.querySelector('.station-name');
    const usesTd = tr.querySelector('.use-count');
    if (nameDiv && usesTd) {
        usesTd.textContent = '1';
    }
}

const iterations = 100000;

// Baseline
console.log("Starting Baseline...");
const startBaseline = performance.now();
for (let i = 0; i < iterations; i++) {
    updateStationRowDOM_Baseline(stationNames[i % stationNames.length]);
}
const endBaseline = performance.now();
const baselineTotal = endBaseline - startBaseline;

// Optimized
console.log("Starting Optimized...");
const startOptimized = performance.now();
for (let i = 0; i < iterations; i++) {
    updateStationRowDOM_Optimized(stationNames[i % stationNames.length]);
}
const endOptimized = performance.now();
const optimizedTotal = endOptimized - startOptimized;

console.log(`\nResults for ${iterations} iterations:`);
console.log(`Baseline (Simulated querySelector): ${baselineTotal.toFixed(4)}ms`);
console.log(`Optimized (Map lookup): ${optimizedTotal.toFixed(4)}ms`);
console.log(`Improvement: ${((baselineTotal - optimizedTotal) / baselineTotal * 100).toFixed(2)}%`);
console.log(`Speedup: ${(baselineTotal / optimizedTotal).toFixed(2)}x`);
