// Snooker Tubey Tracker App Logic

// DOM Elements
const tierSelect = document.getElementById('game-tier');
const searchInput = document.getElementById('search-input');
const filterBtns = document.querySelectorAll('.filter-btn');
const stationsBody = document.getElementById('stations-body');
const wildcardBtn = document.getElementById('wildcard-btn');
const resetBtn = document.getElementById('reset-btn');
const toast = document.getElementById('toast');
let toastTimeout;

// Modal Elements
const wildcardModal = document.getElementById('wildcard-modal');
const closeBtn = document.querySelector('.close-btn');
const cancelWildcardBtn = document.getElementById('cancel-wildcard-btn');
const wildcardSearch = document.getElementById('wildcard-search');
const lockedStationsList = document.getElementById('locked-stations-list');

// State
let allStations = []; // Original data from CSV
let displayStations = []; // Filtered data for display
let gameState = {
    tier: 'Advanced',
    usedCounts: {} // { "Station Name": count }
};

// Colors Mapping for Badges
const colourMap = {
    'red': 'var(--red-ball)',
    'yellow': 'var(--yellow-ball)',
    'green': 'var(--green-ball)',
    'brown': 'var(--brown-ball)',
    'blue': 'var(--blue-ball)',
    'pink': 'var(--pink-ball)',
    'black': 'var(--black-ball)'
};

// Initialization
async function init() {
    initDOMElements();
    loadGameState();

    try {
        await fetchStations();
        renderTable();
        setupEventListeners();

        // Register Service Worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(() => console.log('Service Worker registered'))
                .catch(err => console.log('Service Worker registration failed:', err));
        }
    } catch (error) {
        console.error('Error initializing app:', error);
        if (stationsBody) {
            stationsBody.innerHTML = `<tr><td colspan="5" style="color: red; text-align:center;">Failed to load station data. Are you running a local server?</td></tr>`;
        }
    }
}

// Data Fetching and Parsing
async function fetchStations() {
    const response = await fetch('../data/Snooker Tubey Database.csv');
    if (!response.ok) throw new Error('Failed to fetch CSV');

    const csvText = await response.text();
    allStations = parseCSV(csvText);
    displayStations = [...allStations];
}

function parseCSV(str) {
    const lines = str.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());

    // Find indices based on headers from user's CSV
    const nameIdx = headers.indexOf('Station Name');
    const linesIdx = headers.indexOf('Lines Served');
    const coloursIdx = headers.indexOf('Valid for Colours');
    const zoneIdx = headers.indexOf('Zone(s)');

    const stations = [];

    // Simple CSV parser handling basic commas (assuming no nested commas in this specific dataset's name/zone columns based on inspection,
    // but lines/colours might have commas inside quotes. The provided CSV doesn't seem to use quotes heavily except for header "Times Used (This Game)").
    // Let's use a slightly more robust regex parser for rows.

    for (let i = 1; i < lines.length; i++) {
        // Regex to split by comma, ignoring commas inside quotes
        const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];

        // Basic split fallback if complex regex fails or for empty columns
        let parsedCols = [];
        let inQuotes = false;
        let currentVal = '';

        for (let char of lines[i]) {
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                parsedCols.push(currentVal.trim());
                currentVal = '';
            } else {
                currentVal += char;
            }
        }
        parsedCols.push(currentVal.trim());

        if (parsedCols.length >= 4) {
            const name = parsedCols[nameIdx];
            if (!name) continue; // Skip empty rows (like second lines for interchanges in the raw CSV, though ideally we merge them)

            // Note: The raw CSV has empty names for secondary lines of interchanges (e.g., Acton Town).
            // We should merge these or handle them. Let's merge them into the previous station if name is empty.
            if (name === '') {
                if (stations.length > 0) {
                    const prev = stations[stations.length - 1];
                    if (parsedCols[linesIdx]) prev.lines += ', ' + parsedCols[linesIdx];
                    if (parsedCols[coloursIdx]) prev.colours += ', ' + parsedCols[coloursIdx];
                }
            } else {
                stations.push({
                    name: name.replace(/^"|"$/g, ''),
                    lines: parsedCols[linesIdx] ? parsedCols[linesIdx].replace(/^"|"$/g, '') : '',
                    colours: parsedCols[coloursIdx] ? parsedCols[coloursIdx].replace(/^"|"$/g, '') : '',
                    zone: parsedCols[zoneIdx] ? parsedCols[zoneIdx].replace(/^"|"$/g, '') : ''
                });
            }
        }
    }

    return stations;
}

