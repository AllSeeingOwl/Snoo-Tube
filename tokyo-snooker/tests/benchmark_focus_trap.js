const { performance } = require('perf_hooks');

// Mocking the DOM environment minimally for the benchmark
const createMockElement = (tag, attributes = {}) => ({
    tagName: tag.toUpperCase(),
    attributes,
    getAttribute: (name) => attributes[name] || null,
    matches: (selector) => {
        if (selector === 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') {
            return ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(tag.toUpperCase()) || attributes.tabindex !== "-1";
        }
        return false;
    },
    focus: () => {}
});

const elements = [
    createMockElement('button'),
    createMockElement('input'),
    createMockElement('div', { tabindex: '0' }),
    createMockElement('div', { tabindex: '-1' }),
    createMockElement('span'),
    createMockElement('a', { href: '#' }),
    createMockElement('textarea'),
    createMockElement('select'),
];

// Replicate the list of elements many times to simulate a larger modal if needed
const manyElements = [];
for (let i = 0; i < 20; i++) {
    manyElements.push(...elements);
}

const wildcardModalMock = {
    querySelectorAll: (selector) => {
        // Simple mock of the selector used in the app
        if (selector === 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') {
            return manyElements.filter(el =>
                ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName) ||
                (el.attributes.tabindex !== undefined && el.attributes.tabindex !== "-1")
            );
        }
        return [];
    }
};

function currentImplementation() {
    const focusableElements = wildcardModalMock.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length === 0) return;
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
}

const cachedFocusableElements = wildcardModalMock.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
function optimizedImplementation() {
    const focusableElements = cachedFocusableElements;
    if (focusableElements.length === 0) return;
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
}

const iterations = 1000000;

console.log(`Running benchmark with ${iterations} iterations...`);

// Warmup
for (let i = 0; i < 10000; i++) {
    currentImplementation();
    optimizedImplementation();
}

const startCurrent = performance.now();
for (let i = 0; i < iterations; i++) {
    currentImplementation();
}
const endCurrent = performance.now();
const timeCurrent = endCurrent - startCurrent;

const startOptimized = performance.now();
for (let i = 0; i < iterations; i++) {
    optimizedImplementation();
}
const endOptimized = performance.now();
const timeOptimized = endOptimized - startOptimized;

console.log(`Current Implementation (querySelectorAll): ${timeCurrent.toFixed(4)}ms`);
console.log(`Optimized Implementation (cached): ${timeOptimized.toFixed(4)}ms`);
console.log(`Speedup: ${(timeCurrent / timeOptimized).toFixed(2)}x`);
console.log(`Improvement: ${((timeCurrent - timeOptimized) / timeCurrent * 100).toFixed(2)}%`);
