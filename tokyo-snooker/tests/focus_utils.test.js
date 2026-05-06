const test = require('node:test');
const assert = require('node:assert');
const app = require('../public/js/app.js');

test('getFocusableElements identifies correct elements', (t) => {
    const container = {
        querySelectorAll: (selector) => {
            assert.strictEqual(selector, 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            return [
                { tagName: 'BUTTON' },
                { tagName: 'A', href: '#' },
                { tagName: 'DIV', tabIndex: 0 }
            ];
        }
    };

    const elements = app.getFocusableElements(container);
    assert.strictEqual(elements.length, 3);
    assert.strictEqual(elements[0].tagName, 'BUTTON');
    assert.strictEqual(elements[1].tagName, 'A');
    assert.strictEqual(elements[2].tagName, 'DIV');
});

test('getFocusableElements handles null container', (t) => {
    const elements = app.getFocusableElements(null);
    assert.deepStrictEqual(elements, []);
});
