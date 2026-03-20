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
