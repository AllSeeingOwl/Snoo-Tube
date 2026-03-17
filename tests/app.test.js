const test = require('node:test');
const assert = require('node:assert');
const app = require('../public/js/app.js');

test('getLockThreshold returns correct values for each tier', (t) => {
    app.gameState.tier = 'Advanced';
    assert.strictEqual(app.getLockThreshold(), 1);

    app.gameState.tier = 'Intermediate';
    assert.strictEqual(app.getLockThreshold(), 2);

    app.gameState.tier = 'Casual';
    assert.strictEqual(app.getLockThreshold(), Infinity);
});

test('isStationLocked correctly identifies locked stations', (t) => {
    const station = 'Baker Street';

    // Advanced Tier (Threshold = 1)
    app.gameState.tier = 'Advanced';
    app.gameState.usedCounts = {};
    assert.strictEqual(app.isStationLocked(station), false, '0 uses should be unlocked in Advanced');

    app.gameState.usedCounts[station] = 1;
    assert.strictEqual(app.isStationLocked(station), true, '1 use should be locked in Advanced');

    // Intermediate Tier (Threshold = 2)
    app.gameState.tier = 'Intermediate';
    app.gameState.usedCounts = {};
    assert.strictEqual(app.isStationLocked(station), false, '0 uses should be unlocked in Intermediate');

    app.gameState.usedCounts[station] = 1;
    assert.strictEqual(app.isStationLocked(station), false, '1 use should be unlocked in Intermediate');

    app.gameState.usedCounts[station] = 2;
    assert.strictEqual(app.isStationLocked(station), true, '2 uses should be locked in Intermediate');

    // Casual Tier (Threshold = Infinity)
    app.gameState.tier = 'Casual';
    app.gameState.usedCounts = {};
    assert.strictEqual(app.isStationLocked(station), false, '0 uses should be unlocked in Casual');

    app.gameState.usedCounts[station] = 100;
    assert.strictEqual(app.isStationLocked(station), false, '100 uses should be unlocked in Casual');
});

test('isStationLocked handles missing station entries', (t) => {
    app.gameState.tier = 'Advanced';
    app.gameState.usedCounts = {};
    assert.strictEqual(app.isStationLocked('Non-existent Station'), false);
});
