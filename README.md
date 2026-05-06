# Station Tracker Apps Hub

This repository contains a collection of web-based companion tracker apps for various twists on traditional cue sports (snooker and pool), combining them with geographic knowledge of iconic public transport networks around the world.

## The Global Hub

The repository serves a global Hub menu from the root path (`public/index.html`), allowing you to easily navigate between the different game modes available.

## Available Games

The repository currently includes five main game variants, each hosted in its own directory:

### 1. Snooker Tubey (London Underground)
* **Location:** `snooker/`
* **Game Type:** Snooker
* **Concept:** Call out a valid London Underground, Overground, or Elizabeth Line station matching the colour of the ball potted.

### 2. Pool Subway (New York Subway)
* **Location:** `pool/`
* **Game Type:** Pool (8-Ball/9-Ball)
* **Concept:** Call out a valid New York Subway station matching the line colour associated with the solid or stripe ball being played.

### 3. Paris Pool (Paris Metro)
* **Location:** `paris/`
* **Game Type:** Pool (8-Ball/9-Ball)
* **Concept:** Call out a valid Paris Metro station that matches the colour of the ball being potted.

### 4. Tokyo Snooker (Tokyo Subway)
* **Location:** `tokyo-snooker/`
* **Game Type:** Snooker
* **Concept:** Call out a valid Tokyo Subway station matching the colour of the ball potted.

### 5. Tokyo Pool (Tokyo Subway)
* **Location:** `tokyo-pool/`
* **Game Type:** Pool (8-Ball/9-Ball)
* **Concept:** Call out a valid Tokyo Subway station matching the line colour of the solid or stripe ball being played.

## Common Gameplay Rules

While each city has its specific transport map, the core concept remains the same across all variants:
* Players must call out a valid station that corresponds with the colour of the ball being potted.
* The station must be currently active on the official transport map for that city.
* A station can only be used once per game (unless modified by difficulty tiers or wildcard rules).
* Players have a set time limit (typically 10 seconds) to call a station after a ball is potted.

## Tracker App Features

Each game variant comes with its own Progressive Web App (PWA) tracker to help players manage the game state:
* **Search & Filter:** Instantly search for stations by name, line, or colour.
* **Difficulty Tiers:** Switch between Advanced (1 use), Intermediate (2 uses), and Casual (Unlimited uses) rules. The app automatically locks stations based on the active tier.
* **Locking Stations:** Record a valid station use. The app grays it out and locks it based on the tier rules.
* **Wildcard Features:** Unique wildcard mechanics (e.g., London Overground in Snooker Tubey) to unlock previously used stations.
* **Offline Support:** Installable as a PWA for fully offline use.
* **Data Persistence:** Game state is saved automatically to the device's local storage to prevent progress loss on refresh.

## How to Run Locally

To run the apps locally (which is required to load the station data databases and register Service Workers), you need Node.js and `pnpm`.

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the Express server:
   ```bash
   pnpm start
   ```

3. Open your web browser and navigate to: `http://localhost:3000/`

You will see the global Hub menu, from which you can launch any of the individual tracker apps.

## Running Tests

To run the full test suite and check code test coverage (across all game variants), use the following command:

```bash
pnpm test
```
