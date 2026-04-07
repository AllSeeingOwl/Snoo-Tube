const { performance } = require('perf_hooks');

function benchmark(fn, iterations = 100000) {
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        fn();
    }
    return performance.now() - start;
}

const usedCounts = {};
for (let i = 0; i < 500; i++) {
    usedCounts[`Station ${i}`] = 0;
}
// One used station at the end
usedCounts[`Station 499`] = 1;

const threshold = 1;

function currentImplementation() {
    return Object.values(usedCounts).some(count => count >= threshold);
}

function optimizedImplementation() {
    for (const key in usedCounts) {
        if (usedCounts[key] >= threshold) return true;
    }
    return false;
}

// Memory measurement
function measureMemory(fn, iterations = 10000) {
    global.gc();
    const start = process.memoryUsage().heapUsed;
    for (let i = 0; i < iterations; i++) {
        fn();
    }
    const end = process.memoryUsage().heapUsed;
    return end - start;
}

console.log('Running Benchmarks...');

// Warmup
for (let i = 0; i < 1000; i++) {
    currentImplementation();
    optimizedImplementation();
}

const timeCurrent = benchmark(currentImplementation);
const timeOptimized = benchmark(optimizedImplementation);

console.log(`Current Implementation Time: ${timeCurrent.toFixed(4)}ms`);
console.log(`Optimized Implementation Time: ${timeOptimized.toFixed(4)}ms`);
console.log(`Speedup: ${(timeCurrent / timeOptimized).toFixed(2)}x`);

const memCurrent = measureMemory(currentImplementation);
const memOptimized = measureMemory(optimizedImplementation);

console.log(`Current Implementation Memory: ${memCurrent} bytes`);
console.log(`Optimized Implementation Memory: ${memOptimized} bytes`);

if (memCurrent > memOptimized) {
    console.log(`Memory Savings: ${memCurrent - memOptimized} bytes`);
} else {
    console.log('No measurable memory savings in this node environment (GC might have intervened).');
}
