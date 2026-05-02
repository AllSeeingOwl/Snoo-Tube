const fs = require('fs');

const rawCsv = fs.readFileSync('/tmp/ny_subway.csv', 'utf-8');
const lines = rawCsv.split('\n');

const stationLines = {};
const stationBoroughs = {};

for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parser ignoring quotes for now (doesn't contain comma inside quotes for this data)
    let parts = line.split(',');

    // Sometimes there are commas in complex ids, etc. We use a proper regex or simpler approach.
    // Given the sample, Stop Name is col 5, Daytime Routes is col 8, Borough is col 6.

    // A better approach is to use a basic CSV parser.
    const row = [];
    let cur = '';
    let inQuote = false;
    for (let char of line) {
        if (char === '"') inQuote = !inQuote;
        else if (char === ',' && !inQuote) {
            row.push(cur);
            cur = '';
        } else {
            cur += char;
        }
    }
    row.push(cur);

    if (row.length < 9) continue;

    let name = row[5].trim();
    const boroughCode = row[6].trim();
    const routesStr = row[8].trim();

    // Ignore empty stop names
    if (!name) continue;

    // Map borough codes
    let borough = '';
    if (boroughCode === 'M') borough = 'Manhattan';
    else if (boroughCode === 'Bx') borough = 'Bronx';
    else if (boroughCode === 'Bk') borough = 'Brooklyn';
    else if (boroughCode === 'Q') borough = 'Queens';
    else if (boroughCode === 'SI') borough = 'Staten Island';
    else borough = boroughCode;

    if (!stationLines[name]) stationLines[name] = new Set();
    if (!stationBoroughs[name]) stationBoroughs[name] = borough;

    const routes = routesStr.split(' ').filter(r => r);
    for (const r of routes) {
        stationLines[name].add(r);
    }
}

// Colors mapping rule:
// Yellow (N, Q, R, W) -> Solid: N, Q | Stripe: R, W
// Blue (A, C, E) -> Solid: A | Stripe: C, E
// Red (1, 2, 3) -> Solid: 1, 2 | Stripe: 3
// Dark Green (4, 5, 6) -> Solid: 4 | Stripe: 5, 6
// Orange (B, D, F, M) -> Solid: B, D | Stripe: F, M
// Brown (J, Z) -> Solid: J | Stripe: Z
// Purple (7) -> Solid: 7 | Stripe: 7
// Black (L, G) -> Solid/Stripe: L, G
// Wildcard -> SIR, S

const colorRules = {
    'Yellow (Solid)': ['N', 'Q'],
    'Yellow (Stripe)': ['R', 'W'],
    'Blue (Solid)': ['A'],
    'Blue (Stripe)': ['C', 'E'],
    'Red (Solid)': ['1', '2'],
    'Red (Stripe)': ['3'],
    'Green (Solid)': ['4'],
    'Green (Stripe)': ['5', '6'],
    'Orange (Solid)': ['B', 'D'],
    'Orange (Stripe)': ['F', 'M'],
    'Brown (Solid)': ['J'],
    'Brown (Stripe)': ['Z'],
    'Purple (Solid)': ['7'],
    'Purple (Stripe)': ['7'],
    'Black': ['L', 'G'],
    'Wildcard': ['SIR', 'S']
};

const outputLines = [];
outputLines.push('Station Name,Lines Served,Valid for Colours,Borough');

for (const name in stationLines) {
    const lines = Array.from(stationLines[name]).sort();

    const validColours = new Set();

    for (const line of lines) {
        for (const [colorStr, targets] of Object.entries(colorRules)) {
            if (targets.includes(line)) {
                validColours.add(colorStr);
            }
        }
    }

    // Sort lines and colours
    const linesStr = lines.join(', ');
    const coloursStr = Array.from(validColours).sort().join(', ');
    const borough = stationBoroughs[name];

    // Escape strings
    const escName = name.includes(',') ? `"${name}"` : name;
    const escLines = linesStr.includes(',') ? `"${linesStr}"` : linesStr;
    const escColours = coloursStr.includes(',') ? `"${coloursStr}"` : coloursStr;
    const escBorough = borough.includes(',') ? `"${borough}"` : borough;

    outputLines.push(`${escName},${escLines},${escColours},${escBorough}`);
}

// Sort alphabetically by station name
const header = outputLines.shift();
outputLines.sort();
outputLines.unshift(header);

fs.writeFileSync('pool/data/Pool_Subway_Database.csv', outputLines.join('\n'));
console.log('Database generated.');
