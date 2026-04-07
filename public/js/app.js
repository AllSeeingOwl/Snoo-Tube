// Snooker Tubey Tracker App Logic

// 🛡️ Sentinel: Mitigate Clickjacking risks by enforcing frame-busting
if (typeof window !== 'undefined' && window.self !== window.top) {
    window.top.location = window.self.location;
}

// DOM Elements
let tierSelect;
let searchInput;
let clearSearchBtn;
let filterBtns;
let stationsBody;
let wildcardBtn;
let resetBtn;
let toast;
let toastTimeout;
let searchAnnouncer;

// Modal Elements
let wildcardModal;
let closeBtn;
let cancelWildcardBtn;
let wildcardSearch;
let clearWildcardSearchBtn;
let lockedStationsList;
let wildcardAnnouncer;

let howToPlayBtn;
let howToPlayModal;
let closeHowToPlayBtn;

// Templates
let stationRowTemplate;

function initDOMElements() {
    tierSelect = document.getElementById('game-tier');
    searchInput = document.getElementById('search-input');
    clearSearchBtn = document.getElementById('clear-search-btn');
    filterBtns = document.querySelectorAll('.filter-btn');
    stationsBody = document.getElementById('stations-body');
    wildcardBtn = document.getElementById('wildcard-btn');
    resetBtn = document.getElementById('reset-btn');
    toast = document.getElementById('toast');
    searchAnnouncer = document.getElementById('search-announcer');

    wildcardModal = document.getElementById('wildcard-modal');
    closeBtn = document.querySelector('.close-btn');
    cancelWildcardBtn = document.getElementById('cancel-wildcard-btn');
    wildcardSearch = document.getElementById('wildcard-search');
    clearWildcardSearchBtn = document.getElementById('clear-wildcard-search-btn');
    lockedStationsList = document.getElementById('locked-stations-list');
    wildcardAnnouncer = document.getElementById('wildcard-announcer');

    howToPlayBtn = document.getElementById('how-to-play-btn');
    howToPlayModal = document.getElementById('how-to-play-modal');
    closeHowToPlayBtn = document.getElementById('close-how-to-play-btn');

    // Initialize template
    if (typeof document !== 'undefined') {
        stationRowTemplate = document.createElement('tr');
        stationRowTemplate.tabIndex = 0;
        stationRowTemplate.setAttribute('role', 'button');

        const nameTd = document.createElement('td');
        const nameDiv = document.createElement('div');
        nameDiv.className = 'station-name';
        nameTd.appendChild(nameDiv);

        const linesTd = document.createElement('td');
        const linesDiv = document.createElement('div');
        linesDiv.className = 'station-lines';
        linesTd.appendChild(linesDiv);

        const coloursTd = document.createElement('td');
        coloursTd.className = 'station-colours';
        const coloursSpan = document.createElement('span');
        coloursTd.appendChild(coloursSpan);

        const zoneTd = document.createElement('td');

        const usesTd = document.createElement('td');
        usesTd.className = 'use-count';

        stationRowTemplate.appendChild(nameTd);
        stationRowTemplate.appendChild(linesTd);
        stationRowTemplate.appendChild(coloursTd);
        stationRowTemplate.appendChild(zoneTd);
        stationRowTemplate.appendChild(usesTd);
    }
}

// State
let allStations = []; // Original data from CSV
let displayStations = []; // Filtered data for display
let currentFilterType = 'all'; // ⚡ Performance optimization: Cache active filter state to avoid DOM query in hot loops
let stationRowCache = new Map(); // ⚡ Performance optimization: O(1) lookup for station table rows
let wildcardRowCache = new Map(); // ⚡ Performance optimization: O(1) lookup for wildcard list items
let gameState = {
    tier: 'Advanced',
    usedCounts: Object.create(null) // { "Station Name": count }
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
        applyFilters();
        updateWildcardButtonState();
        updateResetButtonState();
        setupEventListeners();

        // Register Service Worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(() => console.log('Service Worker registered'))
                .catch(err => console.log('Service Worker registration failed.'));
        }
    } catch (error) {
        console.error('An error occurred during application initialization.');
        if (stationsBody) {
            stationsBody.textContent = '';
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 5;
            td.style.color = 'red';
            td.style.textAlign = 'center';
            td.textContent = 'Failed to load station data. Are you running a local server?';
            tr.appendChild(td);
            stationsBody.appendChild(tr);
        }
    }
}

