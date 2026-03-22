const { performance } = require('perf_hooks');
const { JSDOM } = require('jsdom');

// Simulate basic DOM environment
const dom = new JSDOM(`<!DOCTYPE html><html><body><table id="stations-table"><tbody id="stations-body"></tbody></table></body></html>`);
const document = dom.window.document;
const stationsBody = document.getElementById('stations-body');

const displayStations = Array.from({ length: 500 }, (_, i) => ({
    name: `Station ${i}`,
    lines: 'Line A',
    colours: 'Red',
    zone: '1'
}));

const handleStationClick = () => {};

function renderTableWithIndividualListeners() {
    stationsBody.innerHTML = ''; // reset
    const fragment = document.createDocumentFragment();

    displayStations.forEach(station => {
        const tr = document.createElement('tr');

        // Simulating the work of creating elements (like the current optimized code does)
        const nameTd = document.createElement('td');
        nameTd.textContent = station.name;
        tr.appendChild(nameTd);

        // Add individual listeners
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

function renderTableWithEventDelegation() {
    stationsBody.innerHTML = ''; // reset
    const fragment = document.createDocumentFragment();

    displayStations.forEach(station => {
        const tr = document.createElement('tr');
        tr.dataset.stationName = station.name;

        // Simulating the work of creating elements
        const nameTd = document.createElement('td');
        nameTd.textContent = station.name;
        tr.appendChild(nameTd);

        fragment.appendChild(tr);
    });

    stationsBody.appendChild(fragment);
}

// Ensure delegation is set up once
stationsBody.addEventListener('click', (e) => {
    const tr = e.target.closest('tr');
    if (tr && tr.dataset.stationName) {
        handleStationClick(tr.dataset.stationName);
    }
});
stationsBody.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        const tr = e.target.closest('tr');
        if (tr && tr.dataset.stationName) {
            e.preventDefault();
            handleStationClick(tr.dataset.stationName);
        }
    }
});

// Warmup
for(let i=0; i<10; i++) {
    renderTableWithIndividualListeners();
    renderTableWithEventDelegation();
}

// Measure individual listeners
let start = performance.now();
for (let i = 0; i < 100; i++) {
    renderTableWithIndividualListeners();
}
let end = performance.now();
const timeIndividual = end - start;
console.log(`Time with individual listeners (100 runs): ${timeIndividual.toFixed(2)}ms`);

// Measure event delegation
start = performance.now();
for (let i = 0; i < 100; i++) {
    renderTableWithEventDelegation();
}
end = performance.now();
const timeDelegation = end - start;
console.log(`Time with event delegation (100 runs): ${timeDelegation.toFixed(2)}ms`);

const improvement = ((timeIndividual - timeDelegation) / timeIndividual) * 100;
console.log(`Improvement: ${improvement.toFixed(2)}%`);
