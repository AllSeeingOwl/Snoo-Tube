# How to Play Pool Subway & Use the Tracker App

## What is Pool Subway?
Pool Subway is a twist on traditional 8-ball pool, combining cue skill with geographic knowledge of New York's iconic subway network. Players must call out a valid NY Subway station that corresponds with the colour and type (solid/stripe) of the ball potted.

## How to Play

### 1. Basic Gameplay Integration
* Play standard 8-ball pool. Solids map to primary lines, stripes map to secondary lines.
* After potting a ball, call out a NY Subway station matching the ball's color mapping.
* Stations can only be used once per game (unless modified by Tiering or Wildcard rules).
  * A valid station must be on the official NY Subway map and match the colour rules.
  * Players have **10 seconds** to call a station after potting a colour; failure results in a forfeit of that shot's points and the end of their turn.

### 2. Colour-to-Line Assignments
| Ball Colour | Solid Lines | Stripe Lines |
| :--- | :--- | :--- |
| **Yellow** | N, Q | R, W |
| **Blue** | A | C, E |
| **Red** | 1, 2 | 3 |
| **Purple** | 7 | 7 |
| **Orange** | B, D | F, M |
| **Green** | 4 | 5, 6 |
| **Brown/Burgundy** | J | Z |
| **Black (8-Ball)** | L, G | N/A |

* **Interchanges:** Stations serving multiple lines can count for *any* of their associated lines, provided the line matches the colour potted.

### 3. Station Usage Rules
* Once a station is called correctly, it is "locked" and cannot be reused (unless modified by Wildcard rules or Station Reuse Tiering).
* **Valid stations must:**
  * Be currently active on the official NY Subway map.
  * Match the colour line(s) associated with the ball potted (see Section 2).
* **Incorrect station call** (e.g., wrong line, already used, not on the map, out of time) results in:
  * Standard pool fouls (e.g., ball-in-hand for opponent).
  * The player's turn ends.

### 4. Advanced Options
* **Station Reuse Tiering:**
  * *Casual:* Stations are reusable.
  * *Intermediate:* Each station may be used twice per game.
  * *Advanced:* Strict one-time use per station per game.
* **Out-of-Stations Rule:**
  * If a player believes no valid, unused stations remain for a required line, they may:
    * Call an Interchange station that serves the required line (even if primarily known for other lines).
    * If challenged and incorrect, the standard penalty applies. If correct, play continues.
* **Staten Island & Shuttles Wildcard Feature (Optional):**
  * Once per game, immediately after potting *any* coloured ball, a player may choose to call out a station on the **Staten Island Railway** or any **Shuttle (S)** line.
  * If the wildcard station call is valid, they **unlock one previously used station**, making it available to be called again later in the game by either player. The player must declare which station is being unlocked.
  * This wildcard call replaces the standard requirement to name a station matching the potted colour for that shot.

## How to Use the Tracker App

The **Pool Subway Tracker** is a web-based companion app designed to help you keep track of stations as you play.

### Core Features
- **Search & Filter:** Instantly search for stations by name, line, or colour.
- **Difficulty Tiers:** Seamlessly switch between Advanced (1 use), Intermediate (2 uses), and Casual (Unlimited uses) rules. The app will automatically lock stations based on your tier.
- **Locking Stations:** When a valid station is called, find it in the list and click "Record Use". It will automatically be locked and greyed out based on the tier rules.
- **Staten Island Wildcard:** Easily unlock previously used stations using the built-in wildcard button.
- **Offline Support:** Built as a Progressive Web App (PWA). You can install it on your mobile device and use it without an internet connection.
- **Data Persistence:** Your current game state is automatically saved to your device's local storage so you won't lose your progress if you refresh the page.

## How to Install the App

### Running Locally on Your Computer
Because the app needs to load the `.csv` file database and register a Service Worker, you must run it through a local web server (you cannot simply double-click the `index.html` file).

If you have Node.js and `pnpm` installed, you can easily start a server:

1. Open your terminal/command prompt.
2. Navigate to the root folder of this project.
3. Install dependencies by running:
   ```bash
   pnpm install
   ```
4. Start the server by running:
   ```bash
   pnpm start
   ```
   *(Or `node server.js`).*
5. Open your web browser and go to `http://localhost:3000/pool/`.

### Installing on Mobile for Offline Use
You can add this app to your mobile device's home screen. Once added, it will behave like a native app and will work perfectly even when you have no internet connection.

#### For iOS (Safari):
1. Host the app online (e.g., using GitHub Pages, Netlify, or Vercel), or navigate to the hosted URL on your iPhone/iPad.
2. Tap the **Share** button (the square with an arrow pointing up) at the bottom of the screen.
3. Scroll down the share sheet and tap **Add to Home Screen**.
4. Confirm the name and tap **Add**. The app icon will now appear on your home screen.

#### For Android (Chrome):
1. Host the app online, or navigate to the hosted URL on your Android device.
2. You may see a prompt at the bottom of the screen asking to "Add Pool Subway to Home screen". If so, tap it.
3. If the prompt doesn't appear, tap the three-dot menu icon in the top right corner.
4. Tap **Install app** or **Add to Home screen**.
5. Follow the on-screen instructions.
