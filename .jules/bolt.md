## 2024-03-19 - Pre-computing Lowercase Strings for Search Filters
**Learning:** Calling `.toLowerCase()` repeatedly within an array `filter` loop for O(n) text search causes measurable main-thread blocking and garbage collection overhead. Pre-computing and caching the lowercase versions of these strings on the object directly during initialization provides a massive, measurable speed boost (reduced filter time by >60% in a 10k iteration local node benchmark).
**Action:** When working with frequent text-based filtering on static lists, always pre-compute search properties (e.g. `searchName`) on the object during the initial data parse rather than running string manipulation functions on every render/filter cycle.

## $(date +%Y-%m-%d) - Pre-compute Combined Search Strings
**Learning:** In vanilla JS apps with frequent filtering (like searching through a list of items), doing string concatenation and multiple `.includes()` checks inside the array `.filter()` hot-loop causes significant overhead due to constant string allocation.
**Action:** Move all string concatenation to the initial parsing phase (`parseCSV`). Pre-compute a single `searchCombined` property (e.g., `name|lines|colours`) and perform a single `.includes()` check during the filter loop.

## 2024-03-22 - Avoid Recalculating Static Values in Hot Loops
**Learning:** In a vanilla JS array `filter` and `forEach` render cycle for 300+ items, repeatedly calling a getter function `getLockThreshold()` that accesses global state inside `isStationLocked(stationName)` causes significant unnecessary overhead. A micro-benchmark showed an ~18% execution time reduction when computing the value once and passing it into the loop as an argument.
**Action:** When evaluating items in a hot loop against a static application state (like a difficulty tier), compute the state threshold outside the loop and pass it as an argument rather than re-evaluating it inside the loop for every single item.