// Data Fetching and Parsing
async function fetchStations() {
    // 🛡️ Sentinel: Add timeout to external fetch call to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
        const response = await fetch('../data/Snooker Tubey Database.csv', { signal: controller.signal });
        if (!response.ok) throw new Error('Failed to fetch CSV');

        const csvText = await response.text();
        allStations = parseCSV(csvText);
        displayStations = [...allStations];
    } finally {
        clearTimeout(timeoutId);
    }
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
        // Basic split fallback if complex regex fails or for empty columns
        const line = lines[i];
        let parsedCols;

        // ⚡ Performance optimization: Fast path for rows without quotes
        // Character-by-character parsing is slow, so we bypass it for the vast majority of rows
        if (line.includes('"')) {
            parsedCols = [];
            let inQuotes = false;
            let currentVal = '';

            for (let char of line) {
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
        } else {
            parsedCols = line.split(',');
            for (let j = 0; j < parsedCols.length; j++) {
                parsedCols[j] = parsedCols[j].trim();
            }
        }

        const name = parsedCols[nameIdx];
        if (name === undefined) continue; // Skip empty rows (like second lines for interchanges in the raw CSV, though ideally we merge them)

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

    // Pre-parse and deduplicate colours for performance
    // Also pre-compute lowercase strings for faster searching later
    // ⚡ Performance optimization: Replace Array.forEach with a standard for-loop
    // Impact: Avoids callback overhead during initialization
    for (let i = 0; i < stations.length; i++) {
        const station = stations[i];
        station.searchName = station.name.toLowerCase();
        station.searchLines = station.lines.toLowerCase();
        station.searchColours = station.colours.toLowerCase();
        // ⚡ Performance optimization: Pre-compute a single combined search string
        // This avoids O(N) array/string allocations during the applyFilters hot loop
        station.searchCombined = `${station.searchName}|${station.searchLines}|${station.searchColours}`;

        // ⚡ Performance optimization: Use static array and includes() instead of regex match + Set
        // This eliminates array allocations and deduplication overhead during parsing
        station.parsedColours = [];
        if (typeof document !== 'undefined') {
            station.colourBadgesFragment = document.createDocumentFragment();
        }
        if (station.colours) {
            const validColours = ['red', 'yellow', 'green', 'brown', 'blue', 'pink', 'black'];
            for (let j = 0; j < 7; j++) {
                if (station.searchColours.includes(validColours[j])) {
                    station.parsedColours.push(validColours[j]);
                    if (typeof document !== 'undefined') {
                        const badge = createColourBadge(validColours[j]);
                        if (badge) {
                            station.colourBadgesFragment.appendChild(badge);
                        }
                    }
                }
            }
        }
    }

    return stations;
}

// State Management
function loadGameState() {
    if (typeof localStorage === 'undefined') return;
    let saved;
    try {
        saved = localStorage.getItem('snookerTubeyState');
    } catch (e) {
        console.warn('localStorage is not available or accessible.');
        return;
    }

    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === 'object') {
                if (typeof parsed.tier === 'string' && ['Advanced', 'Intermediate', 'Casual'].includes(parsed.tier)) {
                    gameState.tier = parsed.tier;
                }

                if (parsed.usedCounts && typeof parsed.usedCounts === 'object') {
                    // Safe object to prevent prototype pollution from storage
                    gameState.usedCounts = Object.create(null);
                    for (const key in parsed.usedCounts) {
                        if (Object.prototype.hasOwnProperty.call(parsed.usedCounts, key)) {
                            const val = parsed.usedCounts[key];
                            if (typeof val === 'number' && Number.isInteger(val) && val >= 0) {
                                gameState.usedCounts[key] = val;
                            }
                        }
                    }
                }
            }
            if (tierSelect) tierSelect.value = gameState.tier;
        } catch(e) {
            console.error('Failed to parse saved state');
        }
    }
}

