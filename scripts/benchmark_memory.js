const { JSDOM } = require('jsdom');

function measureMemory(runFn) {
    global.gc();
    const startMemory = process.memoryUsage().heapUsed;
    runFn();
    const endMemory = process.memoryUsage().heapUsed;
    return endMemory - startMemory;
}

const dom = new JSDOM(`<!DOCTYPE html><html><body><table id="stations-table"><tbody id="stations-body"></tbody></table></body></html>`);
const document = dom.window.document;

function createStations(count) {
    return Array.from({ length: count }, (_, i) => ({
        name: `Station ${i}`,
        lines: 'Line A',
        colours: 'Red',
        zone: '1'
    }));
}

// Emulate around 1000 stations, like the real CSV.
const displayStations = createStations(1000);
const handleStationClick = () => {};

// Before optimization: Individual listeners
function renderWithIndividual() {
    const stationsBody = document.getElementById('stations-body');
    stationsBody.innerHTML = '';
    const fragment = document.createDocumentFragment();

    displayStations.forEach(station => {
        const tr = document.createElement('tr');
        const nameTd = document.createElement('td');
        nameTd.textContent = station.name;
        tr.appendChild(nameTd);

        tr.addEventListener('click', () => handleStationClick(station.name));
        tr.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleStationClick(station.name);
            }
        });
        fragment.appendChild(tr);
    });
    stationsBody.appendChild(fragment);
}

// Optimized: Event delegation
function renderWithDelegation() {
    const stationsBody = document.getElementById('stations-body');
    stationsBody.innerHTML = '';
    const fragment = document.createDocumentFragment();

    displayStations.forEach(station => {
        const tr = document.createElement('tr');
        tr.dataset.stationName = station.name;
        const nameTd = document.createElement('td');
        nameTd.textContent = station.name;
        tr.appendChild(nameTd);
        fragment.appendChild(tr);
    });
    stationsBody.appendChild(fragment);
}

// Warmup
for (let i = 0; i < 5; i++) {
    renderWithIndividual();
    renderWithDelegation();
}

console.log("Measuring memory allocation over 10 renders (1000 stations each)...");

const memIndividual = measureMemory(() => {
    for (let i = 0; i < 10; i++) renderWithIndividual();
});

const memDelegation = measureMemory(() => {
    for (let i = 0; i < 10; i++) renderWithDelegation();
});

console.log(`Memory Used (Individual Listeners): ${(memIndividual / 1024 / 1024).toFixed(2)} MB`);
console.log(`Memory Used (Event Delegation): ${(memDelegation / 1024 / 1024).toFixed(2)} MB`);
console.log(`Memory Savings: ${((memIndividual - memDelegation) / memIndividual * 100).toFixed(2)}%`);
