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

test('isStationLocked handles edge cases and invalid values', (t) => {
    const station = 'Waterloo';

    // Usage count strictly exceeding threshold
    app.gameState.tier = 'Advanced';
    app.gameState.usedCounts = { [station]: 5 };
    assert.strictEqual(app.isStationLocked(station), true, '5 uses in Advanced should be locked');

    app.gameState.tier = 'Intermediate';
    app.gameState.usedCounts = { [station]: 3 };
    assert.strictEqual(app.isStationLocked(station), true, '3 uses in Intermediate should be locked');

    // Invalid tier defaults to Casual (Infinity)
    app.gameState.tier = 'UnknownTier';
    app.gameState.usedCounts = { [station]: 10 };
    assert.strictEqual(app.isStationLocked(station), false, 'Unknown tier should default to Casual (unlocked)');

    // Negative usage counts
    app.gameState.tier = 'Advanced';
    app.gameState.usedCounts = { [station]: -1 };
    assert.strictEqual(app.isStationLocked(station), false, 'Negative uses should be unlocked in Advanced');

    // Non-numeric usage counts (e.g. string "2" might be coerced, but NaN should be handled by falsiness or arithmetic)
    app.gameState.tier = 'Intermediate';
    app.gameState.usedCounts = { [station]: '2' };
    assert.strictEqual(app.isStationLocked(station), true, 'String "2" should be coerced to true for Intermediate');

    app.gameState.usedCounts = { [station]: NaN };
    assert.strictEqual(app.isStationLocked(station), false, 'NaN uses should be unlocked');
});
