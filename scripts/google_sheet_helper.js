/**
 * @OnlyCurrentDoc
 *
 * This script provides functions to manage the Snooker Tube Game station tracker sheet.
 * It can update the "Currently Locked?" status of stations, reset stations for wildcards,
 * and clear the sheet for a new game.
 */

// --- Configuration ---

// Define column numbers (0-indexed, so A=0, B=1, etc.)
// IMPORTANT: Adjust these if your column order changes in the sheet!
const STATION_NAME_COL = 0; // Column A: Station Name
const LINES_SERVED_COL = 1; // Column B: Lines Served
const VALID_FOR_COLOURS_COL = 2;// Column C: Valid for Colours
const ZONES_COL = 3; // Column D: Zone(s)
const TIMES_USED_COL = 4; // Column E: Times Used (This Game) - CRUCIAL for locking logic
const CURRENTLY_LOCKED_COL = 5; // Column F: Currently Locked? - This will be updated by the script
const NOTES_COL = 6; // Column G: Notes
const HEADER_ROW_COUNT = 1; // Number of header rows to skip

// Game Tiers
const TIER_ADVANCED = "Advanced";
const TIER_INTERMEDIATE = "Intermediate";
const TIER_CASUAL = "Casual";

// --- Menu Function ---

/**
 * Adds a custom menu to the Google Sheet UI to run the script functions.
 */
function onOpen() {
  SpreadsheetApp.getUi()
      .createMenu('Snooker Game Helper')
      .addItem('Update Station Locks (Advanced Tier)', 'updateLocksAdvanced')
      .addItem('Update Station Locks (Intermediate Tier)', 'updateLocksIntermediate')
      .addSeparator()
      .addItem('Unlock Station (for Wildcard)', 'unlockSingleStationPrompt')
      .addSeparator()
      .addItem('Reset All Stations for New Game', 'resetBoardForNewGame')
      .addToUi();
}

// --- Core Logic Functions ---

/**
 * Updates the "Currently Locked?" status for all stations based on the Advanced tier rules.
 * Advanced Tier: Station is locked if used 1 or more times.
 */
function updateLocksAdvanced() {
  updateStationLocks(TIER_ADVANCED);
}

/**
 * Updates the "Currently Locked?" status for all stations based on the Intermediate tier rules.
 * Intermediate Tier: Station is locked if used 2 or more times.
 */
function updateLocksIntermediate() {
  updateStationLocks(TIER_INTERMEDIATE);
}

/**
 * General function to update station locks based on the selected game tier.
 * @param {string} tier The game tier ('Advanced', 'Intermediate', or 'Casual').
 */
function updateStationLocks(tier) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  const ui = SpreadsheetApp.getUi();

  if (tier === TIER_CASUAL) {
    ui.alert('Casual Tier Selected', 'In Casual Tier, stations are always reusable. No locking applied by this script.', ui.ButtonSet.OK);

    const lockStatusValues = [];
    let stationsUpdated = 0;

    for (let i = HEADER_ROW_COUNT; i < values.length; i++) {
      let isLocked = values[i][CURRENTLY_LOCKED_COL];
      if (values[i][STATION_NAME_COL] !== "") { // Process only if station name exists
        if (isLocked !== "No") {
          isLocked = "No";
          stationsUpdated++;
        }
      }
      lockStatusValues.push([isLocked]);
    }

    if (lockStatusValues.length > 0) {
      sheet.getRange(HEADER_ROW_COUNT + 1, CURRENTLY_LOCKED_COL + 1, lockStatusValues.length, 1).setValues(lockStatusValues);
    }

    SpreadsheetApp.flush(); // Apply changes
    return;
  }

  let lockThreshold;
  if (tier === TIER_ADVANCED) {
    lockThreshold = 1;
  } else if (tier === TIER_INTERMEDIATE) {
    lockThreshold = 2;
  } else {
    ui.alert('Error', 'Invalid game tier specified.', ui.ButtonSet.OK);
    return;
  }

  let stationsUpdated = 0;
  const lockStatusValues = [];

  // Start from row after header to skip header
  for (let i = HEADER_ROW_COUNT; i < values.length; i++) {
    const stationName = values[i][STATION_NAME_COL];
    let isLocked = values[i][CURRENTLY_LOCKED_COL];

    if (stationName !== "" && stationName != null) { // Skip empty rows or rows without station names
      const timesUsedRaw = values[i][TIMES_USED_COL];
      // Ensure timesUsed is treated as a number. If it's blank or not a number, treat as 0.
      const timesUsed = (timesUsedRaw === "" || timesUsedRaw == null || isNaN(parseInt(timesUsedRaw, 10))) ? 0 : parseInt(timesUsedRaw, 10);

      const targetLockStatus = (timesUsed >= lockThreshold) ? "Yes" : "No";

      if (isLocked !== targetLockStatus) {
        isLocked = targetLockStatus;
        stationsUpdated++;
      }
    }
    lockStatusValues.push([isLocked]);
  }

  if (lockStatusValues.length > 0) {
    sheet.getRange(HEADER_ROW_COUNT + 1, CURRENTLY_LOCKED_COL + 1, lockStatusValues.length, 1).setValues(lockStatusValues);
  }

  SpreadsheetApp.flush(); // Apply all pending changes

  if (stationsUpdated > 0) {
    ui.alert('Update Complete', `${stationsUpdated} station lock statuses updated for ${tier} Tier.`, ui.ButtonSet.OK);
  } else {
    ui.alert('Update Complete', `No station lock statuses needed an update for ${tier} Tier.`, ui.ButtonSet.OK);
  }
}