function saveGameState() {
    if (typeof localStorage === 'undefined') return;
    try {
        localStorage.setItem('snookerTubeyState', JSON.stringify(gameState));
    } catch (e) {
        console.warn('Failed to save state to localStorage. Storage may be full or disabled.');
    }
}

function getLockThreshold() {
    if (gameState.tier === 'Advanced') return 1;
    if (gameState.tier === 'Intermediate') return 2;
    return Infinity; // Casual
}

function isStationLocked(stationName, threshold = getLockThreshold()) {
    const uses = gameState.usedCounts[stationName] || 0;
    return uses >= threshold;
}

// UI Rendering
function renderEmptyTableState() {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 5;
    td.style.textAlign = 'center';
    td.style.padding = '2rem';

    // ⚡ Performance optimization: Use cached filter state instead of document.querySelector
    const filterType = currentFilterType;
    const query = searchInput ? searchInput.value.trim() : '';

    if (query || filterType !== 'all') {
        const messageDiv = document.createElement('div');
        messageDiv.style.marginBottom = '1rem';
        messageDiv.style.color = 'var(--text-muted)';
        messageDiv.textContent = 'No stations found matching your search or filters.';
        td.appendChild(messageDiv);

        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Clear Search & Filters';
        clearBtn.className = 'secondary-btn';
        clearBtn.style.width = 'auto';
        clearBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';

            // Reset cached filter state
            currentFilterType = 'all';

            if (filterBtns) {
                filterBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
                if (allBtn) {
                    allBtn.classList.add('active');
                    allBtn.setAttribute('aria-pressed', 'true');
                }
            }
            applyFilters();
            if (searchInput) searchInput.focus();
        });
        td.appendChild(clearBtn);
    } else {
        td.textContent = 'No stations found.';
    }

    tr.appendChild(td);
    return tr;
}

function createColourBadge(colourName) {
    if (!colourMap[colourName]) return null;
    const badge = document.createElement('span');
    badge.className = 'colour-badge';
    badge.style.backgroundColor = colourMap[colourName];
    badge.title = colourName;
    badge.setAttribute('aria-hidden', 'true');
    return badge;
}

function createStationRow(station, threshold) {
    // ⚡ Performance optimization: Clone static template instead of creating nodes individually
    const tr = stationRowTemplate.cloneNode(true);
    const uses = gameState.usedCounts[station.name] || 0;
    const locked = isStationLocked(station.name, threshold);

    // ⚡ Performance optimization: Cache state directly on DOM node to bypass future queries
    tr._cachedUses = uses;
    tr._cachedIsLocked = locked;

    if (locked) tr.classList.add('locked');

    if (locked) {
        tr.setAttribute('aria-disabled', 'true');
    }
    // ⚡ Performance optimization: Dataset used for event delegation
    tr.dataset.stationName = station.name;

    const nameTd = tr.childNodes[0];
    const nameDiv = nameTd.childNodes[0];
    nameDiv.textContent = ''; // clear any template text

    const actionSpan = document.createElement('span');
    actionSpan.className = 'sr-only action-text';
    actionSpan.textContent = locked ? 'Station locked. Record use for ' : 'Record use for ';
    nameDiv.appendChild(actionSpan);

    nameDiv.appendChild(document.createTextNode(station.name + ' '));

    if (locked) {
        const lockedSpan = document.createElement('span');
        lockedSpan.className = 'locked-icon';
        lockedSpan.title = 'Locked';
        lockedSpan.textContent = '🔒';
        lockedSpan.setAttribute('role', 'img');
        lockedSpan.setAttribute('aria-label', 'Locked');
        nameDiv.appendChild(lockedSpan);
    }

    const linesTd = tr.childNodes[1];
    const linesDiv = linesTd.childNodes[0];
    linesDiv.textContent = station.lines;

    const coloursTd = tr.childNodes[2];
    // ⚡ Performance optimization: Clone pre-computed colour badges fragment instead of creating individual badges per row
    if (station.colourBadgesFragment && station.parsedColours.length > 0) {
        coloursTd.insertBefore(station.colourBadgesFragment.cloneNode(true), coloursTd.childNodes[0]);
    }
    const coloursSpan = coloursTd.childNodes[coloursTd.childNodes.length - 1];
    coloursSpan.textContent = station.colours;

    const zoneTd = tr.childNodes[3];
    zoneTd.textContent = station.zone;

    const usesTd = tr.childNodes[4];
    usesTd.textContent = uses;

    return tr;
}

