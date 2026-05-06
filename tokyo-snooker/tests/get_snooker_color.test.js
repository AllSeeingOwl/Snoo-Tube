const test = require('node:test');
const assert = require('node:assert');
const { getSnookerColor } = require('../../generate_tokyo_stations.js');

test('getSnookerColor maps lines to correct snooker colors', (t) => {
    assert.strictEqual(getSnookerColor('Marunouchi'), 'Red');
    assert.strictEqual(getSnookerColor('Oedo'), 'Red');
    assert.strictEqual(getSnookerColor('Ginza'), 'Yellow');
    assert.strictEqual(getSnookerColor('Yurakucho'), 'Yellow');
    assert.strictEqual(getSnookerColor('Chiyoda'), 'Green');
    assert.strictEqual(getSnookerColor('Shinjuku'), 'Green');
    assert.strictEqual(getSnookerColor('Fukutoshin'), 'Brown');
    assert.strictEqual(getSnookerColor('Hibiya'), 'Brown');
    assert.strictEqual(getSnookerColor('Tozai'), 'Blue');
    assert.strictEqual(getSnookerColor('Mita'), 'Blue');
    assert.strictEqual(getSnookerColor('Asakusa'), 'Pink');
    assert.strictEqual(getSnookerColor('Hanzomon'), 'Pink');
    assert.strictEqual(getSnookerColor('Namboku'), 'Black');
});

test('getSnookerColor returns Black for unknown lines', (t) => {
    assert.strictEqual(getSnookerColor('Unknown Line'), 'Black');
    assert.strictEqual(getSnookerColor(''), 'Black');
    assert.strictEqual(getSnookerColor(null), 'Black');
});
