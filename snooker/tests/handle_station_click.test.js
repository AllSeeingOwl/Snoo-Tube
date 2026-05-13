const test = require('node:test');
const assert = require('node:assert');

// Mock DOM environment
const mockElement = (id = '') => {
    const el = {
        id: id,
        _classList: new Set(),
        get classList() {
            const self = this;
            return {
                add: function(cls) { self._classList.add(cls); },
                remove: function(cls) { self._classList.delete(cls); },
                contains: function(cls) { return self._classList.has(cls); }
            };
        },
        setAttribute: () => {},
        removeAttribute: () => {},
        replaceChildren: () => {},
        addEventListener: () => {},
        dispatchEvent: () => {},
        querySelector: () => null,
        querySelectorAll: () => [],
        value: '',
        _textContent: '',
        get textContent() { return this._textContent; },
        set textContent(v) { this._textContent = v; },
        childNodes: [],
        appendChild(n) { this.childNodes.push(n); return n; },
        dataset: {},
        style: {},
        focus: () => {}
    };
    return el;
};

const elementsById = new Map();

global.document = {
    activeElement: null,
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: (id) => {
        if (!elementsById.has(id)) {
            elementsById.set(id, mockElement(id));
        }
        return elementsById.get(id);
    },
    createElement: (tag) => {
        const el = mockElement();
        el.tagName = tag.toUpperCase();
        return el;
    },
    createDocumentFragment: () => mockElement('fragment'),
    createTextNode: (t) => ({ textContent: t })
};
global.window = {
    self: {},
    top: {},
    addEventListener: () => {}
};
global.navigator = {
    serviceWorker: {
        register: () => Promise.resolve()
    }
};
global.confirm = () => true;
global.localStorage = {
    getItem: () => null,
    setItem: () => {}
};
global.CSS = {
    escape: (s) => s
};

const app = require('../public/js/app.js');

// Initialize DOM elements in the app
app.initDOMElements();

test('handleStationClick shows a toast and returns early if the station is already locked', (t) => {
    // Setup
    app.gameState.tier = 'Advanced';
    app.gameState.usedCounts = Object.create(null);
    app.gameState.usedCounts['Station A'] = 1;

    const toast = document.getElementById('toast');
    toast.textContent = '';

    app.handleStationClick('Station A');

    assert.ok(toast.textContent.includes('already locked!'), `Expected toast to include "already locked!", but got "${toast.textContent}"`);
    assert.strictEqual(app.gameState.usedCounts['Station A'], 1, 'Usage count should not change');
});

test('handleStationClick does nothing if the user cancels the confirmation', (t) => {
    // Setup
    app.gameState.usedCounts = Object.create(null);
    app.gameState.usedCounts['Station B'] = 0;

    const originalConfirm = global.confirm;
    global.confirm = () => false;

    try {
        app.handleStationClick('Station B');
        assert.strictEqual(app.gameState.usedCounts['Station B'], 0, 'Usage count should not change');
    } finally {
        global.confirm = originalConfirm;
    }
});

test('handleStationClick increments usage and updates state for an unlocked station', (t) => {
    // Setup
    app.gameState.tier = 'Intermediate'; // threshold 2
    app.gameState.usedCounts = Object.create(null);
    app.gameState.totalUsed = 0;

    const originalConfirm = global.confirm;
    global.confirm = () => true;

    const toast = document.getElementById('toast');
    toast.textContent = '';

    app.handleStationClick('Station C');

    assert.strictEqual(app.gameState.usedCounts['Station C'], 1);
    assert.strictEqual(app.gameState.totalUsed, 1);
    assert.ok(toast.textContent.startsWith('✅'), `Expected toast to start with "✅", but got "${toast.textContent}"`);
});

test('handleStationClick correctly handles a station becoming locked', (t) => {
    // Setup
    app.gameState.tier = 'Advanced'; // threshold 1
    app.gameState.usedCounts = Object.create(null);
    app.gameState.lockedCount = 0;

    const originalConfirm = global.confirm;
    global.confirm = () => true;

    const toast = document.getElementById('toast');
    toast.textContent = '';

    app.handleStationClick('Station D');

    assert.strictEqual(app.gameState.usedCounts['Station D'], 1);
    assert.strictEqual(app.gameState.lockedCount, 1);
    assert.ok(toast.textContent.includes('LOCKED'), `Expected toast to include "LOCKED", but got "${toast.textContent}"`);
});

test('handleStationClick triggers applyFilters when station locks while unlocked filter is active', (t) => {
    // Setup
    app.gameState.tier = 'Advanced';
    app.gameState.usedCounts = Object.create(null);
    app.currentFilterType = 'unlocked';

    const originalConfirm = global.confirm;
    global.confirm = () => true;

    // We can verify applyFilters by checking side effects on displayStations
    app.allStations = [{ name: 'Station E', searchCombined: 'station e' }];
    app.displayStations = [{ name: 'Station E', searchCombined: 'station e' }];

    try {
        app.handleStationClick('Station E');
        // Station E is now locked, and filter is 'unlocked', so it should be removed from displayStations
        const found = app.displayStations.find(s => s.name === 'Station E');
        assert.strictEqual(found, undefined, 'Station E should be filtered out of displayStations');
    } finally {
        global.confirm = originalConfirm;
        app.currentFilterType = 'all';
        app.allStations = [];
        app.displayStations = [];
    }
});
