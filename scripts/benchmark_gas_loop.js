
const { performance } = require('perf_hooks');

const ROW_COUNT = 10000;
const HEADER_ROW_COUNT = 1;

// Mock data
const values = new Array(ROW_COUNT + HEADER_ROW_COUNT).fill(0).map((_, i) => {
  if (i === 0) return ["Station Name", "Lines", "Colours", "Zones", "Times Used", "Locked", "Notes"];
  return [`Station ${i}`, "Line 1", "Red", "1", i % 3, i % 2 === 0 ? "Yes" : "No", ""];
});

const lockThreshold = 1;
const STATION_NAME_COL = 0;
const TIMES_USED_COL = 4;
const CURRENTLY_LOCKED_COL = 5;

function benchmark(name, fn) {
  // Warmup
  for (let i = 0; i < 100; i++) fn();

  const start = performance.now();
  for (let i = 0; i < 1000; i++) fn();
  const end = performance.now();
  console.log(`${name}: ${(end - start).toFixed(2)}ms`);
}

function original() {
  let stationsUpdated = 0;
  const lockStatuses = [];
  for (let i = HEADER_ROW_COUNT; i < values.length; i++) {
    const stationName = values[i][STATION_NAME_COL];
    if (stationName === "" || stationName == null) {
      lockStatuses.push([values[i][CURRENTLY_LOCKED_COL]]);
      continue;
    }

    const timesUsedRaw = values[i][TIMES_USED_COL];
    const timesUsed = (timesUsedRaw === "" || timesUsedRaw == null || isNaN(parseInt(timesUsedRaw, 10))) ? 0 : parseInt(timesUsedRaw, 10);

    let isLocked = "No";
    if (timesUsed >= lockThreshold) {
      isLocked = "Yes";
    }

    if (values[i][CURRENTLY_LOCKED_COL] !== isLocked) {
        stationsUpdated++;
    }
    lockStatuses.push([isLocked]);
  }
  return lockStatuses;
}

function optimizedPreallocated() {
  let stationsUpdated = 0;
  const len = values.length - HEADER_ROW_COUNT;
  const lockStatuses = new Array(len);
  for (let i = 0; i < len; i++) {
    const row = values[i + HEADER_ROW_COUNT];
    const stationName = row[STATION_NAME_COL];
    if (stationName === "" || stationName == null) {
      lockStatuses[i] = [row[CURRENTLY_LOCKED_COL]];
      continue;
    }

    const timesUsedRaw = row[TIMES_USED_COL];
    const timesUsed = (timesUsedRaw === "" || timesUsedRaw == null || isNaN(parseInt(timesUsedRaw, 10))) ? 0 : parseInt(timesUsedRaw, 10);

    let isLocked = "No";
    if (timesUsed >= lockThreshold) {
      isLocked = "Yes";
    }

    if (row[CURRENTLY_LOCKED_COL] !== isLocked) {
        stationsUpdated++;
    }
    lockStatuses[i] = [isLocked];
  }
  return lockStatuses;
}

const YES_ARRAY = ["Yes"];
const NO_ARRAY = ["No"];

function optimizedPreallocatedReusingRefs() {
  let stationsUpdated = 0;
  const len = values.length - HEADER_ROW_COUNT;
  const lockStatuses = new Array(len);
  for (let i = 0; i < len; i++) {
    const row = values[i + HEADER_ROW_COUNT];
    const stationName = row[STATION_NAME_COL];
    if (stationName === "" || stationName == null) {
      const current = row[CURRENTLY_LOCKED_COL];
      if (current === "Yes") lockStatuses[i] = YES_ARRAY;
      else if (current === "No") lockStatuses[i] = NO_ARRAY;
      else lockStatuses[i] = [current];
      continue;
    }

    const timesUsedRaw = row[TIMES_USED_COL];
    const timesUsed = (timesUsedRaw === "" || timesUsedRaw == null || isNaN(parseInt(timesUsedRaw, 10))) ? 0 : parseInt(timesUsedRaw, 10);

    let isLocked = "No";
    if (timesUsed >= lockThreshold) {
      isLocked = "Yes";
    }

    if (row[CURRENTLY_LOCKED_COL] !== isLocked) {
        stationsUpdated++;
    }
    lockStatuses[i] = isLocked === "Yes" ? YES_ARRAY : NO_ARRAY;
  }
  return lockStatuses;
}

benchmark("Original (loop + push + literals)", original);
benchmark("Optimized (preallocated + literals)", optimizedPreallocated);
benchmark("Optimized (preallocated + reused refs)", optimizedPreallocatedReusingRefs);