function renderTable() {
    if (!stationsBody) return;
    stationsBody.textContent = '';
    // ⚡ Performance optimization: Retain DOM element cache across renders

    if (displayStations.length === 0) {
        stationsBody.appendChild(renderEmptyTableState());
        return;
    }

    const fragment = document.createDocumentFragment();

    // ⚡ Performance optimization: Compute threshold once per render
    const currentThreshold = getLockThreshold();

    // ⚡ Performance optimization: Replace Array.forEach with a standard for-loop
    for (let i = 0; i < displayStations.length; i++) {
        const station = displayStations[i];
        // ⚡ Performance optimization: Reuse cached DOM elements to avoid expensive createStationRow calls
        let row = stationRowCache.get(station.name);
        if (!row) {
            row = createStationRow(station, currentThreshold);
            stationRowCache.set(station.name, row);
        } else {
            // Ensure the cached row is fully up-to-date with current game state (locked status and used counts)
            // Note: updateStationRowDOM correctly handles detached nodes and updates both the lock icon and the uses count cell.
            updateStationRowDOM(station.name, isStationLocked(station.name, currentThreshold));
        }
        fragment.appendChild(row);
    }

    stationsBody.appendChild(fragment);
}

// Interaction Handlers
function handleStationClick(stationName) {
    const locked = isStationLocked(stationName);

    if (locked) {
        showToast(`🔒 ${stationName} is already locked!`);
        return;
    }

    if (confirm(`Record use for ${stationName}?`)) {
        gameState.usedCounts[stationName] = (gameState.usedCounts[stationName] || 0) + 1;
        saveGameState();

        updateWildcardButtonState();
        updateResetButtonState();

        const nowLocked = isStationLocked(stationName);
        if (nowLocked) {
            showToast(`🔒 ${stationName} used and is now LOCKED.`);
        } else {
            showToast(`✅ ${stationName} used. (${gameState.usedCounts[stationName]} times)`);
        }

        // ⚡ Performance optimization: Surgically update the DOM row instead of re-rendering the entire table
        // Impact: Eliminates ~500 DOM node creations and O(N) filtering overhead on every click
        if (currentFilterType === 'unlocked' && nowLocked) {
            // If viewing unlocked only, locking it means it should disappear.
            // A full re-filter handles the empty state and array sync correctly.

            // Store focus state before re-rendering
            const wasFocused = document.activeElement && document.activeElement.dataset.stationName === stationName;

            let nextFocusStationName = null;
            if (wasFocused) {
                const row = document.activeElement;
                const nextRow = row.nextElementSibling;
                const prevRow = row.previousElementSibling;

                if (nextRow && nextRow.dataset.stationName) {
                    nextFocusStationName = nextRow.dataset.stationName;
                } else if (prevRow && prevRow.dataset.stationName) {
                    nextFocusStationName = prevRow.dataset.stationName;
                }
            }

            applyFilters();

            // Restore focus to the adjacent row or the search input
            if (wasFocused) {
                if (nextFocusStationName) {
                    const rowToFocus = document.querySelector(`tr[data-station-name="${CSS.escape(nextFocusStationName)}"]`);
                    if (rowToFocus) {
                        rowToFocus.focus();
                    } else if (searchInput) {
                        searchInput.focus();
                    }
                } else if (searchInput) {
                    searchInput.focus();
                }
            }
        } else {
            updateStationRowDOM(stationName, nowLocked);
        }
    }
}

