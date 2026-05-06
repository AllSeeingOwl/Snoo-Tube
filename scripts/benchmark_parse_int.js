const iterations = 10000000;
// Create an array of strings to avoid V8 over-optimizing a single constant string
const values = Array.from({ length: 1000 }, (_, i) => String(i + 10000));

function testParseInt() {
    let result;
    console.time('parseInt');
    for (let i = 0; i < iterations; i++) {
        const val = values[i % 1000];
        result = parseInt(val, 10) > 10240;
    }
    console.timeEnd('parseInt');
    return result;
}

function testNumber() {
    let result;
    console.time('Number');
    for (let i = 0; i < iterations; i++) {
        const val = values[i % 1000];
        result = Number(val) > 10240;
    }
    console.timeEnd('Number');
    return result;
}

function testCoercion() {
    let result;
    console.time('Coercion');
    for (let i = 0; i < iterations; i++) {
        const val = values[i % 1000];
        result = +val > 10240;
    }
    console.timeEnd('Coercion');
    return result;
}

// Warmup
for (let i = 0; i < 1000000; i++) {
    const val = values[i % 1000];
    parseInt(val, 10);
    Number(val);
    +val;
}

testParseInt();
testNumber();
testCoercion();
