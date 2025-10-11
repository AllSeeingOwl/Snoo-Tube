document.addEventListener('DOMContentLoaded', () => {
    const stationTableBody = document.getElementById('station-table-body');
    const tierSelect = document.getElementById('tier');
    const ballColourSelect = document.getElementById('ball-colour');
    const stationInput = document.getElementById('station-input');
    const submitBtn = document.getElementById('submit-btn');
    const wildcardBtn = document.getElementById('wildcard-btn');
    const resetBtn = document.getElementById('reset-btn');
    const messageArea = document.getElementById('message-area');
    const searchBar = document.getElementById('search-bar');

    let stations = [];
    let stationUsage = {};

    const colorLineMapping = {
        'Red': ['Central', 'Metropolitan', 'Weaver'],
        'Yellow': ['Circle', 'Lioness'],
        'Green': ['District', 'Suffragette'],
        'Brown': ['Bakerloo', 'Windrush'],
        'Blue': ['Piccadilly', 'Victoria'],
        'Pink': ['Hammersmith & City', 'Elizabeth'],
        'Black': ['Northern', 'Jubilee']
    };

    // Fetch station data
    fetch('stations.json')
        .then(response => response.json())
        .then(data => {
            stations = data;
            initializeUsage();
            renderTable();
        });

    function initializeUsage() {
        stations.forEach(station => {
            stationUsage[station.name.toLowerCase()] = 0;
        });
    }

    function renderTable(filter = '') {
        stationTableBody.innerHTML = '';
        const filteredStations = stations.filter(station => station.name.toLowerCase().includes(filter.toLowerCase()));

        filteredStations.forEach(station => {
            const row = document.createElement('tr');
            const usage = stationUsage[station.name.toLowerCase()];
            const locked = isStationLocked(station.name, tierSelect.value);

            if (locked) {
                row.classList.add('locked');
            }

            const linesServed = station.lines.map(line => line.line).join(', ');
            const validColours = station.lines.map(line => line.colour).filter(c => c).join(', ');

            row.innerHTML = `
                <td>${station.name}</td>
                <td>${linesServed}</td>
                <td>${validColours}</td>
                <td>${station.zone}</td>
                <td>${usage}</td>
                <td class="station-status ${locked ? 'status-locked' : 'status-available'}">${locked ? 'Locked' : 'Available'}</td>
            `;
            stationTableBody.appendChild(row);
        });
    }

    function isStationLocked(stationName, tier) {
        const usage = stationUsage[stationName.toLowerCase()];
        if (tier === 'Advanced') return usage >= 1;
        if (tier === 'Intermediate') return usage >= 2;
        return false; // Casual tier
    }

    function findStation(stationName) {
        return stations.find(s => s.name.toLowerCase() === stationName.toLowerCase());
    }

    function displayMessage(message, isError = false) {
        messageArea.textContent = message;
        messageArea.style.color = isError ? '#ea4335' : '#34a853';
    }

    submitBtn.addEventListener('click', () => {
        const stationName = stationInput.value.trim();
        const selectedColor = ballColourSelect.value;

        if (!stationName) {
            displayMessage('Please enter a station name.', true);
            return;
        }

        const station = findStation(stationName);

        if (!station) {
            displayMessage(`Station "${stationName}" not found.`, true);
            return;
        }

        if (isStationLocked(station.name, tierSelect.value)) {
            displayMessage(`Station "${station.name}" is locked.`, true);
            return;
        }

        const validLines = colorLineMapping[selectedColor];
        const isMatch = station.lines.some(lineInfo => {
            const lineName = lineInfo.line;
            return validLines.some(validLine => lineName.includes(validLine));
        });

        if (isMatch) {
            stationUsage[station.name.toLowerCase()]++;
            displayMessage(`Correct! "${station.name}" is a valid ${selectedColor} station.`, false);
            stationInput.value = '';
            renderTable(searchBar.value);
        } else {
            displayMessage(`"${station.name}" is not a valid station for the ${selectedColor} ball.`, true);
        }
    });

    wildcardBtn.addEventListener('click', () => {
        const stationNameToUnlock = prompt('Enter the name of the station to unlock with your Overground Wildcard:');
        if (!stationNameToUnlock) return;

        const station = findStation(stationNameToUnlock);
        if (!station) {
            displayMessage(`Station "${stationNameToUnlock}" not found.`, true);
            return;
        }

        if (stationUsage[station.name.toLowerCase()] > 0) {
            stationUsage[station.name.toLowerCase()] = 0;
            displayMessage(`Wildcard used! "${station.name}" has been unlocked.`, false);
            renderTable(searchBar.value);
        } else {
            displayMessage(`"${station.name}" is not currently used.`, true);
        }
    });

    resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset the game? This will clear all station usage.')) {
            initializeUsage();
            displayMessage('Game has been reset.', false);
            renderTable();
        }
    });

    tierSelect.addEventListener('change', () => renderTable(searchBar.value));
    searchBar.addEventListener('input', () => renderTable(searchBar.value));
});