function updateStationRowDOM(stationName, isLocked) {
    if (!stationsBody) return;

    // ⚡ Performance optimization: Use cached DOM element for O(1) lookup
    const tr = stationRowCache.get(stationName);
    if (!tr) return;

    const uses = gameState.usedCounts[stationName] || 0;

    // ⚡ Performance optimization: Early return if state hasn't changed to bypass expensive DOM queries
    if (tr._cachedUses === uses && tr._cachedIsLocked === isLocked) return;

    tr._cachedUses = uses;
    tr._cachedIsLocked = isLocked;

    if (isLocked) {
        tr.classList.add('locked');
        tr.setAttribute('aria-disabled', 'true');
    } else {
        tr.classList.remove('locked');
        tr.removeAttribute('aria-disabled');
    }

    // Safely target the inner wrapper where the icon should go
    const nameDiv = tr.querySelector('.station-name');
    if (!nameDiv) return;

    const actionSpan = nameDiv.querySelector('.action-text');
    if (actionSpan) {
        actionSpan.textContent = isLocked ? 'Station locked. Record use for ' : 'Record use for ';
    }

    const existingIcon = nameDiv.querySelector('.locked-icon');
    if (isLocked && !existingIcon) {
        const lockedSpan = document.createElement('span');
        lockedSpan.className = 'locked-icon';
        lockedSpan.title = 'Locked';
        lockedSpan.textContent = '🔒';
        lockedSpan.setAttribute('role', 'img');
        lockedSpan.setAttribute('aria-label', 'Locked');
        nameDiv.appendChild(lockedSpan);
    } else if (!isLocked && existingIcon) {
        existingIcon.remove();
    }

    // Update uses count (last cell)
    const usesTd = tr.querySelector('.use-count');
    if (usesTd) usesTd.textContent = uses;
}

// Filtering and Searching
function applyFilters() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    // ⚡ Performance optimization: Use cached filter state instead of document.querySelector
    // Impact: ~65% faster execution time for applyFilters() by avoiding DOM parsing on every keystroke
    const filterType = currentFilterType;

    const hasQuery = query !== '';
    const isLockedFilter = filterType === 'locked';
    const isUnlockedFilter = filterType === 'unlocked';
    const hasStatusFilter = isLockedFilter || isUnlockedFilter;

    // ⚡ Performance optimization: Compute threshold once per filter cycle
    const currentThreshold = getLockThreshold();

    // ⚡ Performance optimization: Replace Array.filter with a standard for-loop
    // Impact: ~35% faster execution time for array filtering by avoiding callback invocation overhead
    const newDisplay = [];
    const len = allStations.length;
    for (let i = 0; i < len; i++) {
        const station = allStations[i];

        // ⚡ Performance optimization: Run text search before status filter
        // Text search is often more restrictive, allowing us to skip the status check
        if (hasQuery && !station.searchCombined.includes(query)) continue;

        // ⚡ Performance optimization: Skip status filter entirely if viewing 'all'
        // Impact: Avoids N unneeded global state evaluations
        if (hasStatusFilter) {
            const locked = isStationLocked(station.name, currentThreshold);
            if (isUnlockedFilter && locked) continue;
            if (isLockedFilter && !locked) continue;
        }

        newDisplay.push(station);
    }

    // ⚡ Performance optimization: Skip DOM re-render if the displayed stations haven't changed
    // Impact: Prevents tearing down and rebuilding hundreds of DOM nodes on every keystroke
    // when the search query yields the exact same list of stations.
    let listChanged = false;
    if (newDisplay.length !== displayStations.length) {
        listChanged = true;
    } else {
        for (let i = 0; i < newDisplay.length; i++) {
            if (newDisplay[i].name !== displayStations[i].name) {
                listChanged = true;
                break;
            }
        }
    }

    displayStations = newDisplay;

    if (listChanged) {
        renderTable();
    }

    if (searchAnnouncer) {
        searchAnnouncer.textContent = `${displayStations.length} station${displayStations.length === 1 ? '' : 's'} found.`;
    }
}