/**
 * Prompts the user for a station name and unlocks it (sets "Currently Locked?" to "No"
 * and "Times Used (This Game)" to 0).
 */
function unlockSingleStationPrompt() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
      'Unlock Station',
      'Enter the exact name of the station to unlock (for Wildcard):',
      ui.ButtonSet.OK_CANCEL);

  if (response.getSelectedButton() == ui.Button.OK) {
    const stationToUnlock = response.getResponseText().trim();
    if (stationToUnlock) {
      unlockStationByName(stationToUnlock);
    } else {
      ui.alert('Input Error', 'No station name entered.', ui.ButtonSet.OK);
    }
  }
}

/**
 * Finds a station by name and resets its "Times Used" and "Currently Locked?" status.
 * @param {string} stationName The name of the station to unlock.
 */
function unlockStationByName(stationName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  const ui = SpreadsheetApp.getUi();

  let stationFound = false;

  for (let i = HEADER_ROW_COUNT; i < values.length; i++) {
    // Ensure comparison is case-insensitive and trims whitespace
    if (values[i][STATION_NAME_COL] && values[i][STATION_NAME_COL].toString().trim().toLowerCase() === stationName.toLowerCase()) {
      // Set Times Used to 0, Currently Locked to No, and add a note
      // These three columns (E, F, G) are contiguous
      sheet.getRange(i + 1, TIMES_USED_COL + 1, 1, 3).setValues([[0, "No", "Unlocked by Wildcard " + new Date().toLocaleDateString()]]);
      stationFound = true;
      break;
    }
  }

  SpreadsheetApp.flush(); // Apply changes

  if (stationFound) {
    ui.alert('Station Unlocked', `'${stationName}' has been unlocked. Its "Times Used" is set to 0 and "Currently Locked?" to "No".`, ui.ButtonSet.OK);
  } else {
    ui.alert('Station Not Found', `'${stationName}' was not found in the list. Please check spelling.`, ui.ButtonSet.OK);
  }
}

/**
 * Resets the "Times Used (This Game)" to 0 and "Currently Locked?" to "No" for all stations.
 * Also clears any notes.
 */
function resetBoardForNewGame() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
      'Confirm Reset',
      'Are you sure you want to reset all stations for a new game? This will set "Times Used" to 0, "Currently Locked?" to "No", and clear "Notes" for all entries.',
      ui.ButtonSet.YES_NO);

  if (response == ui.Button.YES) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const lastRow = sheet.getLastRow();

    // Ensure there's data beyond the header row
    if (lastRow > HEADER_ROW_COUNT) {
      // Get the range for "Times Used", "Currently Locked?", and "Notes" columns
      // This will be from row (HEADER_ROW_COUNT + 1) to lastRow
      // And columns TIMES_USED_COL + 1 to NOTES_COL + 1
      // Number of rows to change: lastRow - HEADER_ROW_COUNT
      // Number of columns to change: (NOTES_COL - TIMES_USED_COL) + 1 = 3
      const rangeToReset = sheet.getRange(HEADER_ROW_COUNT + 1, TIMES_USED_COL + 1, lastRow - HEADER_ROW_COUNT, 3);

      // Create an array of arrays with the reset values
      // For each row, we set [0, "No", ""] for the three columns (Times Used, Locked, Notes)
      const resetValues = [];
      for (let i = 0; i < lastRow - HEADER_ROW_COUNT; i++) {
        resetValues.push([0, "No", ""]); // Times Used = 0, Locked = No, Notes = ""
      }
      rangeToReset.setValues(resetValues);
    }
    SpreadsheetApp.flush(); // Apply changes
    ui.alert('Board Reset', 'All stations have been reset for a new game.', ui.ButtonSet.OK);
  }
}
