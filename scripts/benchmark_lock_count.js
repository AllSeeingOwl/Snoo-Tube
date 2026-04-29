const { performance } = require('perf_hooks');

function benchmark(name, fn, iterations = 100000) {
    // Warmup
    for (let i = 0; i < 1000; i++) fn();

    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        fn();
    }
    const end = performance.now() - start;
    console.log(`${name}: ${end.toFixed(4)}ms`);
    return end;
}

const allStations = [];
for (let i = 0; i < 300; i++) {
    allStations.push({ name: `Station ${i}` });
}

const usedCounts = Object.create(null);
for (let i = 0; i < 50; i++) {
    usedCounts[`Station ${i}`] = Math.floor(Math.random() * 5);
}

const threshold = 2;

function currentForIn() {
    let count = 0;
    for (const key in usedCounts) {
        if (usedCounts[key] >= threshold) {
            count++;
        }
    }
    return count;
}

function proposedObjectValuesFilter() {
    return Object.values(usedCounts).filter(count => count >= threshold).length;
}

function proposedObjectValuesReduce() {
    return Object.values(usedCounts).reduce((acc, count) => count >= threshold ? acc + 1 : acc, 0);
}

function memorySuggestedForLoop() {
    let count = 0;
    const len = allStations.length;
    for (let i = 0; i < len; i++) {
        if ((usedCounts[allStations[i].name] || 0) >= threshold) {
            count++;
        }
    }
    return count;
}

console.log('Running Benchmarks (50 used stations out of 300 total)...');
benchmark('For...in (Current)', currentForIn);
benchmark('Object.values().filter() (Proposed)', proposedObjectValuesFilter);
benchmark('Object.values().reduce()', proposedObjectValuesReduce);
benchmark('For loop over allStations (Memory)', memorySuggestedForLoop);

// Test with more used stations
for (let i = 50; i < 250; i++) {
    usedCounts[`Station ${i}`] = Math.floor(Math.random() * 5);
}
console.log('\nRunning Benchmarks (250 used stations out of 300 total)...');
benchmark('For...in (Current)', currentForIn);
benchmark('Object.values().filter() (Proposed)', proposedObjectValuesFilter);
benchmark('Object.values().reduce()', proposedObjectValuesReduce);
benchmark('For loop over allStations (Memory)', memorySuggestedForLoop);