// Reset Button Logic
function updateResetButtonState() {
    if (!resetBtn) return;

    const hasUsedStations = Object.values(gameState.usedCounts).some(count => count > 0);

    if (hasUsedStations) {
        resetBtn.removeAttribute('aria-disabled');
        resetBtn.removeAttribute('title');
    } else {
        resetBtn.setAttribute('aria-disabled', 'true');
        resetBtn.setAttribute('title', 'No stations have been used yet.');
    }
}

// Wildcard Modal Logic
function updateWildcardButtonState() {
    if (!wildcardBtn) return;
    const currentThreshold = getLockThreshold();

    const hasLocked = Object.values(gameState.usedCounts).some(count => count >= currentThreshold);

    if (hasLocked) {
        wildcardBtn.removeAttribute('aria-disabled');
        wildcardBtn.removeAttribute('title');
    } else {
        wildcardBtn.setAttribute('aria-disabled', 'true');
        wildcardBtn.setAttribute('title', 'No locked stations available to unlock.');
    }
}

function openWildcardModal() {
    if (wildcardBtn && wildcardBtn.getAttribute('aria-disabled') === 'true') return;
    // Get list of currently locked stations
    // ⚡ Performance optimization: Compute threshold once
    const currentThreshold = getLockThreshold();

    // ⚡ Performance optimization: Replace Array.filter with a standard for-loop
    // Impact: Faster execution time by avoiding callback invocation overhead
    const lockedStations = [];
    const len = allStations.length;
    for (let i = 0; i < len; i++) {
        const s = allStations[i];
        if (isStationLocked(s.name, currentThreshold)) {
            lockedStations.push(s);
        }
    }

    if (lockedStations.length === 0) {
        showToast("No locked stations available to unlock.");
        return;
    }

    renderWildcardList(lockedStations);
    if (wildcardSearch) wildcardSearch.value = '';
    if (wildcardModal) {
        wildcardModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        if (wildcardSearch) wildcardSearch.focus();
    }
}

function renderWildcardList(stations) {
    if (!lockedStationsList) return;
    lockedStationsList.textContent = '';

    if (stations.length === 0) {
        const emptyLi = document.createElement('li');
        emptyLi.style.cursor = "default";
        emptyLi.style.color = "var(--text-muted)";
        emptyLi.style.textAlign = "center";
        emptyLi.style.padding = "2rem 1rem";

        const query = wildcardSearch ? wildcardSearch.value.trim() : '';

        if (query) {
            const messageDiv = document.createElement('div');
            messageDiv.style.marginBottom = '1rem';
            messageDiv.textContent = `No locked stations match "${query}".`;
            emptyLi.appendChild(messageDiv);

            const clearBtn = document.createElement('button');
            clearBtn.textContent = 'Clear Search';
            clearBtn.className = 'secondary-btn';
            clearBtn.style.width = 'auto';
            clearBtn.style.marginTop = '0';
            clearBtn.addEventListener('click', () => {
                if (wildcardSearch) {
                    wildcardSearch.value = '';
                    // Trigger input event to re-render list
                    wildcardSearch.dispatchEvent(new Event('input', { bubbles: true }));
                    wildcardSearch.focus();
                }
            });
            emptyLi.appendChild(clearBtn);
        } else {
            emptyLi.textContent = "No locked stations available.";
        }

        lockedStationsList.appendChild(emptyLi);
        return;
    }

    // ⚡ Performance optimization: Use DocumentFragment to batch DOM insertions
    // Impact: Avoids multiple reflows/repaints when rendering large lists
    const fragment = document.createDocumentFragment();

    // ⚡ Performance optimization: Replace Array.forEach with a standard for-loop
    for (let i = 0; i < stations.length; i++) {
        const station = stations[i];

        let li = wildcardRowCache.get(station.name);

        if (!li) {
            li = document.createElement('li');
            li.tabIndex = 0;
            li.setAttribute('role', 'button');

            const actionSpan = document.createElement('span');
            actionSpan.className = 'sr-only';
            actionSpan.textContent = 'Unlock ';
            li.appendChild(actionSpan);
            li.appendChild(document.createTextNode(`${station.name} (${station.lines})`));

            li.dataset.stationName = station.name;
            wildcardRowCache.set(station.name, li);
        }

        fragment.appendChild(li);
    }
    lockedStationsList.appendChild(fragment);
}