// State Management
function loadGameState() {
    if (typeof localStorage === 'undefined') return;
    const saved = localStorage.getItem('snookerTubeyState');
    if (saved) {
        try {
            gameState = JSON.parse(saved);
            if (tierSelect) tierSelect.value = gameState.tier;
        } catch(e) {
            console.error('Failed to parse saved state');
        }
    }
}

function saveGameState() {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem('snookerTubeyState', JSON.stringify(gameState));
}

function getLockThreshold() {
    if (gameState.tier === 'Advanced') return 1;
    if (gameState.tier === 'Intermediate') return 2;
    return Infinity; // Casual
}

function isStationLocked(stationName) {
    const uses = gameState.usedCounts[stationName] || 0;
    return uses >= getLockThreshold();
}

// UI Rendering
function renderTable() {
    if (!stationsBody) return;
    stationsBody.innerHTML = '';

    if (displayStations.length === 0) {
        stationsBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No stations found.</td></tr>`;
        return;
    }

    const fragment = document.createDocumentFragment();

    displayStations.forEach(station => {
        const tr = document.createElement('tr');
        const uses = gameState.usedCounts[station.name] || 0;
        const locked = isStationLocked(station.name);

        if (locked) tr.classList.add('locked');

        // Create colour badges
        const colourBadgesContainer = document.createDocumentFragment();
        if (station.colours) {
            const coloursList = station.colours.toLowerCase().match(/(red|yellow|green|brown|blue|pink|black)/g) || [];
            // Remove duplicates
            [...new Set(coloursList)].forEach(c => {
                if (colourMap[c]) {
                    const badge = document.createElement('span');
                    badge.className = 'colour-badge';
                    badge.style.backgroundColor = colourMap[c];
                    badge.title = c;
                    colourBadgesContainer.appendChild(badge);
                }
            });
        }

        tr.tabIndex = 0;
        tr.setAttribute('role', 'button');
        tr.setAttribute('aria-label', `Record use for ${station.name}`);
        tr.dataset.stationName = station.name;

        // Create table cells safely
        const nameTd = document.createElement('td');
        const nameDiv = document.createElement('div');
        nameDiv.className = 'station-name';
        nameDiv.textContent = station.name + ' ';
        if (locked) {
            const lockedSpan = document.createElement('span');
            lockedSpan.className = 'locked-icon';
            lockedSpan.title = 'Locked';
            lockedSpan.textContent = '🔒';
            nameDiv.appendChild(lockedSpan);
        }
        nameTd.appendChild(nameDiv);

        const linesTd = document.createElement('td');
        const linesDiv = document.createElement('div');
        linesDiv.className = 'station-lines';
        linesDiv.textContent = station.lines;
        linesTd.appendChild(linesDiv);

        const coloursTd = document.createElement('td');
        coloursTd.className = 'station-colours';
        coloursTd.appendChild(colourBadgesContainer);
        const coloursSpan = document.createElement('span');
        coloursSpan.textContent = station.colours;
        coloursTd.appendChild(coloursSpan);

        const zoneTd = document.createElement('td');
        zoneTd.textContent = station.zone;

        const usesTd = document.createElement('td');
        usesTd.className = 'use-count';
        usesTd.textContent = uses;

        tr.appendChild(nameTd);
        tr.appendChild(linesTd);
        tr.appendChild(coloursTd);
        tr.appendChild(zoneTd);
        tr.appendChild(usesTd);

        fragment.appendChild(tr);
    });

    stationsBody.appendChild(fragment);
}

// Interaction Handlers
function handleStationClick(stationName) {
    const locked = isStationLocked(stationName);

    if (locked) {
        showToast(`${stationName} is already locked!`);
        return;
    }

    if (confirm(`Record use for ${stationName}?`)) {
        gameState.usedCounts[stationName] = (gameState.usedCounts[stationName] || 0) + 1;
        saveGameState();

        const nowLocked = isStationLocked(stationName);
        if (nowLocked) {
            showToast(`${stationName} used and is now LOCKED.`);
        } else {
            showToast(`${stationName} used. (${gameState.usedCounts[stationName]} times)`);
        }

        applyFilters(); // Re-render table keeping current filters
    }
}

// Filtering and Searching
function applyFilters() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeFilterBtn = document.querySelector('.filter-btn.active');
    const filterType = activeFilterBtn ? activeFilterBtn.dataset.filter : 'all';

    displayStations = allStations.filter(station => {
        // 1. Text Search
        const matchesSearch = station.name.toLowerCase().includes(query) ||
                              station.lines.toLowerCase().includes(query) ||
                              station.colours.toLowerCase().includes(query);

        if (!matchesSearch) return false;

        // 2. Status Filter
        const locked = isStationLocked(station.name);
        if (filterType === 'unlocked' && locked) return false;
        if (filterType === 'locked' && !locked) return false;

        return true;
    });

    renderTable();
}

// Wildcard Modal Logic
function openWildcardModal() {
    // Get list of currently locked stations
    const lockedStations = allStations.filter(s => isStationLocked(s.name));

    if (lockedStations.length === 0) {
        showToast("No locked stations available to unlock.");
        return;
    }

    renderWildcardList(lockedStations);
    if (wildcardSearch) wildcardSearch.value = '';
    if (wildcardModal) {
        wildcardModal.classList.remove('hidden');
        if (wildcardSearch) wildcardSearch.focus();
    }
}

function renderWildcardList(stations) {
    if (!lockedStationsList) return;
    lockedStationsList.innerHTML = '';
    stations.forEach(station => {
        const li = document.createElement('li');
        li.textContent = `${station.name} (${station.lines})`;
        li.tabIndex = 0;
        li.setAttribute('role', 'button');
        li.setAttribute('aria-label', `Unlock ${station.name}`);
        li.dataset.stationName = station.name;
        lockedStationsList.appendChild(li);
    });
}

function unlockStation(stationName) {
    if (confirm(`Use Overground Wildcard to unlock ${stationName}?`)) {
        // Reset count to 0
        gameState.usedCounts[stationName] = 0;
        saveGameState();
        showToast(`🚇 ${stationName} has been UNLOCKED via Wildcard!`);
        closeModal();
        applyFilters();
    }
}

function closeModal() {
    if (wildcardModal) {
        wildcardModal.classList.add('hidden');
        if (wildcardBtn) wildcardBtn.focus();
    }
}

// Utilities
function showToast(message) {
    clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.classList.remove('hidden');

    toastTimeout = setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

function resetGame() {
    if (confirm('Are you sure you want to reset all station usages for a new game?')) {
        gameState.usedCounts = {};
        saveGameState();
        showToast('Game has been reset!');
        applyFilters();
    }
}

// Event Listeners Setup
function setupEventListeners() {
    // Tier Selection
    if (tierSelect) {
        tierSelect.addEventListener('change', (e) => {
            gameState.tier = e.target.value;
            saveGameState();
            applyFilters(); // Re-evaluate locks based on new tier
            showToast(`Tier changed to ${e.target.value}`);
        });
    }

    // Search Input
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    // Filter Buttons
    if (filterBtns) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                e.target.classList.add('active');
                e.target.setAttribute('aria-pressed', 'true');
                applyFilters();
            });
        });
    }

    // Reset Game
    if (resetBtn) {
        resetBtn.addEventListener('click', resetGame);
    }

    // Table Row Click/Keydown (Event Delegation)
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

    // Wildcard List Click/Keydown (Event Delegation)
    lockedStationsList.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (li && li.dataset.stationName) {
            unlockStation(li.dataset.stationName);
        }
    });

    lockedStationsList.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const li = e.target.closest('li');
            if (li && li.dataset.stationName) {
                e.preventDefault();
                unlockStation(li.dataset.stationName);
            }
        }
    });

    // Wildcard
    if (wildcardBtn) wildcardBtn.addEventListener('click', openWildcardModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelWildcardBtn) cancelWildcardBtn.addEventListener('click', closeModal);

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === wildcardModal) {
            closeModal();
        }
    });

    // Wildcard search filter
    if (wildcardSearch) {
        wildcardSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const lockedStations = allStations.filter(s =>
                isStationLocked(s.name) && s.name.toLowerCase().includes(query)
            );
            renderWildcardList(lockedStations);
        });
    }

    // Escape key to close modal
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && wildcardModal && !wildcardModal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

// Boot
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    init();
}

// Exports for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        gameState,
        getLockThreshold,
        isStationLocked
    };
}
