const fs = require('fs');
let code = fs.readFileSync('public/js/app.js', 'utf8');

// Add gameState variables
code = code.replace(
`let gameState = {
    tier: 'Advanced',
    usedCounts: Object.create(null) // { "Station Name": count }
};`,
`let gameState = {
    tier: 'Advanced',
    usedCounts: Object.create(null), // { "Station Name": count }
    totalUsed: 0,
    lockedCount: 0
};`);

// Update loadGameState
code = code.replace(
`                if (parsed.usedCounts && typeof parsed.usedCounts === 'object') {
                    // Safe object to prevent prototype pollution from storage
                    gameState.usedCounts = Object.create(null);
                    for (const key in parsed.usedCounts) {
                        if (Object.prototype.hasOwnProperty.call(parsed.usedCounts, key)) {
                            // 🛡️ Sentinel: Prevent prototype pollution
                            if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;

                            const val = parsed.usedCounts[key];
                            if (typeof val === 'number' && Number.isInteger(val) && val >= 0) {
                                gameState.usedCounts[key] = val;
                            }
                        }
                    }
                }`,
`                if (parsed.usedCounts && typeof parsed.usedCounts === 'object') {
                    // Safe object to prevent prototype pollution from storage
                    gameState.usedCounts = Object.create(null);
                    gameState.totalUsed = 0;
                    gameState.lockedCount = 0;
                    const threshold = getLockThreshold();
                    for (const key in parsed.usedCounts) {
                        if (Object.prototype.hasOwnProperty.call(parsed.usedCounts, key)) {
                            const val = parsed.usedCounts[key];
                            if (typeof val === 'number' && Number.isInteger(val) && val >= 0) {
                                gameState.usedCounts[key] = val;
                                if (val > 0) gameState.totalUsed++;
                                if (val >= threshold) gameState.lockedCount++;
                            }
                        }
                    }
                }`);

// Handle tier change
code = code.replace(
`    // Tier Selection
    if (tierSelect) {
        tierSelect.addEventListener('change', (e) => {
            gameState.tier = e.target.value;
            saveGameState();`,
`    // Tier Selection
    if (tierSelect) {
        tierSelect.addEventListener('change', (e) => {
            gameState.tier = e.target.value;

            // Re-evaluate locked count since threshold changed
            const threshold = getLockThreshold();
            let newLockedCount = 0;
            for (const key in gameState.usedCounts) {
                // 🛡️ Sentinel: Prevent prototype pollution
                if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;

                if (gameState.usedCounts[key] >= threshold) {
                    newLockedCount++;
                }
            }
            gameState.lockedCount = newLockedCount;

            saveGameState();`);

// Optimize updateResetButtonState
code = code.replace(
`function updateResetButtonState() {
    if (!resetBtn) return;

    let hasUsedStations = false;
    // ⚡ Performance optimization: Iterate over static array instead of for...in on object
    // Impact: ~7x faster execution in hot paths by avoiding object property enumeration
    const len = allStations.length;
    for (let i = 0; i < len; i++) {
        if (gameState.usedCounts[allStations[i].name] > 0) {
            hasUsedStations = true;
            break;
        }
    }

    if (hasUsedStations) {
        resetBtn.removeAttribute('aria-disabled');
        resetBtn.removeAttribute('title');
    } else {
        resetBtn.setAttribute('aria-disabled', 'true');
        resetBtn.setAttribute('title', 'No stations have been used yet.');
    }
}`,
`function updateResetButtonState() {
    if (!resetBtn) return;

    // ⚡ Performance optimization: O(1) state check using cached count
    // Impact: Avoids O(N) loop over all stations
    if (gameState.totalUsed > 0) {
        resetBtn.removeAttribute('aria-disabled');
        resetBtn.removeAttribute('title');
    } else {
        resetBtn.setAttribute('aria-disabled', 'true');
        resetBtn.setAttribute('title', 'No stations have been used yet.');
    }
}`);

// Optimize updateWildcardButtonState
code = code.replace(
`function updateWildcardButtonState() {
    if (!wildcardBtn) return;
    const currentThreshold = getLockThreshold();

    let hasLocked = false;
    // ⚡ Performance optimization: Iterate over static array instead of for...in on object
    // Impact: ~7x faster execution in hot paths by avoiding object property enumeration
    const len = allStations.length;
    for (let i = 0; i < len; i++) {
        if (gameState.usedCounts[allStations[i].name] >= currentThreshold) {
            hasLocked = true;
            break;
        }
    }

    if (hasLocked) {
        wildcardBtn.removeAttribute('aria-disabled');
        wildcardBtn.removeAttribute('title');
    } else {
        wildcardBtn.setAttribute('aria-disabled', 'true');
        wildcardBtn.setAttribute('title', 'No locked stations available to unlock.');
    }
}`,
`function updateWildcardButtonState() {
    if (!wildcardBtn) return;

    // ⚡ Performance optimization: O(1) state check using cached count
    // Impact: Avoids O(N) loop over all stations
    if (gameState.lockedCount > 0) {
        wildcardBtn.removeAttribute('aria-disabled');
        wildcardBtn.removeAttribute('title');
    } else {
        wildcardBtn.setAttribute('aria-disabled', 'true');
        wildcardBtn.setAttribute('title', 'No locked stations available to unlock.');
    }
}`);

// Update handleStationClick
code = code.replace(
`    if (confirm(\`Record use for \${stationName}?\`)) {
        gameState.usedCounts[stationName] = (gameState.usedCounts[stationName] || 0) + 1;
        saveGameState();`,
`    if (confirm(\`Record use for \${stationName}?\`)) {
        const currentUses = gameState.usedCounts[stationName] || 0;
        const newUses = currentUses + 1;
        gameState.usedCounts[stationName] = newUses;

        if (currentUses === 0) gameState.totalUsed++;
        if (newUses === getLockThreshold()) gameState.lockedCount++;

        saveGameState();`);

// Update unlockStation
code = code.replace(
`    if (confirm(\`Use Overground Wildcard to unlock \${stationName}?\`)) {
        // Reset count to 0
        gameState.usedCounts[stationName] = 0;
        saveGameState();`,
`    if (confirm(\`Use Overground Wildcard to unlock \${stationName}?\`)) {
        // Reset count to 0
        const oldUses = gameState.usedCounts[stationName] || 0;
        gameState.usedCounts[stationName] = 0;

        if (oldUses > 0) gameState.totalUsed--;
        if (oldUses >= getLockThreshold()) gameState.lockedCount--;

        saveGameState();`);

// Update resetGame
code = code.replace(
`function resetGame() {
    if (confirm('Are you sure you want to reset all station usages for a new game?')) {
        gameState.usedCounts = Object.create(null);
        saveGameState();`,
`function resetGame() {
    if (confirm('Are you sure you want to reset all station usages for a new game?')) {
        gameState.usedCounts = Object.create(null);
        gameState.totalUsed = 0;
        gameState.lockedCount = 0;
        saveGameState();`);

fs.writeFileSync('public/js/app.js', code);