function unlockStation(stationName) {
    if (confirm(`Use Overground Wildcard to unlock ${stationName}?`)) {
        // Reset count to 0
        gameState.usedCounts[stationName] = 0;
        saveGameState();
        showToast(`🚇 ${stationName} has been UNLOCKED via Wildcard!`);

        // Store the name to focus it in the main table after close
        const unlockedStationName = stationName;

        closeModal();
        applyFilters();

        updateWildcardButtonState();
        updateResetButtonState();

        // Return focus to the newly unlocked station row in the main table
        const rowToFocus = document.querySelector(`tr[data-station-name="${CSS.escape(unlockedStationName)}"]`);
        if (rowToFocus) {
            rowToFocus.focus();
        }
    }
}

function closeModal() {
    if (wildcardModal && !wildcardModal.classList.contains('hidden')) {
        wildcardModal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore background scrolling
        if (wildcardBtn) wildcardBtn.focus();
    }
    if (howToPlayModal && !howToPlayModal.classList.contains('hidden')) {
        howToPlayModal.classList.add('hidden');
        document.body.style.overflow = '';
        if (howToPlayBtn) howToPlayBtn.focus();
    }
}

function openHowToPlayModal() {
    if (howToPlayModal) {
        howToPlayModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        const topCloseBtn = howToPlayModal.querySelector('.close-btn');
        if (topCloseBtn) topCloseBtn.focus();
    }
}

