const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const swCode = fs.readFileSync(path.join(__dirname, '../public/sw.js'), 'utf8');

test('Service Worker should NOT cache responses with Cache-Control: no-store', async (t) => {
    const handlers = {};
    const cacheStore = new Map();
    const mockCache = {
        put: (request, response) => {
            cacheStore.set(request.url || request, response);
            return Promise.resolve();
        }
    };

    // Mocking the environment
    const selfMock = {
        addEventListener: (type, handler) => {
            handlers[type] = handler;
        },
        skipWaiting: () => {},
        clients: {
            claim: () => {}
        }
    };

    const cachesMock = {
        open: () => Promise.resolve(mockCache),
        match: () => Promise.resolve(null),
        keys: () => Promise.resolve([])
    };

    // Helper to create a response with a custom type property (as browser Responses have)
    function createMockResponse(body, init, type = 'basic') {
        const resp = new Response(body, init);
        Object.defineProperty(resp, 'type', { value: type });
        return resp;
    }

    const fetchMock = async (request) => {
        return createMockResponse('sensitive data', {
            status: 200,
            headers: {
                'Cache-Control': 'NO-STORE'
            }
        });
    };

    const context = {
        self: selfMock,
        addEventListener: selfMock.addEventListener.bind(selfMock),
        caches: cachesMock,
        fetch: fetchMock,
        URL: global.URL,
        Request: global.Request,
        Response: global.Response,
        console: {
            log: () => {},
            warn: () => {},
            error: () => {}
        },
        Promise: global.Promise
    };

    // Execute SW code
    // Use a wrapper to avoid re-declaration errors if CACHE_NAME is already in scope
    // though here it shouldn't be unless we pass it in.
    // The error was "Identifier 'CACHE_NAME' has already been declared"
    // probably because I was passing CACHE_NAME in context AND it's defined with 'const' in swCode.
    const script = new Function(...Object.keys(context), swCode);
    script(...Object.values(context));

    const fetchHandler = handlers['fetch'];
    assert.ok(fetchHandler, 'Fetch handler should be registered');

    const mockEvent = {
        request: new Request('http://localhost:3000/api/sensitive-data'),
        respondWith: (promise) => {
            mockEvent.responsePromise = promise;
        }
    };

    fetchHandler(mockEvent);
    const response = await mockEvent.responsePromise;
    assert.strictEqual(await response.text(), 'sensitive data');

    // Wait a bit for cache.put which is called after return in the SW
    await new Promise(resolve => setTimeout(resolve, 100));

    // This test is expected to FAIL before the fix because sw.js doesn't check for no-store
    assert.strictEqual(cacheStore.size, 0, 'Should NOT have cached response with Cache-Control: no-store');
});
