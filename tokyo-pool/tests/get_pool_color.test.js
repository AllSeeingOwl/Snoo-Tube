const test = require('node:test');
const assert = require('node:assert');
const { getPoolColor } = require('../../generate_tokyo_stations.js');

test('getPoolColor maps lines to correct pool colors', (t) => {
    assert.strictEqual(getPoolColor('Marunouchi'), 'Red (Solid)');
    assert.strictEqual(getPoolColor('Oedo'), 'Red (Stripe)');
    assert.strictEqual(getPoolColor('Ginza'), 'Orange (Solid)');
    assert.strictEqual(getPoolColor('Yurakucho'), 'Yellow (Solid)');
    assert.strictEqual(getPoolColor('Chiyoda'), 'Green (Solid)');
    assert.strictEqual(getPoolColor('Shinjuku'), 'Green (Stripe)');
    assert.strictEqual(getPoolColor('Fukutoshin'), 'Brown (Solid)');
    assert.strictEqual(getPoolColor('Hibiya'), 'Brown (Stripe)');
    assert.strictEqual(getPoolColor('Tozai'), 'Blue (Solid)');
    assert.strictEqual(getPoolColor('Mita'), 'Blue (Stripe)');
    assert.strictEqual(getPoolColor('Asakusa'), 'Purple (Solid)');
    assert.strictEqual(getPoolColor('Hanzomon'), 'Purple (Stripe)');
    assert.strictEqual(getPoolColor('Namboku'), 'Black');
});

test('getPoolColor returns Black for unknown lines', (t) => {
    assert.strictEqual(getPoolColor('Unknown Line'), 'Black');
    assert.strictEqual(getPoolColor(''), 'Black');
    assert.strictEqual(getPoolColor(null), 'Black');
});