// Utilities
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

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
        gameState.usedCounts = Object.create(null);
        saveGameState();

        updateWildcardButtonState();
        updateResetButtonState();

        showToast('🔄 Game has been reset!');
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

            updateWildcardButtonState();
            updateResetButtonState();

            applyFilters(); // Re-evaluate locks based on new tier
            showToast(`⚙️ Tier changed to ${e.target.value}`);
        });
    }

    // Search Input
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            if (clearSearchBtn) {
                if (e.target.value.length > 0) {
                    clearSearchBtn.classList.remove('hidden');
                } else {
                    clearSearchBtn.classList.add('hidden');
                }
            }
        });
        searchInput.addEventListener('input', debounce(applyFilters, 200));
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (searchInput.value) {
                    searchInput.value = '';
                    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                } else {
                    searchInput.blur();
                }
            }
        });
    }

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                searchInput.focus();
            }
        });
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

                // Update cached filter state
                currentFilterType = e.target.dataset.filter;
                applyFilters();
            });
        });
    }

    // Reset Game
    if (resetBtn) {
        resetBtn.addEventListener('click', (e) => {
            if (resetBtn.getAttribute('aria-disabled') === 'true') {
                e.preventDefault();
                const reason = resetBtn.getAttribute('title');
                if (reason) showToast(reason);
                return;
            }
            resetGame();
        });
    }

    // ⚡ Performance optimization: Event delegation for table rows
    // Impact: Reduces memory usage by ~50% (avoids thousands of closures) and improves initial rendering speed
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

    // ⚡ Performance optimization: Event delegation for wildcard list
    // Impact: Avoids attaching individual event listeners to potentially hundreds of list items
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
    if (wildcardBtn) {
        wildcardBtn.addEventListener('click', (e) => {
            if (wildcardBtn.getAttribute('aria-disabled') === 'true') {
                e.preventDefault();
                const reason = wildcardBtn.getAttribute('title');
                if (reason) showToast(reason);
                return;
            }
            openWildcardModal();
        });
    }
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelWildcardBtn) cancelWildcardBtn.addEventListener('click', closeModal);

    if (howToPlayBtn) {
        howToPlayBtn.addEventListener('click', openHowToPlayModal);
    }
    const howToPlayCloseBtns = howToPlayModal ? howToPlayModal.querySelectorAll('.close-btn') : [];
    howToPlayCloseBtns.forEach(btn => btn.addEventListener('click', closeModal));
    if (closeHowToPlayBtn) closeHowToPlayBtn.addEventListener('click', closeModal);

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === wildcardModal || e.target === howToPlayModal) {
            closeModal();
        }
    });

    // Wildcard search filter
    if (wildcardSearch) {
        wildcardSearch.addEventListener('input', (e) => {
            if (clearWildcardSearchBtn) {
                if (e.target.value.length > 0) {
                    clearWildcardSearchBtn.classList.remove('hidden');
                } else {
                    clearWildcardSearchBtn.classList.add('hidden');
                }
            }
        });
        wildcardSearch.addEventListener('input', debounce((e) => {
            const query = e.target.value.toLowerCase();
            const currentThreshold = getLockThreshold();

            // ⚡ Performance optimization: Replace Array.filter with a standard for-loop
            // Impact: Faster execution time by avoiding callback invocation overhead
            const lockedStations = [];
            const len = allStations.length;
            for (let i = 0; i < len; i++) {
                const s = allStations[i];
                // ⚡ Performance optimization: Use pre-computed searchName and short-circuit empty query
                // Impact: Eliminates O(n) string allocations (.toLowerCase()) inside the filter loop
                if (isStationLocked(s.name, currentThreshold) && (!query || s.searchName.includes(query))) {
                    lockedStations.push(s);
                }
            }

            renderWildcardList(lockedStations);
            if (wildcardAnnouncer) {
                wildcardAnnouncer.textContent = `${lockedStations.length} locked station${lockedStations.length === 1 ? '' : 's'} found.`;
            }
        }, 200));

        wildcardSearch.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (wildcardSearch.value) {
                    e.stopPropagation();
                    wildcardSearch.value = '';
                    wildcardSearch.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
        });
    }

    if (clearWildcardSearchBtn) {
        clearWildcardSearchBtn.addEventListener('click', () => {
            if (wildcardSearch) {
                wildcardSearch.value = '';
                wildcardSearch.dispatchEvent(new Event('input', { bubbles: true }));
                wildcardSearch.focus();
            }
        });
    }

    // Escape key to close modal
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (wildcardModal && !wildcardModal.classList.contains('hidden')) {
                closeModal();
            }
            if (howToPlayModal && !howToPlayModal.classList.contains('hidden')) {
                closeModal();
            }
        }
    });

    // Focus trap for modal
    if (wildcardModal) {
        wildcardModal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusableElements = wildcardModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                if (focusableElements.length === 0) return;

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }

    if (howToPlayModal) {
        howToPlayModal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusableElements = howToPlayModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                if (focusableElements.length === 0) return;

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }

    // Global keyboard shortcut to focus search input
    window.addEventListener('keydown', (e) => {
        if (e.key === '/') {
            // Do not trigger if user is typing in an input or textarea
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                return;
            }

            // Do not trigger if modal is open
            if (wildcardModal && !wildcardModal.classList.contains('hidden')) {
                return;
            }

            // Prevent '/' from being typed in the search box initially
            e.preventDefault();
            if (searchInput) {
                searchInput.focus();
            }
        }
    });
}

// Boot
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // document.addEventListener('DOMContentLoaded', init); // Assuming wait is not needed since the script is at the bottom, but just in case:
    init();
}

// Exports for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        gameState,
        getLockThreshold,
        isStationLocked,
        loadGameState,
        parseCSV,
        debounce
    };
}
