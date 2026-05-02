const test = require('node:test');
const assert = require('node:assert');

function createMockNode(tagName = '') {
    const node = {
        tagName: tagName.toUpperCase(),
        _classList: new Set(),
        get classList() {
            const self = this;
            return {
                add(c) {
                    c.split(/\s+/).forEach(cls => { if(cls) self._classList.add(cls); });
                },
                remove(c) { self._classList.delete(c); },
                contains(c) { return self._classList.has(c); }
            };
        },
        get className() { return Array.from(this._classList).join(' '); },
        set className(v) {
            this._classList.clear();
            v.split(/\s+/).forEach(cls => { if(cls) this._classList.add(cls); });
        },
        _attributes: new Map(),
        setAttribute(k, v) { this._attributes.set(k, v); },
        getAttribute(k) { return this._attributes.get(k) || null; },
        removeAttribute(k) { this._attributes.delete(k); },
        childNodes: [],
        appendChild(n) {
            if (n && n.tagName === 'FRAGMENT') {
                this.childNodes.push(...n.childNodes);
                n.childNodes = [];
            } else if (n) {
                this.childNodes.push(n);
            }
            return n;
        },
        insertBefore(n, ref) {
            const i = this.childNodes.indexOf(ref);
            const nodesToAdd = (n && n.tagName === 'FRAGMENT') ? n.childNodes : [n];
            if (i === -1) this.childNodes.push(...nodesToAdd);
            else this.childNodes.splice(i, 0, ...nodesToAdd);
            if (n && n.tagName === 'FRAGMENT') n.childNodes = [];
            return n;
        },
        dataset: {},
        style: {},
        _textContent: '',
        get textContent() {
            let text = this._textContent;
            if (this.childNodes.length > 0) {
                text += this.childNodes.map(c => {
                    if (typeof c === 'string') return c;
                    if (c && typeof c.textContent === 'string') return c.textContent;
                    return '';
                }).join('');
            }
            return text;
        },
        set textContent(v) {
            this.childNodes = [];
            this._textContent = v;
        },
        cloneNode(deep) {
            const clone = createMockNode(this.tagName);
            clone.tabIndex = this.tabIndex;
            this._attributes.forEach((v, k) => clone.setAttribute(k, v));
            clone.className = this.className;
            clone.dataset = { ...this.dataset };
            if (deep) {
                clone.childNodes = this.childNodes.map(n => {
                    if (n.cloneNode) return n.cloneNode(true);
                    return n;
                });
            }
            return clone;
        },
        querySelector(sel) {
            const search = (n) => {
                if (!n) return null;
                if (sel.startsWith('.')) {
                    const cls = sel.slice(1);
                    if (n._classList && n._classList.has(cls)) return n;
                } else if (sel.startsWith('#')) {
                    const id = sel.slice(1);
                    if (n.id === id) return n;
                } else if (sel.startsWith('[role="')) {
                    const roleMatch = sel.match(/role="([^"]+)"/);
                    if (roleMatch && n.getAttribute('role') === roleMatch[1]) return n;
                } else {
                    if (n.tagName === sel.toUpperCase()) return n;
                }

                if (n.childNodes) {
                    for (let child of n.childNodes) {
                        const found = search(child);
                        if (found) return found;
                    }
                }
                return null;
            };
            return search(this);
        }
    };
    return node;
}

function createMockTextNode(text) {
    const node = {
        textContent: text,
        cloneNode: () => createMockTextNode(text)
    };
    return node;
}

global.document = {
    createElement: (tag) => createMockNode(tag),
    createTextNode: (txt) => createMockTextNode(txt),
    createDocumentFragment: () => createMockNode('fragment'),
    getElementById: (id) => {
        const node = createMockNode('div');
        node.id = id;
        node.replaceChildren = () => {};
        return node;
    },
    querySelectorAll: () => [],
    querySelector: (sel) => null
};
global.window = { self: {}, top: {} };
global.navigator = { serviceWorker: { register: () => Promise.resolve() } };
global.CSS = { escape: (s) => s };

const app = require('../public/js/app.js');

test('createStationRow comprehensive test', (t) => {
    app.initDOMElements();
    app.gameState.tier = 'Advanced';
    app.gameState.usedCounts = Object.create(null);

    const station = {
        name: 'Baker Street',
        lines: 'Bakerloo',
        colours: 'Brown',
        zone: '1',
        parsedColours: ['brown'],
        colourBadgesFragment: document.createDocumentFragment()
    };
    const badge = document.createElement('span');
    badge.className = 'colour-badge';
    station.colourBadgesFragment.appendChild(badge);

    // Unlocked
    const tr = app.createStationRow(station, 1);
    assert.strictEqual(tr.tagName, 'TR');
    assert.strictEqual(tr.classList.contains('locked'), false);

    const nameDiv = tr.querySelector('.station-name');
    assert.ok(nameDiv, 'Should find .station-name');

    const actionSpan = nameDiv.querySelector('.action-text');
    assert.ok(actionSpan, 'Should find .action-text');
    assert.strictEqual(actionSpan.textContent, 'Record use for ');

    const usesTd = tr.querySelector('.use-count');
    assert.ok(usesTd, 'Should find .use-count');
    assert.ok(usesTd.textContent.includes('0'));

    const coloursTd = tr.querySelector('.station-colours');
    assert.ok(coloursTd.querySelector('.colour-badge'), 'Should have colour badge');

    // Locked
    app.gameState.usedCounts['Baker Street'] = 1;
    const trLocked = app.createStationRow(station, 1);
    assert.strictEqual(trLocked.classList.contains('locked'), true);
    assert.strictEqual(trLocked.querySelector('.action-text').textContent, 'Station locked. Record use for ');
    assert.ok(trLocked.querySelector('.locked-icon'), 'Should have locked icon');

    // Pluralization
    app.gameState.usedCounts['Baker Street'] = 1;
    const tr1 = app.createStationRow(station, 2);
    const usesTd1 = tr1.querySelector('.use-count');
    const sr1 = usesTd1.querySelector('.sr-only');
    assert.ok(sr1, 'Should find .sr-only in .use-count');
    assert.strictEqual(sr1.textContent, ' use');
});
