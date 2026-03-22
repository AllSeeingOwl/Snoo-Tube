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

test('getLockThreshold returns Infinity for unknown or missing tiers (defaults to Casual logic)', (t) => {
    app.gameState.tier = 'Unknown';
    assert.strictEqual(app.getLockThreshold(), Infinity);

    app.gameState.tier = '';
    assert.strictEqual(app.getLockThreshold(), Infinity);

    app.gameState.tier = undefined;
    assert.strictEqual(app.getLockThreshold(), Infinity);

    app.gameState.tier = null;
    assert.strictEqual(app.getLockThreshold(), Infinity);
});

test('getLockThreshold returns Infinity when gameState is malformed or missing tier property', (t) => {
    // Preserve original gameState to restore later
    const originalTier = app.gameState.tier;

    // Simulate completely removing tier property
    delete app.gameState.tier;
    assert.strictEqual(app.getLockThreshold(), Infinity, 'Should handle missing tier property');

    // Restore
    app.gameState.tier = originalTier;
});

test('getLockThreshold returns Infinity when gameState is overridden completely', (t) => {
    // Note: since gameState is an exported object reference we can mutate its contents
    // but not reassign the variable inside app.js if it was a const/let, however we can simulate
    // an empty object state
    const originalGameState = { ...app.gameState };

    // Clear properties
    for (let key in app.gameState) delete app.gameState[key];

    assert.strictEqual(app.getLockThreshold(), Infinity, 'Should handle completely empty gameState object');

    // Restore
    Object.assign(app.gameState, originalGameState);
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

test('isStationLocked handles an explicit threshold parameter', (t) => {
    const station = 'Euston';
    app.gameState.usedCounts = { [station]: 1 };

    // Default threshold for Advanced is 1, so 1 use should be locked
    app.gameState.tier = 'Advanced';
    assert.strictEqual(app.isStationLocked(station), true, 'Should be locked without explicit threshold (Advanced)');

    // Passing explicit threshold of 2 should override and return unlocked
    assert.strictEqual(app.isStationLocked(station, 2), false, 'Should be unlocked when explicit threshold 2 > uses 1');

    // Passing explicit threshold of 1 should lock
    assert.strictEqual(app.isStationLocked(station, 1), true, 'Should be locked when explicit threshold 1 == uses 1');

    // Passing explicit threshold of 0 should lock
    assert.strictEqual(app.isStationLocked(station, 0), true, 'Should be locked when explicit threshold 0 < uses 1');
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

test('parseCSV correctly parses a simple CSV string', (t) => {
    const csvData = `Station Name,Lines Served,Valid for Colours,Zone(s)
Station A,Line 1,Red,1
Station B,Line 2,Blue,2`;

    const parsed = app.parseCSV(csvData);

    assert.strictEqual(parsed.length, 2);
    assert.strictEqual(parsed[0].name, 'Station A');
    assert.strictEqual(parsed[0].lines, 'Line 1');
    assert.strictEqual(parsed[0].colours, 'Red');
    assert.strictEqual(parsed[0].zone, '1');
    assert.deepStrictEqual(parsed[0].parsedColours, ['red']);

    assert.strictEqual(parsed[1].name, 'Station B');
    assert.strictEqual(parsed[1].lines, 'Line 2');
    assert.strictEqual(parsed[1].colours, 'Blue');
    assert.strictEqual(parsed[1].zone, '2');
    assert.deepStrictEqual(parsed[1].parsedColours, ['blue']);
});

test('parseCSV correctly merges interchange stations on multiple lines', (t) => {
    const csvData = `Station Name,Lines Served,Valid for Colours,Zone(s)
Interchange Station,Line 1,Red,1
,Line 2,Blue,1`;

    const parsed = app.parseCSV(csvData);

    assert.strictEqual(parsed.length, 1);
    assert.strictEqual(parsed[0].name, 'Interchange Station');
    assert.strictEqual(parsed[0].lines, 'Line 1, Line 2');
    assert.strictEqual(parsed[0].colours, 'Red, Blue');
    assert.strictEqual(parsed[0].zone, '1');
    assert.deepStrictEqual(parsed[0].parsedColours, ['red', 'blue']);
});

test('parseCSV correctly handles quotes and commas within fields', (t) => {
    const csvData = `Station Name,Lines Served,Valid for Colours,Zone(s),"Times Used (This Game)"
"Station, C",Line 1,Red,1,0
Station D,"Line 2, Line 3",Blue,2,0`;

    const parsed = app.parseCSV(csvData);

    assert.strictEqual(parsed.length, 2);
    assert.strictEqual(parsed[0].name, 'Station, C');
    assert.strictEqual(parsed[0].lines, 'Line 1');
    assert.strictEqual(parsed[0].colours, 'Red');

    assert.strictEqual(parsed[1].name, 'Station D');
    assert.strictEqual(parsed[1].lines, 'Line 2, Line 3');
    assert.strictEqual(parsed[1].colours, 'Blue');
});

test('parseCSV ignores empty lines', (t) => {
    const csvData = `Station Name,Lines Served,Valid for Colours,Zone(s)
Station E,Line 1,Red,1

Station F,Line 2,Blue,2`;

    const parsed = app.parseCSV(csvData);

    assert.strictEqual(parsed.length, 2);
    assert.strictEqual(parsed[0].name, 'Station E');
    assert.strictEqual(parsed[1].name, 'Station F');
});

test('parseCSV correctly extracts and pre-computes search data', (t) => {
    const csvData = `Station Name,Lines Served,Valid for Colours,Zone(s)
King's Cross St. Pancras,Circle,Yellow,1
,Piccadilly,Blue,1`;

    const parsed = app.parseCSV(csvData);

    assert.strictEqual(parsed.length, 1);
    const station = parsed[0];

    assert.strictEqual(station.searchName, "king's cross st. pancras");
    assert.strictEqual(station.searchLines, 'circle, piccadilly');
    assert.strictEqual(station.searchColours, 'yellow, blue');
    assert.deepStrictEqual(station.parsedColours, ['yellow', 'blue']);
});

test('parseCSV handles different column orders', (t) => {
    const csvData = `Zone(s),Valid for Colours,Station Name,Lines Served
1,Red,Station A,Line 1
2,Blue,Station B,Line 2`;

    const parsed = app.parseCSV(csvData);

    assert.strictEqual(parsed.length, 2);
    assert.strictEqual(parsed[0].name, 'Station A');
    assert.strictEqual(parsed[0].lines, 'Line 1');
    assert.strictEqual(parsed[0].colours, 'Red');
    assert.strictEqual(parsed[0].zone, '1');

    assert.strictEqual(parsed[1].name, 'Station B');
    assert.strictEqual(parsed[1].lines, 'Line 2');
    assert.strictEqual(parsed[1].colours, 'Blue');
    assert.strictEqual(parsed[1].zone, '2');
});

test('parseCSV handles missing optional columns', (t) => {
    const csvData = `Station Name,Lines Served
Station A,Line 1
Station B,Line 2`;

    const parsed = app.parseCSV(csvData);

    assert.strictEqual(parsed.length, 2);
    assert.strictEqual(parsed[0].name, 'Station A');
    assert.strictEqual(parsed[0].lines, 'Line 1');
    assert.strictEqual(parsed[0].colours, '');
    assert.strictEqual(parsed[0].zone, '');

    assert.strictEqual(parsed[1].name, 'Station B');
    assert.strictEqual(parsed[1].lines, 'Line 2');
    assert.strictEqual(parsed[1].colours, '');
    assert.strictEqual(parsed[1].zone, '');
});

test('parseCSV handles missing mandatory Station Name column', (t) => {
    const csvData = `Lines Served,Zone(s)
Line 1,1
Line 2,2`;

    const parsed = app.parseCSV(csvData);

    assert.strictEqual(parsed.length, 0);
});

test('parseCSV handles empty string input gracefully', (t) => {
    const csvData = ``;
    const parsed = app.parseCSV(csvData);
    assert.strictEqual(parsed.length, 0);
});

test('parseCSV handles an orphan secondary line (empty station name on first row)', (t) => {
    const csvData = `Station Name,Lines Served,Valid for Colours,Zone(s)
,Line 1,Red,1
Station A,Line 2,Blue,2`;

    const parsed = app.parseCSV(csvData);

    assert.strictEqual(parsed.length, 1);
    assert.strictEqual(parsed[0].name, 'Station A');
    assert.strictEqual(parsed[0].lines, 'Line 2');
    assert.strictEqual(parsed[0].colours, 'Blue');
});

test('parseCSV correctly deduplicates and filters colours', (t) => {
    const csvData = `Station Name,Lines Served,Valid for Colours,Zone(s)
Station A,Line 1,"Red, Red, purple, Black",1`;

    const parsed = app.parseCSV(csvData);

    assert.strictEqual(parsed.length, 1);
    // Note: parsedColours is a property added dynamically by a subsequent processing
    // step over the returned `stations` array inside parseCSV. Since it modifies the
    // returned objects, it works when we test it here.
    assert.deepStrictEqual(parsed[0].parsedColours, ['red', 'black']);
});

test('debounce correctly batches rapid calls', async (t) => {
    let callCount = 0;
    const increment = () => callCount++;

    const debouncedIncrement = app.debounce(increment, 50);

    // Call it 5 times rapidly
    debouncedIncrement();
    debouncedIncrement();
    debouncedIncrement();
    debouncedIncrement();
    debouncedIncrement();

    // Verify it hasn't been called immediately
    assert.strictEqual(callCount, 0, 'Should not be called immediately');

    // Wait for debounce period
    await new Promise(resolve => setTimeout(resolve, 60));

    // Verify it was only called once
    assert.strictEqual(callCount, 1, 'Should only be called once after delay');

    // Call it again
    debouncedIncrement();

    // Wait for debounce period again
    await new Promise(resolve => setTimeout(resolve, 60));

    // Verify it was called a second time
    assert.strictEqual(callCount, 2, 'Should be called again after another delay');
});
